import { SettingsForm } from '@/features/settings/components/SettingsForm'

export default function SettingsPage() {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">
                    Customize your Daily Briefing experience.
                </p>
            </div>

            <div className="p-6 border rounded-lg bg-card">
                <SettingsForm />
            </div>
        </div>
    )
}
