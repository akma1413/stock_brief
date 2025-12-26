'use client'

import { StockBriefing } from '@/features/briefing/types'
import { X, TrendingUp, TrendingDown, Minus, Calendar } from 'lucide-react'
import { useEffect, useState } from 'react'
import { TermHighlighter } from './TermHighlighter'

interface StockDetailDialogProps {
    stock: StockBriefing | null
    showSources: boolean
    onClose: () => void
}

export function StockDetailDialog({ stock, showSources, onClose }: StockDetailDialogProps) {
    // Prevent body scroll when modal is open
    useEffect(() => {
        if (stock) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => { document.body.style.overflow = 'unset' }
    }, [stock])

    if (!stock) return null

    const isPositive = stock.changeColor === 'green'
    const isNegative = stock.changeColor === 'red'

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-lg bg-background rounded-xl shadow-2xl border animate-in zoom-in-95 duration-200 p-6 max-h-[90vh] overflow-y-auto">

                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            {stock.ticker}
                        </h2>
                        <p className="text-muted-foreground">{stock.name || 'Stock Name'}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-accent rounded-full text-muted-foreground transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Price & Summary */}
                <div className="flex items-center gap-4 mb-6 p-4 bg-muted/40 rounded-lg">
                    <div className={`text-2xl font-bold ${isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-foreground'}`}>
                        {stock.price}
                    </div>
                    <div className={`flex items-center text-sm font-medium px-2 py-1 rounded bg-background border ${isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-gray-500'}`}>
                        {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : isNegative ? <TrendingDown className="w-4 h-4 mr-1" /> : <Minus className="w-4 h-4 mr-1" />}
                        {stock.change}
                    </div>
                </div>

                {/* Key Analysis */}
                <div className="space-y-8">
                    <section>
                        <h3 className="font-semibold text-lg mb-3 text-foreground/90">오늘 주가 해설</h3>
                        <ul className="space-y-3 list-disc pl-5 text-[15px] text-foreground/80 leading-relaxed font-medium">
                            {Array.isArray(stock.detailedAnalysis) ? stock.detailedAnalysis.map((point, i) => (
                                <li key={i} className="pl-1 marker:text-muted-foreground">
                                    <TermHighlighter text={point} showSources={showSources} />
                                </li>
                            )) : (
                                <li>
                                    <TermHighlighter text={String(stock.detailedAnalysis)} showSources={showSources} />
                                </li>
                            )}
                        </ul>
                    </section>

                    {/* Latest Analysis Summary */}
                    <section>
                        <h3 className="font-semibold text-lg mb-3 text-foreground/90">
                            최신 분석 요약
                        </h3>
                        <div className="space-y-3">
                            {Array.isArray(stock.latestAnalysis) && stock.latestAnalysis.length > 0 ? (
                                stock.latestAnalysis.map((item, i) => (
                                    <AnalysisAccordionItem key={i} item={item} />
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground p-2">최신 분석 데이터가 없습니다.</p>
                            )}
                        </div>
                    </section>

                    {/* Upcoming Events */}
                    <section>
                        <h3 className="font-semibold text-lg mb-3 text-foreground/90">
                            향후 주요 이벤트
                        </h3>
                        <div className="space-y-3">
                            {Array.isArray(stock.upcomingEvents) && stock.upcomingEvents.length > 0 ? (
                                stock.upcomingEvents.map((event, i) => (
                                    <div key={i} className="p-4 bg-muted/30 rounded-lg border border-border/40">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="font-medium text-base">{event.name}</span>
                                            {event.dDay && (
                                                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md border border-blue-100">
                                                    {event.dDay}
                                                </span>
                                            )}
                                        </div>
                                        <ul className="space-y-1.5">
                                            {Array.isArray(event.scenario) && event.scenario.map((scen, j) => (
                                                <li key={j} className="text-sm text-muted-foreground flex items-start gap-2">
                                                    <span className="mt-1.5 w-1 h-1 rounded-full bg-muted-foreground/40 shrink-0" />
                                                    <span>{scen}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground p-2">예정된 주요 이벤트가 없습니다.</p>
                            )}
                        </div>
                    </section>
                </div>

            </div>
        </div>
    )
}

function AnalysisAccordionItem({ item }: { item: { title: string, source: string, date: string, summary: string } }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="border border-border/60 rounded-lg overflow-hidden bg-card">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full text-left p-4 hover:bg-muted/30 transition-colors flex justify-between items-start gap-3"
            >
                <div className="space-y-1.5 w-full">
                    <h4 className="font-medium text-[15px] leading-snug">{item.title}</h4>
                    <div className="flex items-center text-xs text-muted-foreground gap-2">
                        <span>{item.source}</span>
                        <span className="w-0.5 h-0.5 rounded-full bg-muted-foreground/50" />
                        <span>{item.date}</span>
                    </div>
                </div>
            </button>

            {isOpen && (
                <div className="px-4 pb-4 pt-0 animate-in slide-in-from-top-2 duration-200">
                    <div className="h-px w-full bg-border/40 mb-3" />
                    <p className="text-sm text-foreground/80 leading-relaxed bg-muted/20 p-3 rounded-md">
                        {item.summary}
                    </p>
                </div>
            )}
        </div>
    )
}
