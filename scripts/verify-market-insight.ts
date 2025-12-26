
import { generateBriefingContent } from '../src/features/briefing/briefing-service';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function main() {
    console.log('--- Starting Verification ---');
    try {
        // Mock data or real tickers
        const data = await generateBriefingContent(['AAPL', 'TSLA', 'NVDA']);
        console.log('--- Market Overview ---');
        console.log(data.marketOverview);
        console.log('--- Market Insight ---');
        console.log(JSON.stringify(data.marketInsight, null, 2));
    } catch (e) {
        console.error(e);
    }
    console.log('--- End Verification ---');
}

main();
