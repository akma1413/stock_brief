'use client'

import { Button } from '@/components/ui/button'
import { deleteFromPortfolio } from '@/features/portfolio/actions'
import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

interface PortfolioItemProps {
    stock: {
        ticker: string
        name: string
        exchange: string
    }
}

export function PortfolioItem({ stock }: PortfolioItemProps) {
    const [isDeleting, setIsDeleting] = useState(false)

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

    // Mock Price Data generation (Client-side for now, to be consistent with MVP mock approach)
    // In real app, this would come from the parent or a separate hook.
    // Fix Hydration Mismatch: Initialize with null or stable default, then randomize on mount
    const [mockPrice, setMockPrice] = useState<string>('0.00')
    const [mockChangeRaw, setMockChangeRaw] = useState<number>(0)

    // Generate strict client-side only random data to prevent hydration mismatch
    useState(() => { // Using lazy initializer or just generic useEffect
        // Actually, just set it once on mount
    })

    // Actually, simple way: 
    const [mounted, setMounted] = useState(false)
    useEffect(() => {
        setMounted(true)
        setMockPrice((Math.random() * 200 + 50).toFixed(2))
        setMockChangeRaw(Math.random() * 10 - 4)
    }, [])

    const mockChange = mounted ? mockChangeRaw.toFixed(2) + '%' : '0.00%'
    const isPositive = mockChangeRaw > 0
    const isNegative = mockChangeRaw < 0

    return (
        <div className="flex items-center justify-between p-4 border rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow">
            {/* Left: Ticker & Name */}
            <div className="flex flex-col gap-0.5">
                <span className="font-bold text-base">{stock.ticker}</span>
                <span className="text-xs text-muted-foreground line-clamp-1">{stock.name}</span>
            </div>

            {/* Right: Price & Action */}
            <div className="flex items-center gap-3">
                <div className="flex flex-col items-end gap-0.5">
                    <span className="font-semibold text-sm">${mockPrice}</span>
                    <span className={`text-xs font-medium px-1.5 py-0.5 rounded-md flex items-center ${isPositive ? 'bg-red-50 text-red-600' : isNegative ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-600'
                        }`}>
                        {/* Note: In Korea, Red is up, Blue is down usually. Let's follow standard western/crypto green/red for now unless requested, 
                            BUT wait, the user is Korean.
                            Korean Stock Color Standard: Red = UP, Blue = DOWN. 
                            I should probably switch to this if I want to be "localized".
                            Let's stick to Green/Red for now to match previous code, OR flip it? 
                            The previous code was Green=Up.
                            Let's keep Green/Red effectively but maybe style it better. 
                            Actually, let's Stick to Green/Red (Global Standard) unless user complains, 
                            OR better, check user earlier preference? No specific preference.
                            I will make the badge look cleaner.
                        */}
                        {isPositive ? '+' : ''}{mockChange}
                    </span>
                </div>

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
