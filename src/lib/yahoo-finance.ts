import yahooFinanceModule from 'yahoo-finance2';

let yfInstance: any = null;

function getYfInstance() {
    if (yfInstance) return yfInstance;

    try {
        // Handle different import scenarios (CommonJS vs ESM interop)
        const YahooFinance = (yahooFinanceModule as any).default || yahooFinanceModule;

        if (typeof YahooFinance === 'function') {
            yfInstance = new YahooFinance();
        } else {
            // If it's not a function, maybe it's already the instance?
            console.warn('YahooFinance import is not a constructor, using as is:', YahooFinance);
            yfInstance = YahooFinance;
        }

        // Suppress "Yahoo Finance API Discontinued" warning
        if (yfInstance && typeof yfInstance.suppressNotices === 'function') {
            yfInstance.suppressNotices(['yahooSurvey']);
        }
    } catch (error) {
        console.error('Failed to initialize YahooFinance:', error);
        throw error;
    }

    return yfInstance;
}



export interface StockQuote {
    symbol: string;
    regularMarketPrice: number | null; // Allow null for missing data
    regularMarketChange: number;
    regularMarketChangePercent: number;
    currency: string;
    shortName: string;
}

export interface MarketIndex {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
}

export interface TopMover {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
}

export interface StockNews {
    uuid: string;
    title: string;
    publisher: string;
    link: string;
    providerPublishTime: number; // Unix timestamp
    type: string;
}

