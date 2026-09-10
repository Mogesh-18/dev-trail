import { useMediaQuery } from "@/hooks/use-media-query";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

/**
 * Dialog on desktop, bottom Sheet on mobile. `contentClassName` lets
 * callers (e.g. AssignmentFormDialog's `sm:max-w-lg`) size the panel
 * without fighting the base entrance/shadow classes.
 *
 * @param {Object} props
 * @param {boolean} props.open
 * @param {(open: boolean) => void} props.onOpenChange
 * @param {string} props.title
 * @param {string} [props.description]
 * @param {string} [props.contentClassName]
 * @param {React.ReactNode} props.children
 * @returns {JSX.Element}
 */
export function ResponsiveDialog({ open, onOpenChange, title, description, contentClassName, children }) {
    const isDesktop = useMediaQuery("(min-width: 768px)");

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent
                    className={cn(
                        "shadow-[var(--shadow-lg)]",
                        "data-[state=open]:duration-base data-[state=open]:ease-trail",
                        "data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:zoom-in-95",
                        "data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-95",
                        contentClassName
                    )}
                >
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        {description && <DialogDescription>{description}</DialogDescription>}
                    </DialogHeader>
                    {children}
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                side="bottom"
                className={cn(
                    "max-h-[88vh] overflow-y-auto rounded-t-xl shadow-[var(--shadow-lg)]",
                    "data-[state=open]:duration-base data-[state=open]:ease-trail",
                    contentClassName
                )}
            >
                <SheetHeader>
                    <SheetTitle>{title}</SheetTitle>
                    {description && <SheetDescription>{description}</SheetDescription>}
                </SheetHeader>
                {children}
            </SheetContent>
        </Sheet>
    );
}