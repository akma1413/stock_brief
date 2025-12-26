import * as dotenv from 'dotenv';
import path from 'path';

// Load .env.local from project root (2 levels up)
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

async function testGemini() {
    console.log('Testing Gemini Integration...');

    const apiKey = process.env.GEMINI_API_KEY;
    console.log('API Key loaded:', apiKey ? 'Yes (' + apiKey.substring(0, 5) + '...)' : 'No');

    try {
        // Dynamic import to ensure env is loaded before the service initializes
        const { generateBriefingSummary } = await import('./gemini-service');

        const result = await generateBriefingSummary(
            'TSLA',
            '+5.2%',
            [
                { uuid: '1', title: 'Tesla sales surge in China', publisher: 'Reuters', link: '', providerPublishTime: 0, type: 'STORY' },
                { uuid: '2', title: 'New Model Y rumors', publisher: 'TechCrunch', link: '', providerPublishTime: 0, type: 'STORY' }
            ],
            [],
            'professional'
        );
        console.log('--- Result ---');
        console.log(JSON.stringify(result, null, 2));
    } catch (error) {
        console.error('Test Failed:', error);
    }
}

testGemini();
