import { fetchGoogleNewsRSS } from '../src/lib/news/google-news';

async function main() {
    // Testing with a major ticker that definitely has news
    const ticker = 'TSLA';
    console.log(`Fetching Authoritative News for ${ticker}...`);

    const news = await fetchGoogleNewsRSS(ticker);

    console.log(`\nFound ${news.length} items`);

    news.forEach((n, i) => {
        console.log(`\n--- Item ${i + 1} ---`);
        console.log(`Title: ${n.title}`);
        console.log(`Source: ${n.source}`);
        console.log(`PubDate: ${n.pubDate}`);
        console.log(`Link: ${n.link}`);
        console.log(`Snippet: ${n.snippet.substring(0, 100)}...`);
    });
}

main().catch(console.error);
