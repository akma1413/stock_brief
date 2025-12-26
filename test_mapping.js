// Removed invalid import
// I'll stick to the "raw" script approach but importing the library as before.

const pkg = require('yahoo-finance2');
const yf = new pkg.default();

async function test(term) {
    try {
        console.log(`Searching for "${term}"...`);
        const res = await yf.search(term);
        const filtered = res.quotes.filter(q => q.quoteType === 'EQUITY' || q.quoteType === 'ETF');

        if (filtered.length > 0) {
            console.log('Top Result:', filtered[0].symbol, filtered[0].shortname, filtered[0].exchange);
        } else {
            console.log('No equity/ETF results found.');
        }
    } catch (e) {
        console.log('Error:', e.message);
    }
}

async function run() {
    await test('Fast Retailing');
    await test('Uniqlo');
    await test('9983.T'); // Fast Retailing Tokyo
    await test('FRCOY');  // Fast Retailing ADR
}

run();
