const yfPackage = require('yahoo-finance2');
const yf = yfPackage.default;

console.log('--- DEFAULT EXPORT ---');
console.log('Is yf a function?', typeof yf === 'function');
console.log('Constructable?', yf && yf.prototype && yf.prototype.constructor === yf);

try {
    const instance = new yf();
    console.log('Successfully instantiated new yf()');
} catch (e) {
    console.log('Failed to instantiate new yf():', e.message);
}

try {
    console.log('Trying yf.quote...');
    // Mock fetch if needed or just catch the network error. 
    // This is just to check if the function exists and runs logic.
    // We pass a dummy symbol. It will likely fail network, but if it fails "call new first", we know.
    const p = yf.quote('AAPL');
    console.log('yf.quote returned a promise');
    p.then(() => console.log('Quote success')).catch(e => console.log('Quote failed:', e.message));
} catch (e) {
    console.log('yf.quote threw synchronously:', e.message);
}
