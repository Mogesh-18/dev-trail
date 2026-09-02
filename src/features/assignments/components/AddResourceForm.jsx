import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAddLinkResource, useUploadFileResource } from "@/features/assignments/hooks/useAssignments";

export function AddResourceForm({ assignmentId }) {
    const [linkUrl, setLinkUrl] = useState("");
    const [linkLabel, setLinkLabel] = useState("");
    const fileInputRef = useRef(null);

    const addLinkResource = useAddLinkResource(assignmentId);
    const uploadFileResource = useUploadFileResource(assignmentId);

    function handleAddLink(e) {
        e.preventDefault();
        if (!linkUrl.trim()) return;
        addLinkResource.mutate(
            { url: linkUrl.trim(), label: linkLabel.trim() || linkUrl.trim() },
            { onSuccess: () => { setLinkUrl(""); setLinkLabel(""); } }
        );
    }

    function handleFileChange(e) {
        const file = e.target.files?.[0];
        if (!file) return;
        uploadFileResource.mutate(file, {
            onSuccess: () => { if (fileInputRef.current) fileInputRef.current.value = ""; },
        });
    }

    return (
        <div className="space-y-3">
            <form onSubmit={handleAddLink} className="flex flex-col gap-2 sm:flex-row">
                <Input
                    placeholder="Label (optional)"
                    value={linkLabel}
                    onChange={(e) => setLinkLabel(e.target.value)}
                    className="sm:w-40"
                />
                <Input
                    placeholder="https://…"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    className="flex-1"
                />
                <Button type="submit" variant="outline" disabled={addLinkResource.isPending}>
                    {addLinkResource.isPending ? "Adding…" : "Add link"}
                </Button>
            </form>

            <div className="flex items-center gap-2">
                <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileChange}
                    disabled={uploadFileResource.isPending}
                    className="text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-secondary-foreground hover:file:bg-secondary/80"
                />
                {uploadFileResource.isPending && <span className="text-xs text-muted-foreground">Uploading…</span>}
            </div>
        </div>
    );
}