import { createClient } from '@/lib/supabase/server'

export interface PortfolioStock {
    id: string
    ticker: string
    name: string
    exchange: string
    created_at: string
}

export async function getPortfolio(): Promise<PortfolioStock[]> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return []
    }

    const { data, error } = await supabase
        .from('user_portfolios')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching portfolio:', error)
        return []
    }

    return data as PortfolioStock[]
}
