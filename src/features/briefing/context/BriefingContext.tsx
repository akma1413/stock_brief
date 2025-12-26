'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import { BriefingData } from '@/features/briefing/types'

interface BriefingContextType {
    briefingData: BriefingData | null
    setBriefingData: (data: BriefingData | null) => void
}

const BriefingContext = createContext<BriefingContextType | undefined>(undefined)

export function BriefingProvider({ children }: { children: ReactNode }) {
    const [briefingData, setBriefingData] = useState<BriefingData | null>(null)

    return (
        <BriefingContext.Provider value={{ briefingData, setBriefingData }}>
            {children}
        </BriefingContext.Provider>
    )
}

export function useBriefing() {
    const context = useContext(BriefingContext)
    if (context === undefined) {
        throw new Error('useBriefing must be used within a BriefingProvider')
    }
    return context
}
