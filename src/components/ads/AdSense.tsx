'use client'

import { useEffect, useRef } from 'react'
import Script from 'next/script'

interface AdSenseProps {
    client?: string
    slot?: string
    format?: 'auto' | 'fluid' | 'rectangle'
    responsive?: boolean
    className?: string
    style?: React.CSSProperties
    layoutKey?: string
}

export function AdSense({
    client,
    slot,
    format = 'auto',
    responsive = true,
    className,
    style,
    layoutKey
}: AdSenseProps) {
    // Default to environment variables if props not provided
    const adClient = client || process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID
    const adSlot = slot || process.env.NEXT_PUBLIC_ADSENSE_SLOT_ID
    // Only use placeholder if keys are missing (Testing mode enabled)
    const isDev = !adClient || !adSlot

    const pushedRef = useRef(false)

    useEffect(() => {
        if (isDev) return

        try {
            // Check if window.adsbygoogle is available and hasn't been pushed for this instance yet
            // Note: AdSense manages multiple pushes itself, but strict mode in React can cause double pushes
            // Safe pattern:
            if (window.adsbygoogle) {
                // @ts-ignore
                (window.adsbygoogle = window.adsbygoogle || []).push({})
            }
        } catch (e) {
            console.error('AdSense error:', e)
        }
    }, [isDev, adSlot])

    if (isDev) {
        return (
            <div
                className={`bg-muted/50 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/20 overflow-hidden group relative ${className}`}
                style={{ ...style, minWidth: '300px', minHeight: '250px' }}
            >
                <div className="z-10 text-center p-4">
                    <span className="block text-muted-foreground font-semibold mb-1">광고 영역 (DEV)</span>
                    <span className="text-xs text-muted-foreground/70">{format === 'auto' ? 'Responsive' : format}</span>
                </div>

                {/* Animated shimmer effect to simulate "active" state */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />

                {/* Debug Info */}
                <div className="absolute bottom-2 left-0 right-0 text-[10px] text-center text-muted-foreground/30">
                    Client: {adClient || 'Missing'} | Slot: {adSlot || 'Missing'}
                </div>
            </div>
        )
    }

    return (
        <div className={className}>
            <ins
                className="adsbygoogle"
                style={{ display: 'block', ...style }}
                data-ad-client={adClient}
                data-ad-slot={adSlot}
                data-ad-format={format}
                data-full-width-responsive={responsive}
                data-ad-layout-key={layoutKey}
            />
            <Script
                id="adsense-init"
                async
                src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClient}`}
                crossOrigin="anonymous"
                strategy="afterInteractive"
            />
        </div>
    )
}
