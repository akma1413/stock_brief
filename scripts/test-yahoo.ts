import { getQuotes, getCompanyNews } from '../src/lib/yahoo-finance';

async function testYahoo() {
    console.log('Testing Yahoo Finance Integration...');
    try {
        const tickers = ['TSLA', 'AAPL'];

        console.log('Fetching Quotes...');
        const quotes = await getQuotes(tickers);
        console.log('Quotes:', JSON.stringify(quotes, null, 2));

        console.log('Fetching News for TSLA...');
        const news = await getCompanyNews('TSLA');
        console.log('News:', JSON.stringify(news, null, 2));

    } catch (error) {
        console.error('Test Failed:', error);
    }
}

testYahoo();
