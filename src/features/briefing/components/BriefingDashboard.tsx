'use client'

import { BriefingData, StockBriefing } from '@/features/briefing/types'
import { StockBriefingCard } from './StockBriefingCard'
import { StockDetailDialog } from './StockDetailDialog'
import { MarketSummaryCard } from './MarketSummaryCard'
import { useState } from 'react'
import { BriefingControls } from '@/features/settings/components/BriefingControls'
import { UserSettings } from '@/features/settings/actions'

interface BriefingDashboardProps {
    data: BriefingData
    onRegenerate: () => void
    isLoading: boolean
    // New Props for In-Context Settings
    settings: UserSettings
    onSettingsChange: (newSettings: UserSettings) => void
}

export function BriefingDashboard({
    data,
    onRegenerate,
    isLoading,
    settings,
    onSettingsChange
}: BriefingDashboardProps) {
    const [selectedStock, setSelectedStock] = useState<StockBriefing | null>(null)

    return (
        <div className="space-y-6 animate-in fade-in duration-500">

            {/* Header / Market Overview */}
            {data.marketInsight ? (
                <MarketSummaryCard insight={data.marketInsight} />
            ) : (
                <div className="bg-muted/30 p-4 rounded-lg border">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="font-semibold text-primary">시장 요약</h3>
                            <p className="text-xs text-muted-foreground">{data.date}</p>
                        </div>
                    </div>
                    <div className="text-sm font-medium leading-relaxed space-y-2 break-keep">
                        {Array.isArray(data.marketOverview) ? (
                            data.marketOverview.map((line, idx) => (
                                <p key={idx}>{line}</p>
                            ))
                        ) : (
                            <p>{data.marketOverview}</p>
                        )}
                    </div>
                </div>
            )}


            {/* Stock List */}
            <div className="space-y-3">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">포트폴리오 현황</h4>
                <div className="grid gap-3">
                    {data.stocks.map((stock) => (
                        <StockBriefingCard
                            key={stock.ticker}
                            stock={stock}
                            showSources={settings.showSources}
                            onClick={(s) => setSelectedStock(s)}
                        />
                    ))}
                </div>
            </div>

            {/* Detail Modal */}
            <StockDetailDialog
                stock={selectedStock}
                showSources={settings.showSources}
                onClose={() => setSelectedStock(null)}
            />

            {/* Floating Controls */}
            <BriefingControls
                settings={settings}
                onUpdate={onSettingsChange}
                disabled={isLoading}
            />
        </div>
    )
}
