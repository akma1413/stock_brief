import { GoogleGenerativeAI } from '@google/generative-ai';

let embeddingModel: any = null;

function getModel() {
    if (embeddingModel) return embeddingModel;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        // Only warn/throw when actual usage is attempted
        throw new Error("GEMINI_API_KEY is not set in environment variables.");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });
    return embeddingModel;
}

export async function generateEmbedding(text: string): Promise<number[]> {
    try {
        const model = getModel();
        const result = await model.embedContent(text);
        return result.embedding.values;
    } catch (error) {
        // Enhance error message for easier debugging
        console.error("Gemini Embedding Error Details:", JSON.stringify(error, null, 2));
        throw error;
    }
}
