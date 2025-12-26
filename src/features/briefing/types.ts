export interface StockBriefing {
    ticker: string
    name?: string
    price: string
    change: string
    changeColor: 'green' | 'red' | 'grey'
    summary: string
    detailedAnalysis: string[]
    latestAnalysis: Array<{ title: string, source: string, date: string, summary: string }>
    upcomingEvents: Array<{ name: string, scenario: string[], dDay?: string }>
}

export interface BriefingData {
    date: string
    marketOverview: string[]
    marketInsight?: {
        outlook: string[]
        macroEvents: string[]
        sectorHighlight: string[]
        portfolioImplication: string[]
    }
    stocks: StockBriefing[]
}
