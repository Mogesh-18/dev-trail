import { useState, useRef } from "react";
import { Link2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAddLinkResource, useUploadFileResource } from "@/features/assignments/hooks/useAssignments";

/**
 * Add-resource form. File picker is now a real drop-zone-styled button
 * instead of a bare native file input, matching the app's button
 * language instead of browser default chrome.
 *
 * @param {Object} props
 * @param {string|number} props.assignmentId
 * @returns {JSX.Element}
 */
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
                <div className="relative sm:w-40">
                    <Link2 className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Label (optional)"
                        value={linkLabel}
                        onChange={(e) => setLinkLabel(e.target.value)}
                        className="pl-8"
                    />
                </div>
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

            <div className="flex items-center gap-3">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    disabled={uploadFileResource.isPending}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <Upload className="h-3.5 w-3.5" />
                    {uploadFileResource.isPending ? "Uploading…" : "Upload file"}
                </Button>
                <input ref={fileInputRef} type="file" onChange={handleFileChange} disabled={uploadFileResource.isPending} className="hidden" />
            </div>
        </div>
    );
}