'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { getUserSettings, updateUserSettings, UserSettings } from '../actions'
import { Loader2, Save } from 'lucide-react'

export function SettingsForm() {
    const [settings, setSettings] = useState<UserSettings>({ tone: 'professional', length: 'concise', showSources: true })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

    useEffect(() => {
        async function load() {
            const { settings, error } = await getUserSettings()
            if (settings) setSettings(settings)
            // Ignore error on load (defaults used)
            setLoading(false)
        }
        load()
    }, [])

    const handleSave = async () => {
        setSaving(true)
        setMessage(null)

        const { success, error } = await updateUserSettings(settings)

        if (success) {
            setMessage({ text: 'Settings saved successfully!', type: 'success' })
        } else {
            setMessage({ text: error || 'Failed to save', type: 'error' })
        }
        setSaving(false)
    }

    if (loading) {
        return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>
    }

    return (
        <div className="space-y-8 max-w-md">

            {/* Tone Setting */}
            <div className="space-y-3">
                <label className="text-base font-medium">Briefing Tone</label>
                <p className="text-sm text-muted-foreground p-0 m-0 leading-none">
                    Choose the personality of your AI analyst.
                </p>
                <div className="grid grid-cols-1 gap-2 mt-2">
                    {[
                        { id: 'professional', label: 'Professional', desc: 'Objective, standard financial terminology' },
                        { id: 'beginner', label: 'Beginner Friendly', desc: 'Simple explanations, no jargon' },
                        { id: 'witty', label: 'Witty & Fun', desc: 'Engaging, humorous, energetic' },
                    ].map((option) => (
                        <div
                            key={option.id}
                            className={`flex flex-col p-3 border rounded-lg cursor-pointer transition-colors ${settings.tone === option.id ? 'border-primary bg-muted/50' : 'hover:bg-muted/30'
                                }`}
                            onClick={() => setSettings({ ...settings, tone: option.id as any })}
                        >
                            <span className="font-semibold text-sm">{option.label}</span>
                            <span className="text-xs text-muted-foreground">{option.desc}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Length Setting */}
            <div className="space-y-3">
                <label className="text-base font-medium">Briefing Length</label>
                <div className="flex gap-4">
                    {[
                        { id: 'concise', label: 'Concise (Bullet Points)' },
                        { id: 'detailed', label: 'Detailed (Paragraphs)' },
                    ].map((option) => (
                        <div
                            key={option.id}
                            className={`flex-1 p-3 border rounded-lg cursor-pointer text-center text-sm transition-colors ${settings.length === option.id ? 'border-primary bg-muted/50 font-medium' : 'hover:bg-muted/30'
                                }`}
                            onClick={() => setSettings({ ...settings, length: option.id as any })}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            </div>

            {/* Save Button */}
            <div className="pt-4">
                <Button onClick={handleSave} disabled={saving} className="w-full">
                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    {saving ? 'Saving...' : 'Save Preferences'}
                </Button>
                {message && (
                    <p className={`text-sm text-center mt-3 ${message.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                        {message.text}
                    </p>
                )}
            </div>

        </div>
    )
}
