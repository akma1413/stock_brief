import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/briefing'

    console.log(`[Auth Callback] Processing code: ${code?.substring(0, 5)}...`)

    if (code) {
        const supabase = await createClient()
        console.log('[Auth Callback] Supabase client created')

        try {
            const { error } = await supabase.auth.exchangeCodeForSession(code)

            if (!error) {
                console.log('[Auth Callback] Session exchange successful')
                const forwardedHost = request.headers.get('x-forwarded-host')
                const isLocalEnv = process.env.NODE_ENV === 'development'

                let redirectUrl = `${origin}${next}`
                if (isLocalEnv) {
                    redirectUrl = `${origin}${next}`
                } else if (forwardedHost) {
                    redirectUrl = `https://${forwardedHost}${next}`
                }

                console.log(`[Auth Callback] Redirecting to: ${redirectUrl}`)
                return NextResponse.redirect(redirectUrl)
            } else {
                console.error('[Auth Callback] Exchange error:', error)
            }
        } catch (err) {
            console.error('[Auth Callback] Unexpected error during exchange:', err)
        }
    }

    // Return to login with error if something went wrong
    console.log('[Auth Callback] Redirecting to login with error')
    return NextResponse.redirect(`${origin}/login?error=auth-code-error`)
}
