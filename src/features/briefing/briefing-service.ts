'use server'

import { StockBriefing, BriefingData } from './types'

import { UserSettings } from '../settings/actions'
import { getQuotes, getCompanyNews, StockNews, getMarketIndices, getTopMovers } from '@/lib/yahoo-finance'
import { generateBriefingSummary, generateMarketInsight } from '@/lib/gemini-service'
import { fetchGoogleNewsRSS, fetchGlobalMarketNews, NewsItem } from '@/lib/news/google-news'
import { retrieveAnalysis } from './rag-service'


export async function generateBriefingContent(tickers: string[], settings?: UserSettings): Promise<BriefingData> {
    // 1. Fetch Real Data (Parallel)
    // Note: We use ingestAndFetchNews to get data from multiple sources (Yahoo + Google RSS)
    const [quotes, newsData, marketIndices, topMovers, globalNews] = await Promise.all([
        getQuotes(tickers),
        Promise.all(tickers.map(ingestAndFetchNews)),
        getMarketIndices(),
        getTopMovers(),
        fetchGlobalMarketNews()
    ])


    const date = new Date().toLocaleDateString('ko-KR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })

    const tone = settings?.tone || 'professional'
    const isWitty = tone === 'witty'

    // 2. Map Data & Generate AI Summaries (Parallel)
    const stockPromises = tickers.map(async (ticker, index) => {
        const quote = quotes.find(q => q.symbol === ticker) || {
            symbol: ticker,
            regularMarketPrice: null,
            regularMarketChange: 0,
            regularMarketChangePercent: 0,
            currency: 'USD',
            shortName: ticker
        }

        const companyNews = newsData[index] || []
        const changeVal = quote.regularMarketChangePercent
        const changeStr = `${changeVal > 0 ? '+' : ''}${changeVal.toFixed(2)}%`
        const isPositive = changeVal > 0
        const isNegative = changeVal < 0

        // Ingest Analysis (Fire and forget via API to avoid bundling heavy libs in main thread)
        // We use absolute URL or relative if possible, but for server-side fetch we need absolute.
        // Or we can just skip awaiting it to truly fire-and-forget if we trust the runtime.
        // For now, let's use a non-blocking fetch to localhost (assuming dev) or just skip if we want to fix build first.
        // Ideally we use a queue usage. Here we allow it to fail silently.
        try {
            // Determine base URL (hacky for now, better to use env)
            const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
            // Note: If port changed to 3001/3002, this might miss. Ideally use relative if supported or env.
            // Actually, we can just use promises. 
            // BUT: We removed the function from rag-service. So we MUST use fetch.
            fetch(`${baseUrl}/api/ingest`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ticker })
            }).catch(e => console.error('Ingest trigger failed', e));
        } catch (e) {
            console.error('Ingest setup failed', e);
        }

        const analysisContext = await retrieveAnalysis(ticker);

        // Call Gemini (Real AI) with Aggregated News + RAG Context
        const aiAnalysis = await generateBriefingSummary(ticker, changeStr, companyNews, analysisContext, tone)

        // Structural Fix: Normalize data types to prevent UI crashes from cached/legacy data
        const safeDetailedAnalysis = Array.isArray(aiAnalysis.detailedAnalysis)
            ? aiAnalysis.detailedAnalysis
            : [typeof aiAnalysis.detailedAnalysis === 'string' ? aiAnalysis.detailedAnalysis : "분석 내용 없음"];

        const safeLatestAnalysis = Array.isArray(aiAnalysis.latestAnalysis)
            ? aiAnalysis.latestAnalysis
            : [];

        const safeUpcomingEvents = Array.isArray(aiAnalysis.upcomingEvents)
            ? aiAnalysis.upcomingEvents
            : [];

        return {
            ticker,
            price: quote.regularMarketPrice !== null ? `$${quote.regularMarketPrice.toFixed(2)}` : 'N/A',
            change: changeStr,
            changeColor: isPositive ? 'green' : isNegative ? 'red' : 'grey',
            summary: aiAnalysis.summary,
            detailedAnalysis: safeDetailedAnalysis,
            latestAnalysis: safeLatestAnalysis,
            upcomingEvents: safeUpcomingEvents
        } as StockBriefing
    })

    // Generate Market Insight using aggregated data
    // We pass the user's ticker list to personalize the implication
    const marketInsight = await generateMarketInsight(marketIndices, topMovers, globalNews, tickers);

    const stocks = await Promise.all(stockPromises)

    return {
        date,
        marketOverview: marketInsight.outlook, // Now naturally assigns string[]
        marketInsight: {
            outlook: marketInsight.outlook,
            macroEvents: marketInsight.macroEvents,
            sectorHighlight: marketInsight.sectorHighlight,
            portfolioImplication: marketInsight.portfolioImplication
        },
        stocks
    }
}

async function ingestAndFetchNews(ticker: string): Promise<(StockNews | NewsItem)[]> {
    try {
        const [yahooNews, googleNews] = await Promise.all([
            getCompanyNews(ticker),
            fetchGoogleNewsRSS(ticker)
        ]);

        // In a full RAG implementation, we would store these in the DB here.
        // For MVP/RFC Execution, we return the combined list directly to the context.
        return [...yahooNews, ...googleNews];
    } catch (e) {
        console.error(`Failed to fetch news for ${ticker}`, e);
        return [];
    }
}

