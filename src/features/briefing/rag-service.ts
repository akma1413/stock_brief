'use server'

import { createClient } from '@/lib/supabase/server';
import { generateEmbedding } from '@/lib/ai/embedding';

export async function retrieveAnalysis(ticker: string, limit = 3) {
    const supabase = await createClient();

    // 1. Generate Query Vector
    const query = `${ticker} stock analysis outlook report price target`;
    const vector = await generateEmbedding(query);

    // 2. Search
    const { data, error } = await supabase.rpc('match_news_items', {
        query_embedding: vector,
        match_threshold: 0.5, // Similarity threshold
        match_count: limit
    });

    if (error) {
        console.error('[RAG] Search error:', error);
        return [];
    }

    return data;
}
