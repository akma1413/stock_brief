'use server'

import { createClient } from '@/lib/supabase/server'
import { generateBriefingContent } from './briefing-service'
import { BriefingData } from './types'
import { getUserSettings } from '../settings/actions'

export interface BriefingState {
    data?: BriefingData
    error?: string
}

export async function generateBriefing(): Promise<BriefingState> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'You must be logged in to generate a briefing.' }
    }

    try {
        // 1. Fetch User's Portfolio & Settings in Parallel
        const [portfolioResponse, settingsResponse] = await Promise.all([
            supabase
                .from('user_portfolios')
                .select('ticker')
                .eq('user_id', user.id),
            getUserSettings()
        ])

        const { data: portfolio, error: portfolioError } = portfolioResponse

        if (portfolioError) throw new Error(`Portfolio fetch failed: ${portfolioError.message}`)

        if (!portfolio || portfolio.length === 0) {
            return { error: 'Your portfolio is empty. Add stocks to generate a briefing.' }
        }

        const tickers = portfolio.map((p) => p.ticker)

        // Validate tickers before expensive AI call
        if (tickers.length === 0) {
            return { error: 'No valid tickers found in portfolio.' }
        }

        const { settings } = settingsResponse

        // 2. Call Briefing Service
        const data = await generateBriefingContent(tickers, settings)

        return { data }
    } catch (error) {
        // Safe logging without strict JSON stringify to avoid circular deps or massive logs
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('[BriefingAction] Generation failed:', errorMessage)

        return { error: `Failed to generate briefing: ${errorMessage}` }
    }
}
