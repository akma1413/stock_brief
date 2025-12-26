import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { StockSearch } from "@/features/portfolio/components/StockSearch";

import { Suspense } from "react";
import { PortfolioList } from "@/features/portfolio/components/PortfolioList";
import { BriefingGenerator } from "@/features/briefing/components/BriefingGenerator";
import { UserNameOnboarding } from "@/features/auth/components/UserNameOnboarding";
import { BriefingProvider } from "@/features/briefing/context/BriefingContext";

export default async function BriefingPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || '투자자';

    return (
        <BriefingProvider>
            <div className="p-4 space-y-6">
                <UserNameOnboarding user={user} />
                <div>
                    <h1 className="text-2xl font-bold mb-1">데일리 브리핑</h1>
                    <p className="text-muted-foreground text-sm">환영합니다, {displayName}님</p>
                </div>

                <div className="space-y-6">
                    <div className="p-4 border rounded-lg bg-card shadow-sm">
                        <BriefingGenerator />
                    </div>

                    <div className="space-y-6">
                        <section>
                            <h2 className="font-semibold mb-3">포트폴리오에 종목 추가</h2>
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
        </BriefingProvider>
    );
}
