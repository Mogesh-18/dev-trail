import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

/**
 * A confirmation dialog that warns the user when they are about to overwrite
 * changes made by someone else (from another tab or device).
 * 
 * @param {Object} props
 * @param {boolean} props.open - Controls dialog visibility.
 * @param {(open: boolean) => void} props.onOpenChange - Callback for open state changes.
 * @param {() => void} props.onConfirm - Callback when the user confirms "Save anyway".
 * @returns {JSX.Element}
 */
export function StaleEditWarningDialog({ open, onOpenChange, onConfirm }) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>This was changed elsewhere</AlertDialogTitle>
                    <AlertDialogDescription>
                        Someone updated this since you opened the form — likely from another tab or device. Saving now will
                        overwrite that change with what you have here.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm}>Save anyway</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}