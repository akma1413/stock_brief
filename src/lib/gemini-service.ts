import { GoogleGenerativeAI } from '@google/generative-ai';
import { StockNews } from './yahoo-finance';
import { NewsItem } from './news/google-news';

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

// User requested specific model: gemini-3-flash-preview
const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

interface AIResponse {
    summary: string;
    detailedAnalysis: string[]; // Changed to bullet points
    latestAnalysis: Array<{ title: string, source: string, date: string, summary: string }>;
    upcomingEvents: Array<{ name: string, scenario: string[], dDay?: string }>;
}

export async function generateBriefingSummary(
    ticker: string,
    stockDrop: string, // e.g. "+2.5%"
    newsItems: (StockNews | NewsItem)[],
    analysisContext: any[], // RAG Results
    tone: 'professional' | 'beginner' | 'witty'
): Promise<AIResponse> {
    if (!apiKey) {
        console.warn("GEMINI_API_KEY is missing. Returning fallback.");
        return getFallbackResponse(ticker);
    }

    const newsText = newsItems.length > 0
        ? newsItems.map(n => `- [${'publisher' in n ? n.publisher : n.source}] ${n.title}`).join('\n')
        : "No recent general news.";

    const ragText = analysisContext.length > 0
        ? analysisContext.map(a => `
        Analysis from [${a.source}] (${a.published_at}):
        Title: ${a.title}
        Content Snippet: ${a.snippet}
        `).join('\n---\n')
        : "No specific high-depth analysis available.";

    const today = new Date().toISOString().split('T')[0];

    const prompt = `
    You are a financial analyst AI. 
    Stock: ${ticker}
    Today's Move: ${stockDrop}
    Current Date: ${today} (Context: Ensure all content is relevant to this date)
    User Tone Preference: ${tone}
    Language: Korean

    RAG (Authoritative Analysis) Context:
    ${ragText}

    Recent General News Context:
    ${newsText}

    Task:
    1. **Detailed Analysis (3 Bullets)**:
       - Based on the RAG context (priority) and general news.
       - Bullet 1: Primary Cause (Consensus view).
       - Bullet 2: Secondary Factor/Minority View.
       - Bullet 3: Context/Implication.
       
    2. **Latest Analysis Summary (3-5 items)**:
       - Summarize the provided RAG Analysis articles.
       - If RAG is empty, use the most significant General News but clearly label source.
       - Output: Title, Source, Date, 4-line Summary.

    3. **Upcoming Events**:
       - Extract future events (Earnings, Meetings, Product Launches) from any text.
       - Infer D-Day if date is known.
       - Scenario: Bull/Bear outcomes.

    Output format (JSON):
    {
        "summary": "1 sentence catchy summary.",
        "detailedAnalysis": ["Bullet 1", "Bullet 2", "Bullet 3"],
        "latestAnalysis": [
            { "title": "...", "source": "Bloomberg", "date": "2024-05-20", "summary": "..." }
        ],
        "upcomingEvents": [
            { "name": "Q3 Analysis", "scenario": ["Bull: Revenue beat", "Bear: Weak guidance"], "dDay": "D-5" }
        ]
    }
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = result.response;
        // Strip markdown code blocks if present
        const text = response.text().replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(text);

        // Safety check for array fields
        return {
            summary: parsed.summary || `${ticker} Analysis`,
            detailedAnalysis: Array.isArray(parsed.detailedAnalysis) ? parsed.detailedAnalysis : [parsed.detailedAnalysis || ""],
            latestAnalysis: Array.isArray(parsed.latestAnalysis) ? parsed.latestAnalysis : [],
            upcomingEvents: Array.isArray(parsed.upcomingEvents) ? parsed.upcomingEvents : []
        };
    } catch (e) {
        console.error("Gemini Generation Error:", e);
        return getFallbackResponse(ticker);
    }
}


function getFallbackResponse(ticker: string): AIResponse {
    return {
        summary: `${ticker}의 오늘 변동에 대한 AI 분석을 불러올 수 없습니다.`,
        detailedAnalysis: ["API 키가 없거나 일시적인 오류가 발생했습니다. 나중에 다시 시도해주세요."],
        latestAnalysis: [],
        upcomingEvents: []
    };
}


export interface MarketInsight {
    outlook: string[]; // Changed to array for bullet points
    macroEvents: string[];
    sectorHighlight: string[]; // Changed to array
    portfolioImplication: string[]; // Changed to array
}

import { MarketIndex, TopMover } from './yahoo-finance';

export async function generateMarketInsight(
    indices: MarketIndex[],
    movers: { gainers: TopMover[], active: TopMover[] },
    globalNews: NewsItem[],
    userHoldings: string[]
): Promise<MarketInsight> {
    if (!apiKey) {
        return {
            outlook: ["시장 데이터를 분석할 수 없습니다 (API Key Missing)."],
            macroEvents: [],
            sectorHighlight: [""],
            portfolioImplication: [""]
        };
    }

    const indicesText = indices.map(i => `${i.name}: ${i.changePercent > 0 ? '+' : ''}${i.changePercent.toFixed(2)}%`).join(', ');
    const topGainersText = movers.gainers.slice(0, 5).map(m => `${m.name} (${m.symbol}) ${m.changePercent.toFixed(2)}%`).join(', ');
    const newsText = globalNews.slice(0, 5).map(n => `- ${n.title} (${n.source})`).join('\n');
    const holdingsText = userHoldings.join(', ');

    const prompt = `
    Role: You are an expert financial analyst. Your goal is to provide a precise, fact-based market briefing that is easy to understand for a general investor.
    Tone: Professional, Objective, yet Explanatory. Avoid vague adjectives like "Corporate muscle". Use exact numbers and financial terms, but briefly explain them if complex.
    Format: ALL SECTIONS MUST BE BULLET POINTS (Array of strings). Max 3 bullet points per section. ALWAYS OUTPUT IN KOREAN.

    Data:
    - Market Indices: ${indicesText}
    - Top Gainers (Hot Sectors): ${topGainersText}
    - Global News:
    ${newsText}
    - User's Portfolio: ${holdingsText}

    Task:
    1. **Market Outlook**:
       - State the key movement fact (e.g., "S&P 500 rose 1.2%").
       - Explain the primary driver with precision (e.g., "Due to cooler-than-expected CPI data").
    2. **Sector Analysis**:
       - Identify the leading sector from 'Top Gainers'.
       - Explain WHY it moved using the news (e.g., "Defense stocks rallied 3% following new government contracts").
    3. **Macro Events**:
       - List key macro events (Fed, Earnings, Data) with specific numbers if available in news.
    4. **Portfolio Implication**:
       - Connect the market trend to the user's specific holdings.
       - If no direct link, give general advice based on the sector rotation.
    
    Language: Korean (Must be written in Korean)

    Output JSON:
    {
        "outlook": ["Bullet 1 (Fact + Driver)", "Bullet 2 (Context)"],
        "sectorHighlight": ["Bullet 1 (Sector + Move)", "Bullet 2 (Reason)"],
        "macroEvents": ["Bullet 1", "Bullet 2"],
        "portfolioImplication": ["Bullet 1 (Specific Advice)", "Bullet 2 (General Stance)"]
    }
    `;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(text) as MarketInsight;
    } catch (e) {
        console.error("Gemini Market Insight Error:", e);
        return {
            outlook: ["시장 분석을 생성하는 중 오류가 발생했습니다."],
            macroEvents: [],
            sectorHighlight: ["일시적인 오류입니다."],
            portfolioImplication: [""]
        };
    }
}

export async function resolveStockQuery(query: string): Promise<string | null> {
    if (!apiKey) return null;

    const prompt = `
    Role: Financial Data Assistant.
    Task: Identify the public company name or ticker symbol for the given search term. 
    Input: "${query}"
    
    Rules:
    1. If it refers to a well-known public company, product, or brand, return the OFFICIAL COMPANY NAME (e.g. AWS -> Amazon, YouTube -> Google).
    2. If it's ambiguous or not a public company, return "null".
    3. Output STRICTLY just the name or ticker. No explanations.
    `;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text().trim();

        if (text.toLowerCase() === 'null') return null;
        return text;
    } catch (e) {
        console.warn("Gemini Query Resolve Error:", e);
        return null;
    }
}
