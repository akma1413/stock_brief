'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface UserSettings {
    tone: 'professional' | 'beginner' | 'witty'
    length: 'concise' | 'detailed'
    showSources: boolean
}

export async function getUserSettings(): Promise<{ settings?: UserSettings; error?: string }> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Not authenticated' }

    const { data, error } = await supabase
        .from('user_settings')
        .select('tone, length, show_sources')
        .eq('user_id', user.id)
        .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 is "Row not found"
        console.error('Error fetching settings:', error)
        return { error: 'Failed to fetch settings' }
    }

    // Default values if not found using nullish coalescing or explicit check
    return {
        settings: {
            tone: data?.tone || 'professional',
            length: data?.length || 'concise',
            showSources: data?.show_sources ?? true
        }
    }
}

export async function updateUserSettings(settings: UserSettings): Promise<{ success?: boolean; error?: string }> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Not authenticated' }

    const { error } = await supabase
        .from('user_settings')
        .upsert({
            user_id: user.id,
            tone: settings.tone,
            length: settings.length,
            show_sources: settings.showSources,
            updated_at: new Date().toISOString()
        })

    if (error) {
        console.error('Error updating settings:', error)
        return { error: 'Failed to update settings' }
    }

    revalidatePath('/settings')
    return { success: true }
}
