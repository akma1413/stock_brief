import { XMLParser } from 'fast-xml-parser';

export interface NewsItem {
    title: string;
    link: string;
    pubDate: string;
    source: string;
    snippet: string;
}

const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_"
});

export async function fetchGoogleNewsRSS(ticker: string, customQuery?: string): Promise<NewsItem[]> {
    // Query for authoritative sources
    // Using 'site:' operator for WSJ, Bloomberg, and Korea Economic Daily (hankyung.com)
    // Also including generic query to ensure we get *some* news if authoritative ones are silent, 
    // but the user requested prioritizing them. 
    // RFC Strategy: Fetch Authoritative. If empty, fallback is handled by caller (Yahoo Finance).

    const query = customQuery || `${ticker} site:wsj.com OR site:bloomberg.com OR site:hankyung.com`;
    const encodedQuery = encodeURIComponent(query);

    // Using US/English edition for WSJ/Bloomberg stability, but Hankyung might need KR edition?
    // Use global edition for now.
    const url = `https://news.google.com/rss/search?q=${encodedQuery}&hl=en-US&gl=US&ceid=US:en`;

    try {
        const response = await fetch(url, { next: { revalidate: 3600 } }); // Cache for 1 hour
        const xml = await response.text();
        const result = parser.parse(xml);

        const channel = result.rss?.channel;
        const items = channel?.item || [];

        const newsList = Array.isArray(items) ? items : [items];
        if (newsList.length === 0) return [];

        return newsList.map((item: any) => {
            // Source might be complex object or text
            // Google News RSS source tag: <source url="...">Source Name</source>
            const sourceName = item.source ? (item.source['#text'] || item.source) : 'Google News';

            return {
                title: item.title,
                link: item.link,
                pubDate: item.pubDate,
                source: String(sourceName),
                snippet: stripHtml(item.description || '')
            };
        });
    } catch (error) {
        console.error(`Failed to fetch Google News RSS for ${ticker}:`, error);
        return [];
    }
}


export async function fetchGlobalMarketNews(): Promise<NewsItem[]> {
    // Topic: BUSINESS, tailored for "Stock Market", "Economy", "Fed"
    // Using a broader query to capture macro events.
    const query = 'Economy OR "Stock Market" OR "Federal Reserve" OR Inflation OR "Interest Rates"';
    const encodedQuery = encodeURIComponent(query);

    // gl=US for global market context (US drives global markets)
    // ceid=US:en
    const url = `https://news.google.com/rss/search?q=${encodedQuery}&hl=en-US&gl=US&ceid=US:en`;

    try {
        const response = await fetch(url, { next: { revalidate: 3600 } });
        const xml = await response.text();
        const result = parser.parse(xml);

        const channel = result.rss?.channel;
        const items = channel?.item || [];

        const newsList = Array.isArray(items) ? items : [items];
        if (newsList.length === 0) return [];

        return newsList.slice(0, 10).map((item: any) => { // Limit to 10 items for context
            const sourceName = item.source ? (item.source['#text'] || item.source) : 'Google News';

            return {
                title: item.title,
                link: item.link,
                pubDate: item.pubDate,
                source: String(sourceName),
                snippet: stripHtml(item.description || '')
            };
        });
    } catch (error) {
        console.error('Failed to fetch Global Market News:', error);
        return [];
    }
}

function stripHtml(html: string): string {
    return html.replace(/<[^>]*>?/gm, '');
}