export async function getQuotes(tickers: string[]): Promise<StockQuote[]> {
    if (!tickers.length) return [];

    try {
        const yf = getYfInstance();
        // Cast the result to any first to avoid 'never' inference issues with the library's complex types
        const rawResult = await yf.quote(tickers) as any;

        // yahooFinance.quote returns a single object if one ticker, array if multiple.
        // We enforce array.
        const results = Array.isArray(rawResult) ? rawResult : [rawResult];

        return results.map((q: any) => ({
            symbol: q.symbol,
            regularMarketPrice: typeof q.regularMarketPrice === 'number' ? q.regularMarketPrice : null,
            regularMarketChange: q.regularMarketChange || 0,
            regularMarketChangePercent: q.regularMarketChangePercent || 0,
            currency: q.currency || 'USD',
            shortName: q.shortName || q.symbol
        }));
    } catch (error) {
        console.error('Failed to fetch quotes:', error);
        // Throwing error to let caller handle it, rather than returning empty array silently
        throw new Error(`Failed to fetch stock quotes: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

export async function getCompanyNews(ticker: string): Promise<StockNews[]> {
    try {
        const yf = getYfInstance();
        const result = await yf.search(ticker, { newsCount: 5 }) as any;

        // Validate result structure roughly before mapping
        if (!result || !result.news) {
            return [];
        }

        return result.news.map((item: {
            uuid: string;
            title: string;
            publisher: string;
            link: string;
            providerPublishTime: number; // Note: library might return Date or number, verify checking types
            type: string;
            [key: string]: any; // Allow other props but type the used ones
        }) => ({
            uuid: item.uuid,
            title: item.title,
            publisher: item.publisher,
            link: item.link,
            providerPublishTime: typeof item.providerPublishTime === 'number'
                ? item.providerPublishTime
                : new Date(item.providerPublishTime).getTime(),
            type: item.type
        }));
    } catch (error) {
        console.error(`Failed to fetch news for ${ticker}:`, error);
        // Return empty array for news is acceptable as it's secondary data, 
        // BUT we should log it properly.
        return [];
    }
}


export async function getMarketIndices(): Promise<MarketIndex[]> {
    const indices = ['^GSPC', '^NDX', '^RUT'];
    try {
        const quotes = await getQuotes(indices);
        return quotes.map(q => ({
            symbol: q.symbol,
            name: getIndexName(q.symbol),
            price: q.regularMarketPrice ?? 0,
            change: q.regularMarketChange,
            changePercent: q.regularMarketChangePercent
        }));
    } catch (error) {
        console.error('Failed to fetch market indices:', error);
        return [];
    }
}

export async function getTopMovers(): Promise<{ gainers: TopMover[], active: TopMover[] }> {
    try {
        const yf = getYfInstance();
        const queryOptions = { count: 5, lang: 'en-US' };

        // Yahoo Finance query for day gainers and most actives
        // Note: dailyGainers/mostActive are deprecated. Using screener.
        const [gainersResult, activeResult] = await Promise.all([
            yf.screener({ scrIds: 'day_gainers', count: 5 }),
            yf.screener({ scrIds: 'most_actives', count: 5 })
        ]);

        const mapToTopMover = (item: any): TopMover => ({
            symbol: item.symbol,
            name: item.shortName || item.longName || item.symbol,
            price: item.regularMarketPrice,
            change: item.regularMarketChange,
            changePercent: item.regularMarketChangePercent
        });

        return {
            gainers: (gainersResult.quotes || []).map(mapToTopMover),
            active: (activeResult.quotes || []).map(mapToTopMover)
        };
    } catch (error) {
        console.error('Failed to fetch top movers:', error);
        return { gainers: [], active: [] };
    }
}

function getIndexName(symbol: string): string {
    switch (symbol) {
        case '^GSPC': return 'S&P 500';
        case '^NDX': return 'NASDAQ 100';
        case '^RUT': return 'Russell 2000';
        default: return symbol;
    }
}

const SEARCH_ALIASES: Record<string, string> = {
    // Direct User Requests
    '제미나이': 'Google',
    'gemini': 'Google',
    '유니클로': 'Fast Retailing',
    'uniqlo': 'Fast Retailing',

    // Common Variations
    '구글': 'Google',
    '유튜브': 'Google',
    'youtube': 'Google',
    'chatgpt': 'Microsoft', // Often associated via OpenAI investment
    'openai': 'Microsoft',
};


// Simple in-memory cache
const SEARCH_CACHE = new Map<string, { timestamp: number, data: { ticker: string; name: string; exchange: string }[] }>();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 Hour

// Weight for US Major Exchanges
const MAJOR_EXCHANGES = ['NMS', 'NYQ', 'NGM', 'NASDAQ', 'NYSE'];

export async function searchStocks(query: string): Promise<{ ticker: string; name: string; exchange: string }[]> {
    try {
        const normalizedQuery = query.toLowerCase().trim();

        // 1. Check Cache
        const cached = SEARCH_CACHE.get(normalizedQuery);
        if (cached && (Date.now() - cached.timestamp < CACHE_TTL_MS)) {
            return cached.data;
        }

        const yf = getYfInstance();

        // 2. Check Aliases (Tier 1)
        const effectiveQuery = SEARCH_ALIASES[normalizedQuery] || query;

        const results = await yf.search(effectiveQuery);

        // 3. Filter & Map
        let stocks = results.quotes
            .filter((quote: any) => (quote.quoteType === 'EQUITY' || quote.quoteType === 'ETF'))
            .map((quote: any) => ({
                ticker: quote.symbol,
                name: quote.shortname || quote.longname || quote.symbol,
                exchange: quote.exchange,
            }));

        // 4. Intelligent Sorting (Tier 1.5)
        // Sort by: Exact Ticker > Major US Exchange > Name Match > Others
        stocks.sort((a: any, b: any) => {
            const queryUpper = query.toUpperCase();

            // Score A
            let scoreA = 0;
            if (a.ticker === queryUpper) scoreA += 100; // Exact Ticker
            if (MAJOR_EXCHANGES.includes(a.exchange)) scoreA += 50; // US Major
            if (a.name.toLowerCase().startsWith(normalizedQuery)) scoreA += 20; // Name Prefix

            // Score B
            let scoreB = 0;
            if (b.ticker === queryUpper) scoreB += 100;
            if (MAJOR_EXCHANGES.includes(b.exchange)) scoreB += 50;
            if (b.name.toLowerCase().startsWith(normalizedQuery)) scoreB += 20;

            return scoreB - scoreA; // Descending
        });

        const finalResults = stocks.slice(0, 5); // Limit to top 5

        // 5. Save to Cache
        if (finalResults.length > 0) {
            SEARCH_CACHE.set(normalizedQuery, { timestamp: Date.now(), data: finalResults });
        }

        return finalResults;

    } catch (error) {
        console.error('Failed to search stocks:', error);
        return [];
    }
}
