'use client'

import { useStockSearch } from '@/features/portfolio/hooks/use-stock-search'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { addToPortfolio } from '@/features/portfolio/actions'
import { useState } from 'react'

export function StockSearch() {
    const { query, setQuery, results, isLoading } = useStockSearch()
    const [addingTicker, setAddingTicker] = useState<string | null>(null)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    console.log('StockSearch Render:', { query, isLoading, resultsCount: results.length })

    const [addedStocks, setAddedStocks] = useState<Set<string>>(new Set())

    const handleAdd = async (stock: { ticker: string; name: string; exchange: string }) => {
        // Optimistic UI: Assume success immediately
        setAddedStocks(prev => new Set(prev).add(stock.ticker))
        setMessage({ type: 'success', text: `Added ${stock.ticker} to portfolio` })

        // Clear query for better UX? Users might want to add multiple. Let's keep it but maybe focus input.
        // setQuery('') 

        try {
            // Perform actual server action in background
            const result = await addToPortfolio(stock)

            if (result.error) {
                // Revert on failure
                setAddedStocks(prev => {
                    const next = new Set(prev)
                    next.delete(stock.ticker)
                    return next
                })
                setMessage({ type: 'error', text: result.error })
            }
        } catch (e) {
            setAddedStocks(prev => {
                const next = new Set(prev)
                next.delete(stock.ticker)
                return next
            })
            setMessage({ type: 'error', text: 'An unexpected error occurred' })
        }
    }

    return (
        <div className="w-full max-w-sm space-y-4">
            <div className="relative">
                <Input
                    type="text"
                    placeholder="Search stocks (e.g., Apple, TSLA)"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full"
                />
                {isLoading && (
                    <div className="absolute right-3 top-2.5 text-xs text-muted-foreground">
                        Loading...
                    </div>
                )}
            </div>

            {message && (
                <div className={`text-sm p-2 rounded ${message.type === 'error' ? 'bg-destructive/10 text-destructive' : 'bg-green-100 text-green-800'}`}>
                    {message.text}
                </div>
            )}

            {results.length > 0 && (
                <div className="rounded-md border bg-card text-card-foreground shadow-sm max-h-60 overflow-y-auto">
                    <ul className="divide-y divide-border">
                        {results.map((stock) => (
                            <li key={stock.ticker} className="flex items-center justify-between p-3">
                                <div>
                                    <div className="font-semibold">{stock.ticker}</div>
                                    <div className="text-sm text-muted-foreground">{stock.name}</div>
                                </div>
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    disabled={addingTicker === stock.ticker || addedStocks.has(stock.ticker)}
                                    onClick={() => handleAdd(stock)}
                                >
                                    {addedStocks.has(stock.ticker) ? 'Added' : (addingTicker === stock.ticker ? 'Adding...' : 'Add')}
                                </Button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {query.length >= 2 && !isLoading && results.length === 0 && (
                <div className="text-sm text-muted-foreground p-2">
                    No results found.
                </div>
            )}
        </div>
    )
}
