'use client'

import { UserSettings } from '@/features/settings/actions'
import { Button } from '@/components/ui/button'
import { Sparkles, GraduationCap, Smile, Link2 } from 'lucide-react'

interface BriefingControlsProps {
    settings: UserSettings
    onUpdate: (newSettings: UserSettings) => void
    disabled?: boolean
}

export function BriefingControls({ settings, onUpdate, disabled }: BriefingControlsProps) {

    const tones = [
        { id: 'professional', label: '전문가', icon: GraduationCap },
        { id: 'beginner', label: '쉬운말', icon: Smile },
        { id: 'witty', label: '재미난', icon: Sparkles },
    ] as const

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center space-x-2 bg-background/80 backdrop-blur-md p-2 rounded-full border shadow-lg animate-in slide-in-from-bottom-5 fade-in duration-500">
            {tones.map((t) => {
                const Icon = t.icon
                const isActive = settings.tone === t.id
                return (
                    <button
                        key={t.id}
                        onClick={() => onUpdate({ ...settings, tone: t.id })}
                        disabled={disabled}
                        className={`
                    flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs font-medium transition-all
                    ${isActive
                                ? 'bg-primary text-primary-foreground shadow-sm'
                                : 'hover:bg-accent text-muted-foreground'
                            }
                    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                    >
                        <Icon className="w-4 h-4" />
                        <span>{t.label}</span>
                    </button>
                )
            })}

            <div className="w-px h-4 bg-border mx-2" />

            <button
                onClick={() => onUpdate({ ...settings, showSources: !settings.showSources })}
                disabled={disabled}
                className={`
                    flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs font-medium transition-all
                    ${settings.showSources
                        ? 'bg-secondary text-secondary-foreground shadow-sm'
                        : 'hover:bg-accent text-muted-foreground'
                    }
                    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                `}
            >
                <Link2 className="w-4 h-4" />
                <span>출처</span>
            </button>
        </div>
    )
}
