const yahooFinance = require('yahoo-finance2').default;

async function testSearch(query) {
    console.log(`Testing search for: "${query}"`);
    try {
        const results = await yahooFinance.search(query);
        console.log('Results found:', results.quotes.length);

        results.quotes.forEach(quote => {
            console.log('---');
            console.log('Symbol:', quote.symbol);
            console.log('Shortname:', quote.shortname);
            console.log('Longname:', quote.longname);
            console.log('Exchange:', quote.exchange);
            console.log('QuoteType:', quote.quoteType);
            console.log('isYaSelect:', quote.isYaSelect);

            // Check the filter condition from route.ts
            const passes = quote.isYaSelect && (quote.quoteType === 'EQUITY' || quote.quoteType === 'ETF');
            console.log('Passes Filter?', passes);
        });

    } catch (error) {
        console.error('Search failed:', error);
    }
}

async function run() {
    await testSearch('Google');
    await testSearch('GOOGL');
    await testSearch('Alphabet');
}

run();
