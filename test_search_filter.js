const pkg = require('yahoo-finance2');
const yf = new pkg.default();

async function run() {
    try {
        console.log('Searching for Google...');
        const res = await yf.search('Google');
        console.log(`Found ${res.quotes.length} raw results.`);

        res.quotes.forEach(q => {
            console.log('---');
            console.log('Symbol:', q.symbol);
            console.log('isYaSelect:', q.isYaSelect);
            console.log('quoteType:', q.quoteType);
            console.log('exchange:', q.exchange);

            const passes = q.isYaSelect && (q.quoteType === 'EQUITY' || q.quoteType === 'ETF');
            console.log('PASSES FILTER?:', passes);
        });

    } catch (e) {
        console.log('Error:', e.message);
    }
}

run();
