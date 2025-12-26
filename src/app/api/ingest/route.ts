
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateEmbedding } from '@/lib/ai/embedding';
import { fetchGoogleNewsRSS } from '@/lib/news/google-news';
import * as cheerio from 'cheerio';

// Logic moved from rag-service.ts

interface ScrapedArticle {
    title: string;
    content: string;
    link: string;
    source: string;
    publishedAt: string;
}

const ANALYST_DOMAINS = [
    'site:hankyung.com',
    'site:mk.co.kr',
    'site:seekingalpha.com',
    'site:barrons.com'
];

const KR_KEYWORDS = '리포트 OR 분석 OR 목표가 OR 전망';
const US_KEYWORDS = 'Analysis OR Rating OR Outlook';

export async function POST(req: NextRequest) {
    const { ticker } = await req.json();

    if (!ticker) {
        return NextResponse.json({ error: 'Ticker is required' }, { status: 400 });
    }

    console.log(`[API/Ingest] Starting analysis archive for ${ticker}`);
    const supabase = await createClient();

    const domains = ANALYST_DOMAINS.join(' OR ');
    const keywords = `${KR_KEYWORDS} OR ${US_KEYWORDS}`;
    const query = `${ticker} (${domains}) (${keywords})`;

    try {
        const rawItems = await fetchGoogleNewsRSS(ticker, query);
        console.log(`[API/Ingest] Found ${rawItems.length} potential analysis items for ${ticker}`);

        let archivedCount = 0;

        for (const item of rawItems.slice(0, 3)) {
            try {
                const { data: existing } = await supabase
                    .from('news_items')
                    .select('id')
                    .eq('link', item.link)
                    .single();

                if (existing) continue;

                const content = await scrapeArticleContent(item.link);
                if (!content || content.length < 200) continue;

                const textToEmbed = `Title: ${item.title}\nSource: ${item.source}\nDate: ${item.pubDate}\n\n${content}`;
                const vector = await generateEmbedding(textToEmbed);

                const { error } = await supabase.from('news_items').insert({
                    ticker,
                    title: item.title,
                    link: item.link,
                    source: item.source,
                    published_at: new Date(item.pubDate).toISOString(),
                    snippet: content.substring(0, 1000),
                    embedding: vector
                });

                if (!error) {
                    archivedCount++;
                    console.log(`[API/Ingest] Archived: ${item.title}`);
                }
            } catch (e) {
                console.error(`[API/Ingest] Failed to process ${item.title}`, e);
            }
        }

        return NextResponse.json({ success: true, count: archivedCount });
    } catch (error) {
        console.error('[API/Ingest] Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

async function scrapeArticleContent(url: string): Promise<string> {
    try {
        const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1)' } });
        const html = await res.text();
        const $ = cheerio.load(html);

        $('script, style, nav, header, footer, .ad, .advertisement').remove();

        const selectors = ['article', 'main', '.content', '#content', '.article-body', '.post-content'];
        let text = '';
        for (const sel of selectors) {
            if ($(sel).length > 0) {
                text = $(sel).text();
                break;
            }
        }
        if (!text) text = $('body').text();

        return text.replace(/\s+/g, ' ').trim();
    } catch (e) {
        return '';
    }
}
