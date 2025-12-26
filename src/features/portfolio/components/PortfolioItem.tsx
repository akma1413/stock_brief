'use client'

import { Button } from '@/components/ui/button'
import { deleteFromPortfolio } from '@/features/portfolio/actions'
import { useState } from 'react'
import { X } from 'lucide-react'
import { useBriefing } from '@/features/briefing/context/BriefingContext'

interface PortfolioItemProps {
    stock: {
        ticker: string
        name: string
        exchange: string
    }
}

export function PortfolioItem({ stock }: PortfolioItemProps) {
    const [isDeleting, setIsDeleting] = useState(false)
    const { briefingData } = useBriefing()

    const handleDelete = async () => {
        if (!confirm(`${stock.ticker} 종목을 포트폴리오에서 삭제하시겠습니까?`)) return

        setIsDeleting(true)
        try {
            await deleteFromPortfolio(stock.ticker)
        } catch (error) {
            console.error('Failed to delete', error)
            setIsDeleting(false)
        }
    }

    // Find stock data in briefingData if available
    const briefingStock = briefingData?.stocks.find(s => s.ticker === stock.ticker)

    const isPositive = briefingStock?.changeColor === 'red' // Based on Korean market convention logic or API response
    // Wait, the API response has changeColor: 'green' | 'red' | 'grey'. 
    // In Korea: Red is UP, Blue is DOWN.
    // Let's rely on the passed color or parse the change value string if needed.
    // But `briefingStock` has `changeColor` property.
    // Ideally we trust the API.

    // If no briefing data, we show nothing (empty space) as requested.

    return (
        <div className="flex items-center justify-between p-4 border rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow">
            {/* Left: Ticker & Name */}
            <div className="flex flex-col gap-0.5">
                <span className="font-bold text-base">{stock.ticker}</span>
                <span className="text-xs text-muted-foreground line-clamp-1">{stock.name}</span>
            </div>

            {/* Right: Price & Action */}
            <div className="flex items-center gap-3">
                {briefingStock ? (
                    <div className="flex flex-col items-end gap-0.5">
                        <span className="font-semibold text-sm">${briefingStock.price}</span>
                        <span className={`text-xs font-medium px-1.5 py-0.5 rounded-md flex items-center ${briefingStock.changeColor === 'red' ? 'bg-red-50 text-red-600' :
                                briefingStock.changeColor === 'green' ? 'bg-green-50 text-green-600' :
                                    'bg-gray-100 text-gray-600'
                            }`}>
                            {briefingStock.change}
                        </span>
                    </div>
                ) : (
                    <div className="w-[60px]"></div> // Placeholder spacer to keep layout stable or just empty? User said "비워둬" (leave empty).
                    // "비워둬" likely means don't show numbers. Spacer might be nice for alignment but X button is there.
                    // The layout is justify-between, so X button stays right.
                    // So we just render nothing here. 
                )}

                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 -mr-2 text-muted-foreground/50 hover:text-destructive transition-colors"
                    onClick={handleDelete}
                    disabled={isDeleting}
                >
                    <X className="h-4 w-4" />
                    <span className="sr-only">삭제</span>
                </Button>
            </div>
        </div>
    )
}
