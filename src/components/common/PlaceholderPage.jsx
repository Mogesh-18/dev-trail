import { BrandMark } from "@/components/common/BrandMark";

/**
 * Fallback for routes not yet built out. Kept honest rather than
 * pretending to be a finished page — but still styled consistently
 * (floating brand mark, same entrance choreography) so an unfinished
 * route doesn't look broken.
 *
 * @param {Object} props
 * @param {string} props.title
 * @param {string} [props.description]
 * @returns {JSX.Element}
 */
export function PlaceholderPage({ title, description }) {
    return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-center duration-slow animate-in fade-in zoom-in-95">
            <BrandMark className="h-8 w-8 animate-float text-muted-foreground/40" />
            <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
            {description && <p className="max-w-sm text-sm text-muted-foreground">{description}</p>}
        </div>
    );
}