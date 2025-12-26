'use client'

import { StockBriefing } from '@/features/briefing/types'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { TermHighlighter } from './TermHighlighter'

interface StockBriefingCardProps {
    stock: StockBriefing
    showSources: boolean
    onClick: (stock: StockBriefing) => void
}

export function StockBriefingCard({ stock, showSources, onClick }: StockBriefingCardProps) {
    const isPositive = stock.changeColor === 'green'
    const isNegative = stock.changeColor === 'red'

    return (
        <div
            className="flex flex-col p-4 border rounded-lg bg-card hover:shadow-md transition-all cursor-pointer space-y-2 active:scale-[0.99] active:bg-accent/50"
            onClick={() => onClick(stock)}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <span className="font-bold text-lg">{stock.ticker}</span>
                    <span className="text-sm text-muted-foreground">{stock.name}</span>
                </div>
                <div className={`flex items-center space-x-1 text-sm font-medium ${isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-gray-500'
                    }`}>
                    {isPositive && <TrendingUp className="w-4 h-4" />}
                    {isNegative && <TrendingDown className="w-4 h-4" />}
                    {!isPositive && !isNegative && <Minus className="w-4 h-4" />}
                    <span>{stock.change}</span>
                    <span className="text-muted-foreground ml-1 font-normal text-xs">{stock.price}</span>
                </div>
            </div>

            <p className="text-sm text-muted-foreground text-pretty leading-relaxed">
                <TermHighlighter text={stock.summary} showSources={showSources} />
            </p>
        </div>
    )
}
