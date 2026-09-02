import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useMediaQuery } from "@/hooks/use-media-query";
import { BREAKPOINTS } from "@/constants/breakpoints";

/**
 * Renders a centered Dialog on desktop and a full-width bottom Sheet on
 * mobile, behind one consistent API — callers never branch on breakpoint
 * themselves. This is the "Create Task: Dialog / Sheet" pattern from the
 * UI spec made concrete: one component picks the wrapper, not two.
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