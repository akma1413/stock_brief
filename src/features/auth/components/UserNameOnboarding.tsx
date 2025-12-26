'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { User } from '@supabase/supabase-js'

export function UserNameOnboarding({ user }: { user: User }) {
    const [isOpen, setIsOpen] = useState(false)
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)
    const supabase = createClient()
    const router = useRouter()

    useEffect(() => {
        // Check if user has name in metadata
        // We use 'full_name' as the standard key
        if (user && !user.user_metadata?.full_name) {
            setIsOpen(true)
        }
    }, [user])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim()) return

        setLoading(true)
        try {
            const { error } = await supabase.auth.updateUser({
                data: { full_name: name }
            })
            if (error) throw error

            setIsOpen(false)
            router.refresh()
        } catch (error) {
            console.error('Error updating name:', error)
            alert('이름 저장 중 오류가 발생했습니다.')
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-background border rounded-lg shadow-lg p-6 w-full max-w-md mx-4 animate-in fade-in zoom-in-95 duration-300">
                <h2 className="text-xl font-bold mb-2">환영합니다!</h2>
                <p className="text-muted-foreground mb-4">서비스 이용을 위해 이름을 설정해주세요.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">이름</label>
                        <Input
                            id="name"
                            placeholder="이름 입력 (예: 홍길동)"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={loading}
                            required
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? '저장 중...' : '시작하기'}
                    </Button>
                </form>
            </div>
        </div>
    )
}
