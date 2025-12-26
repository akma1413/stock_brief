const pkg = require('yahoo-finance2');

console.log('Type of pkg:', typeof pkg);
console.log('Keys of pkg:', Object.keys(pkg));
if (pkg.default) {
    console.log('Type of pkg.default:', typeof pkg.default);
    console.log('Keys of pkg.default:', Object.keys(pkg.default));
}

// Attempt to use it
const yf = pkg.default || pkg;

async function run() {
    try {
        console.log('Attempting search with yf...');
        const res = await yf.search('Google');
        console.log('Success!', res.quotes.length, 'results');
    } catch (e) {
        console.log('Error with yf.search:', e.message);

        // Try instantiation if suggested
        if (e.message.includes('new YahooFinance()')) {
            console.log('Trying to instantiate...');
            try {
                const YFClass = pkg.default; // Assuming default is the class
                const instance = new YFClass();
                const res = await instance.search('Google');
                console.log('Success with instance!', res.quotes.length, 'results');
            } catch (innerE) {
                console.log('Error with new instance:', innerE.message);
            }
        }
    }
}

run();
