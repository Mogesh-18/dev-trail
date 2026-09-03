import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useMediaQuery } from "@/hooks/use-media-query";
import { BREAKPOINTS } from "@/constants/breakpoints";

/**
 * Renders a centered Dialog on desktop and a full‑width bottom Sheet on mobile
 * using a single consistent API. The underlying wrapper is chosen based on screen size.
 * 
 * @param {Object} props
 * @param {boolean} props.open - Controls visibility.
 * @param {(open: boolean) => void} props.onOpenChange - Callback for open state changes.
 * @param {string} props.title - Title displayed in the header.
 * @param {React.ReactNode} props.children - Content inside the dialog/sheet.
 * @param {string} [props.contentClassName] - Additional CSS classes for the content container.
 * @returns {JSX.Element}
 */
export function ResponsiveDialog({ open, onOpenChange, title, children, contentClassName }) {
    const isDesktop = useMediaQuery(BREAKPOINTS.MD);

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className={contentClassName}>
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                    </DialogHeader>
                    {children}
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="bottom" className={contentClassName}>
                <SheetHeader>
                    <SheetTitle>{title}</SheetTitle>
                </SheetHeader>
                <div className="mt-4">{children}</div>
            </SheetContent>
        </Sheet>
    );
}