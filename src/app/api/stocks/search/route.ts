import { NextResponse } from 'next/server'
import { searchStocks } from '@/lib/yahoo-finance'
import { resolveStockQuery } from '@/lib/gemini-service'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query) {
        return NextResponse.json({ results: [] })
    }

    // Fallback Mock Data
    const mockDb: Record<string, any[]> = {
        'apple': [{ ticker: 'AAPL', name: 'Apple Inc.', exchange: 'NASDAQ' }],
        'aapl': [{ ticker: 'AAPL', name: 'Apple Inc.', exchange: 'NASDAQ' }],
        'tesla': [{ ticker: 'TSLA', name: 'Tesla, Inc.', exchange: 'NASDAQ' }],
        'tsla': [{ ticker: 'TSLA', name: 'Tesla, Inc.', exchange: 'NASDAQ' }],
        'nvda': [{ ticker: 'NVDA', name: 'NVIDIA Corporation', exchange: 'NASDAQ' }],
        'nvidia': [{ ticker: 'NVDA', name: 'NVIDIA Corporation', exchange: 'NASDAQ' }],
        'msft': [{ ticker: 'MSFT', name: 'Microsoft Corporation', exchange: 'NASDAQ' }],
        'microsoft': [{ ticker: 'MSFT', name: 'Microsoft Corporation', exchange: 'NASDAQ' }],
    }

    try {
        // Tier 1: Direct Search & Static Aliases
        let stocks = await searchStocks(query)

        if (stocks.length > 0) {
            return NextResponse.json({ results: stocks })
        }

        // Tier 2: AI Query Resolver (Smart Search)
        console.log(`Direct search failed for "${query}". Attempting AI resolution...`)
        const aiSuggestedQuery = await resolveStockQuery(query)

        if (aiSuggestedQuery) {
            console.log(`AI resolved "${query}" to "${aiSuggestedQuery}"`)
            stocks = await searchStocks(aiSuggestedQuery)
            if (stocks.length > 0) {
                return NextResponse.json({ results: stocks })
            }
        } else {
            console.log(`AI could not resolve "${query}"`)
        }

        // If even AI fails, throw to trigger mock fallback
        throw new Error('No API results found')

    } catch (error) {
        console.warn('Stock search API failed or empty, checking fallback...', error)

        const lowerQuery = query.toLowerCase()
        if (mockDb[lowerQuery]) {
            return NextResponse.json({ results: mockDb[lowerQuery] })
        }

        return NextResponse.json({ results: [] })
    }
}
