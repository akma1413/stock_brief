'use server'

export async function explainTerm(term: string): Promise<string> {
    // Simulate AI latency
    await new Promise((resolve) => setTimeout(resolve, 800))

    const definitions: Record<string, string> = {
        "volatility": "Volatility refers to how much a stock's price swings up and down over a short period. High volatility means higher risk but potential for higher reward.",
        "resistance level": "A price point where a stock has trouble rising above, because many people sell at that price.",
        "cloud services": "Internet-based computing services like servers, storage, and databases (e.g., AWS, Azure).",
        "regulatory scrutiny": "When government agencies investigate a company to ensure it follows laws, often leading to fines or rule changes.",
        "sector rotation": "When investors move money from one industry (like Tech) to another (like Energy) based on economic cycles.",
        "institutional interest": "Buying activity by large organizations like mutual funds and piles, which often drives price trends.",
        "uptrend": "A pattern where a stock's price generally moves higher over time (higher highs and higher lows).",
        "consolidation": "A period where a stock trades within a narrow range, neither going up nor down significantly.",
        "cash flow": "The net amount of cash moving in and out of a business; positive cash flow indicates financial health."
    }

    const normalized = term.toLowerCase().trim()
    return definitions[normalized] || `A financial concept referring to "${term}". (AI generated definition placeholder)`
}
