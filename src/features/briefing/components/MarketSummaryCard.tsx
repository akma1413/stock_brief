

'use client'

import { MarketInsight } from "@/lib/gemini-service";
import { TrendingUp, Zap, Newspaper, Briefcase, ChevronRight, ChevronLeft } from "lucide-react";
import useEmblaCarousel from 'embla-carousel-react'
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface MarketSummaryCardProps {
    insight: MarketInsight;
}

export function MarketSummaryCard({ insight }: MarketSummaryCardProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false })
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

    const onSelect = useCallback(() => {
        if (!emblaApi) return
        setSelectedIndex(emblaApi.selectedScrollSnap())
    }, [emblaApi])

    useEffect(() => {
        if (!emblaApi) return
        onSelect()
        setScrollSnaps(emblaApi.scrollSnapList())
        emblaApi.on('select', onSelect)
        emblaApi.on('reInit', onSelect)
    }, [emblaApi, onSelect])

    if (!insight) return null;

    const cards = [
        {
            title: "오늘의 시장",
            icon: TrendingUp,
            content: insight.outlook,
            color: "text-foreground",
            bgColor: "bg-background"
        },
        {
            title: "시장 주도 섹터",
            icon: Zap,
            content: insight.sectorHighlight,
            color: "text-amber-500",
            bgColor: "bg-amber-50/50 dark:bg-amber-950/20"
        },
        {
            title: "주요 매크로 이슈",
            icon: Newspaper,
            content: insight.macroEvents,
            color: "text-blue-500",
            bgColor: "bg-blue-50/50 dark:bg-blue-950/20"
        },
        {
            title: "내 포트폴리오 영향",
            icon: Briefcase,
            content: insight.portfolioImplication,
            color: "text-green-500",
            bgColor: "bg-green-50/50 dark:bg-green-950/20"
        }
    ];

    return (
        <div className="bg-card border rounded-xl overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Header */}
            <div className="px-5 py-3 border-b flex justify-between items-center bg-muted/20">
                <h3 className="text-sm font-semibold flex items-center gap-2 text-muted-foreground">
                    <TrendingUp className="w-4 h-4" />
                    시황 브리핑
                </h3>
                <div className="flex gap-1">
                    {scrollSnaps.map((_, index) => (
                        <div
                            key={index}
                            className={cn(
                                "w-1.5 h-1.5 rounded-full transition-all duration-300",
                                index === selectedIndex ? "bg-primary w-3" : "bg-muted-foreground/30"
                            )}
                        />
                    ))}
                </div>
            </div>

            {/* Carousel Area */}
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex touch-pan-y">
                    {cards.map((card, index) => (
                        <div key={index} className="flex-[0_0_100%] min-w-0 pl-0">
                            <div className="p-4 min-h-[160px] flex flex-col justify-start gap-4 h-full">
                                <div className="flex items-center gap-2">
                                    <card.icon className={cn("w-5 h-5", card.color)} />
                                    <h4 className="font-bold text-lg">{card.title}</h4>
                                </div>
                                <ul className="space-y-2">
                                    {Array.isArray(card.content) && card.content.map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm leading-relaxed break-keep">
                                            <span className={cn("mt-1.5 w-1.5 h-1.5 rounded-full shrink-0", card.color.replace('text-', 'bg-'))} />
                                            <span className="text-foreground/90">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
