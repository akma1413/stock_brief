'use client'

import { TermTrigger } from './TermTrigger'

interface TermHighlighterProps {
    text: string
    showSources?: boolean
}

import { useToast } from "@/hooks/use-toast"

export function TermHighlighter({ text, showSources }: TermHighlighterProps) {
    const { toast } = useToast()

    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
        e.stopPropagation() // Prevent card click

        // Mock Check: If URL contains 'broken', simulate failure
        if (url.includes('broken')) {
            e.preventDefault()
            toast({
                variant: "destructive",
                title: "Source Unavailable",
                description: "This link appears to be broken or outdated.",
            })
        }
        // Otherwise, let regular navigation happen (new tab)
    }

    // Regex matches either {Term} or [Source](Url)
    // ...
    const parts = text.split(/({[^}]+}|\[[^\]]+\]\([^)]+\))/g)

    return (
        <span>
            {parts.map((part, i) => {
                // ... (Term Check)
                const termMatch = part.match(/^\{(.+)\}$/)
                if (termMatch) {
                    return <TermTrigger key={i} term={termMatch[1]} />
                }

                // Check if it's a Source: [Name](Url)
                const sourceMatch = part.match(/^\[(.+)\]\((.+)\)$/)
                if (sourceMatch) {
                    if (!showSources) return null
                    const [_, name, url] = sourceMatch
                    return (
                        <a
                            key={i}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-muted-foreground hover:text-primary transition-colors ml-1 decoration-0 border-b border-transparent hover:border-primary"
                            onClick={(e) => handleLinkClick(e, url)}
                        >
                            [{name}]
                        </a>
                    )
                }
                // ... (Regular Text)
                return <span key={i}>{part}</span>
            })}
        </span>
    )
}

