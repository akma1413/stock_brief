'use client'

import { Loader2 } from 'lucide-react'
import { AdSense } from '@/components/ads/AdSense'

export function BriefingLoadingState() {
    return (
        <div className="relative border rounded-xl overflow-hidden bg-card shadow-md min-h-[400px] flex flex-col animate-in fade-in zoom-in-95 duration-300">

            {/* Header Area */}
            <div className="bg-muted/30 p-4 border-b flex items-center justify-center space-x-3">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <span className="text-sm font-medium animate-pulse">분석 완료 시 광고 자동 종료</span>
            </div>

            {/* Main Content (Ad area takes focus) */}
            <div className="flex-1 p-8 flex flex-col items-center justify-center bg-gray-50/50 dark:bg-zinc-900/50">
                <div className="w-full max-w-[336px] flex justify-center">
                    <AdSense
                        format="rectangle"
                        style={{ width: '336px', height: '280px' }} // Standard Medium Rectangle
                        className="bg-background shadow-sm rounded-md"
                    />
                </div>
            </div>

            {/* Footer */}
            <div className="p-3 bg-muted/30 border-t text-center">
                <p className="text-[11px] text-muted-foreground/70">
                    브리핑 생성 시간 동안만 광고를 재생합니다
                </p>
            </div>
        </div>
    )
}
