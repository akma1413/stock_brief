import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 space-y-4">
            <h1 className="text-4xl font-bold">Stock Brief</h1>
            <p className="text-xl text-muted-foreground">Your daily market summary</p>
            <div className="flex gap-4">
                <Link href="/login">
                    <Button>Get Started</Button>
                </Link>
            </div>
        </div>
    );
}
