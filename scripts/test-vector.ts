import { generateEmbedding } from '../src/lib/ai/embedding';
import dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function main() {
    const text = "Inflation data suggests a simplified monetary policy.";
    console.log(`Generating embedding for text: "${text}"`);
    console.log("Model: text-embedding-004");

    try {
        const vector = await generateEmbedding(text);
        console.log(`\nSuccess!`);
        console.log(`Vector Dimensions: ${vector.length}`);
        console.log(`First 5 Values:`, vector.slice(0, 5));

        if (vector.length !== 768) {
            console.warn(`WARNING: Expected 768 dimensions, got ${vector.length}. Check model configuration.`);
        }
    } catch (e) {
        console.error("\nTest Failed. Check API Key configuration.");
        console.error(e);
    }
}

main().catch(console.error);
