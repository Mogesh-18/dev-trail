import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
} from "@/components/ui/alert-dialog";

/**
 * Destructive-action confirmation. A destructive-tinted icon badge
 * (matching StatCard/ErrorState's shadow language) instead of bare
 * text, and the confirm button uses the destructive glow on hover so
 * the weight of the action is visually obvious before you click it.
 *
 * @param {Object} props
 * @param {boolean} props.open
 * @param {(open: boolean) => void} props.onOpenChange
 * @param {string} props.title
 * @param {string} [props.description]
 * @param {() => void} props.onConfirm
 * @param {boolean} [props.isPending]
 * @returns {JSX.Element}
 */
export function ConfirmDeleteDialog({ open, onOpenChange, title, description, onConfirm, isPending }) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="shadow-[var(--shadow-lg)] data-[state=open]:duration-base data-[state=open]:ease-trail data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:zoom-in-95">
                <AlertDialogHeader>
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                        <AlertTriangle className="h-5 w-5" />
                    </span>
                    <AlertDialogTitle className="pt-2">{title}</AlertDialogTitle>
                    {description && <AlertDialogDescription>{description}</AlertDialogDescription>}
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="transition-transform duration-fast ease-spring active:scale-95">
                        Cancel
                    </AlertDialogCancel>
                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        disabled={isPending}
                        className="transition-all duration-fast ease-spring hover:shadow-[0_10px_28px_-10px_hsl(var(--destructive)/0.45)] active:scale-95"
                    >
                        {isPending ? "Deleting…" : "Delete"}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}