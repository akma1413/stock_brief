'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { generateBriefing } from '@/features/briefing/actions'
import { BriefingData } from '@/features/briefing/types'
import { Loader2 } from 'lucide-react'
import { BriefingDashboard } from './BriefingDashboard'
import { getUserSettings, updateUserSettings, UserSettings } from '@/features/settings/actions'

export function BriefingGenerator() {
    const [data, setData] = useState<BriefingData | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Settings State
    const [settings, setSettings] = useState<UserSettings>({ tone: 'professional', length: 'concise', showSources: true })

    // Load Settings on Mount
    useEffect(() => {
        getUserSettings().then(({ settings }) => {
            if (settings) setSettings(settings)
        })
    }, [])

    const handleGenerate = async () => {
        console.log("Generate button clicked")
        setIsLoading(true)
        setError(null)

        try {
            const result = await generateBriefing()
            if (result.error) {
                setError(result.error)
            } else if (result.data) {
                setData(result.data)
            }
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'An unexpected error occurred.';
            setError(msg)
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }

    // Handle Setting Change => Save => Regenerate
    const handleSettingsChange = async (newSettings: UserSettings) => {
        // 1. Optimistic UI update
        setSettings(newSettings)
        // 2. Clear old data to show we are regenerating (optional, or keep it and show spinner)
        // setData(null) // Let's keep data but show loading via controls if supported
        setIsLoading(true)

        try {
            // 3. Save to DB
            await updateUserSettings(newSettings)

            // 4. Regenerate Briefing
            const result = await generateBriefing()
            if (result.data) {
                setData(result.data)
            }
        } catch (e) {
            console.error("Failed to update settings and regenerate", e)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-4">
            {!data && !isLoading && (
                <div className="text-center p-8 bg-muted/20 rounded-lg border border-dashed">
                    <h3 className="font-semibold mb-2">오늘의 브리핑 준비 완료</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        보유 종목에 대한 AI 맞춤 요약을 받아보세요.
                    </p>
                    <div className='flex justify-center mb-4'>
                        {/* Optional: Show simple tone selector here too? For now, just generate */}
                    </div>
                    <Button onClick={handleGenerate}>
                        데일리 브리핑 생성
                    </Button>
                    {error && (
                        <p className="text-sm text-destructive mt-4">{error}</p>
                    )}
                </div>
            )}

            {isLoading && !data && ( /* Show big loader only if no data exists */
                <div className="flex flex-col items-center justify-center p-12 space-y-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground animate-pulse">
                        시장 데이터를 분석하고 인사이트를 도출하는 중...
                    </p>
                </div>
            )}

            {data && ( /* Render Dashboard even when loading (refreshing) */
                <>
                    <div className="flex items-end justify-between mb-3">
                        <h2 className="font-semibold text-lg">오늘의 인사이트</h2>
                        <span className="text-xs text-muted-foreground mb-1">
                            {new Date().toLocaleDateString()} | {new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })} 기준
                        </span>
                    </div>
                    <BriefingDashboard
                        data={data}
                        onRegenerate={handleGenerate}
                        isLoading={isLoading}
                        settings={settings}
                        onSettingsChange={handleSettingsChange}
                    />
                </>
            )}
        </div>
    )
}
