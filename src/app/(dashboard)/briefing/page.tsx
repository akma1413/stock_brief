import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { StockSearch } from "@/features/portfolio/components/StockSearch";

import { Suspense } from "react";
import { PortfolioList } from "@/features/portfolio/components/PortfolioList";
import { BriefingGenerator } from "@/features/briefing/components/BriefingGenerator";

export default async function BriefingPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    return (
        <div className="p-4 space-y-6">
            <div>
                <h1 className="text-2xl font-bold mb-1">데일리 브리핑</h1>
                <p className="text-muted-foreground text-sm">환영합니다, {user.email}님</p>
            </div>

            <div className="space-y-6">
                <div className="p-4 border rounded-lg bg-card shadow-sm">
                    <h2 className="font-semibold mb-3 text-lg">오늘의 인사이트</h2>
                    <BriefingGenerator />
                </div>

                <div className="space-y-6">
                    <section>
                        <h2 className="font-semibold mb-3">관심 종목 추가</h2>
                        <StockSearch />
                    </section>

                    <section>
                        <h2 className="font-semibold mb-3">나의 포트폴리오</h2>
                        <Suspense fallback={<div className="text-sm text-muted-foreground">포트폴리오 불러오는 중...</div>}>
                            <PortfolioList />
                        </Suspense>
                    </section>
                </div>
            </div>
        </div>
    );
}
