import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/common/BrandMark";

/**
 * 404 page — brand mark floats, CTA gets shadow/press treatment.
 * @returns {JSX.Element}
 */
export default function NotFoundPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background text-center duration-slow animate-in fade-in zoom-in-95">
            <BrandMark className="h-10 w-10 animate-float text-muted-foreground/40" />
            <div className="space-y-1.5">
                <h1 className="text-2xl font-semibold tracking-tight">Off the trail</h1>
                <p className="text-muted-foreground">That page doesn't exist.</p>
            </div>
            <Button
                asChild
                className="shadow-[var(--shadow-md)] transition-all duration-fast ease-spring hover:shadow-[var(--shadow-lg)] active:scale-95"
            >
                <Link to="/">Back to trailhead</Link>
            </Button>
        </div>
    );
}