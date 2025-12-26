import { getPortfolio } from '@/features/portfolio/service'
import { PortfolioItem } from './PortfolioItem'

export async function PortfolioList() {
    const portfolio = await getPortfolio()

    if (portfolio.length === 0) {
        return (
            <div className="text-center p-4 text-muted-foreground border rounded-lg border-dashed text-sm">
                포트폴리오가 비어있습니다. 위에서 종목을 추가해보세요!
            </div>
        )
    }

    return (
        <div className="space-y-3">
            <div className="grid gap-3">
                {portfolio.map((stock) => (
                    <PortfolioItem key={stock.id} stock={stock} />
                ))}
            </div>
        </div>
    )
}
