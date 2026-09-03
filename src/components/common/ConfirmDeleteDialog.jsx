import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

/**
 * A confirmation dialog for destructive actions (e.g., delete).
 * 
 * @param {Object} props
 * @param {boolean} props.open - Controls dialog visibility.
 * @param {(open: boolean) => void} props.onOpenChange - Callback when open state changes.
 * @param {string} props.title - Dialog title.
 * @param {string} props.description - Dialog description.
 * @param {() => void} props.onConfirm - Callback when delete is confirmed.
 * @param {boolean} [props.isPending] - Whether the delete action is in progress.
 * @returns {JSX.Element}
 */
export function ConfirmDeleteDialog({ open, onOpenChange, title, description, onConfirm, isPending }) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        disabled={isPending}
                        onClick={onConfirm}
                    >
                        {isPending ? "Deleting…" : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}