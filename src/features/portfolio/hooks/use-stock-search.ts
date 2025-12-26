import { useState, useEffect } from 'react'

interface Stock {
    ticker: string
    name: string
    exchange: string
}

export function useStockSearch() {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<Stock[]>([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const fetchStocks = async () => {
            if (query.trim().length < 2) {
                setResults([])
                return
            }

            setIsLoading(true)
            try {
                const response = await fetch(`/api/stocks/search?q=${encodeURIComponent(query)}`)
                const data = await response.json()
                setResults(data.results || [])
            } catch (error) {
                console.error('Failed to search stocks:', error)
                setResults([])
            } finally {
                setIsLoading(false)
            }
        }

        const timer = setTimeout(fetchStocks, 300)

        return () => clearTimeout(timer)
    }, [query])

    return { query, setQuery, results, isLoading }
}
