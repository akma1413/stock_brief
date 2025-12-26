'use client'

import { useState } from 'react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { explainTerm } from '../definition-service'
import { Loader2 } from 'lucide-react'

interface TermTriggerProps {
    term: string
}

export function TermTrigger({ term }: TermTriggerProps) {
    const [definition, setDefinition] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)

    const handleOpenChange = async (isOpen: boolean) => {
        setOpen(isOpen)
        if (isOpen && !definition && !loading) {
            setLoading(true)
            try {
                const def = await explainTerm(term)
                setDefinition(def)
            } catch (e) {
                setDefinition("Failed to load definition.")
            } finally {
                setLoading(false)
            }
        }
    }

    return (
        <Popover open={open} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
                <span
                    className="border-b-2 border-dotted border-primary/50 cursor-pointer hover:bg-primary/10 hover:border-primary transition-colors pb-0.5 whitespace-nowrap"
                    onClick={(e) => e.stopPropagation()} // Prevent card click
                >
                    {term}
                </span>
            </PopoverTrigger>
            <PopoverContent className="w-80 text-sm">
                <h4 className="font-semibold mb-2 capitalize">{term}</h4>
                {loading ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Asking AI...</span>
                    </div>
                ) : (
                    <p className="text-muted-foreground leading-relaxed">
                        {definition}
                    </p>
                )}
            </PopoverContent>
        </Popover>
    )
}
