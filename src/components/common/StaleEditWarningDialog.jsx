import { RefreshCw } from "lucide-react";
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
 * Conflict-on-save warning, shown when Realtime detects the record
 * changed underneath an open form. `onConfirm` matches how both
 * TaskFormDialog and AssignmentFormDialog actually call this.
 *
 * @param {Object} props
 * @param {boolean} props.open
 * @param {(open: boolean) => void} props.onOpenChange
 * @param {() => void} props.onConfirm
 * @param {() => void} [props.onReload]
 * @returns {JSX.Element}
 */
export function StaleEditWarningDialog({ open, onOpenChange, onConfirm, onReload }) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="shadow-[var(--shadow-lg)] data-[state=open]:duration-base data-[state=open]:ease-trail data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:zoom-in-95">
                <AlertDialogHeader>
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-status-progress/15 text-status-progress">
                        <RefreshCw className="h-5 w-5" />
                    </span>
                    <AlertDialogTitle className="pt-2">This changed while you were editing</AlertDialogTitle>
                    <AlertDialogDescription>
                        Someone updated this record since you opened it. Overwrite with your version, or reload to see the latest first.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="transition-transform duration-fast ease-spring active:scale-95">
                        Keep editing
                    </AlertDialogCancel>
                    {onReload && (
                        <Button
                            variant="outline"
                            onClick={onReload}
                            className="transition-all duration-fast ease-spring hover:shadow-[var(--shadow-md)] active:scale-95"
                        >
                            Reload latest
                        </Button>
                    )}
                    <Button
                        onClick={onConfirm}
                        className="transition-all duration-fast ease-spring hover:shadow-[var(--shadow-glow-primary)] active:scale-95"
                    >
                        Overwrite anyway
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}