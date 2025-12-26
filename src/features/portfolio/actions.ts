'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface PortfolioActionState {
    success?: boolean
    error?: string
}

export async function addToPortfolio(stock: { ticker: string; name: string; exchange: string }): Promise<PortfolioActionState> {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'You must be logged in to add stocks to your portfolio.' }
    }

    try {
        const { error } = await supabase
            .from('user_portfolios')
            .insert({
                user_id: user.id,
                ticker: stock.ticker,
                name: stock.name,
                exchange: stock.exchange
            })

        if (error) {
            if (error.code === '23505') { // Unique violation
                return { error: 'This stock is already in your portfolio.' }
            }
            throw error
        }

        revalidatePath('/briefing')
        return { success: true }
    } catch (error) {
        console.error('Add to portfolio error:', error)
        return { error: 'Failed to add stock to portfolio.' }
    }
}

export async function deleteFromPortfolio(ticker: string): Promise<PortfolioActionState> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'You must be logged in.' }
    }

    try {
        const { error } = await supabase
            .from('user_portfolios')
            .delete()
            .eq('user_id', user.id)
            .eq('ticker', ticker)

        if (error) throw error

        revalidatePath('/briefing')
        return { success: true }
    } catch (error) {
        console.error('Delete from portfolio error:', error)
        return { error: 'Failed to delete stock.' }
    }
}
