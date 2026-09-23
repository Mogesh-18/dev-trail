import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { Document } from "@tiptap/extension-document";
import { Paragraph } from "@tiptap/extension-paragraph";
import { Text } from "@tiptap/extension-text";
import { Bold } from "@tiptap/extension-bold";
import { Italic } from "@tiptap/extension-italic";
import { Underline } from "@tiptap/extension-underline";
import { Heading } from "@tiptap/extension-heading";
import { BulletList } from "@tiptap/extension-bullet-list";
import { OrderedList } from "@tiptap/extension-ordered-list";
import { ListItem } from "@tiptap/extension-list-item";
import { Blockquote } from "@tiptap/extension-blockquote";
import { Link } from "@tiptap/extension-link";
import { History } from "@tiptap/extension-history";
import { Bold as BoldIcon, Italic as ItalicIcon, Underline as UnderlineIcon, List, ListOrdered, Link2, Quote, Heading3, Undo2, Redo2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Deliberately minimal extension set — not @tiptap/starter-kit, which
 * bundles ~15 extensions (code blocks, horizontal rules, strikethrough,
 * hard breaks, gap/drop cursors, etc.) that this app doesn't need.
 * Only the marks/nodes the toolbar below actually exposes are
 * registered, so there's no unused schema surface and no way to paste
 * in formatting (e.g. a code block from elsewhere) that has no button
 * to create or remove it.
 */
const EXTENSIONS = [
    Document,
    Paragraph,
    Text,
    Bold,
    Italic,
    Underline,
    Heading.configure({ levels: [3] }),
    BulletList,
    OrderedList,
    ListItem,
    Blockquote,
    Link.configure({ openOnClick: false, HTMLAttributes: { target: "_blank", rel: "noopener noreferrer" } }),
    History,
];

const TOOLBAR = [
    { key: "bold", icon: BoldIcon, label: "Bold", run: (chain) => chain.toggleBold(), isActive: (e) => e.isActive("bold") },
    { key: "italic", icon: ItalicIcon, label: "Italic", run: (chain) => chain.toggleItalic(), isActive: (e) => e.isActive("italic") },
    { key: "underline", icon: UnderlineIcon, label: "Underline", run: (chain) => chain.toggleUnderline(), isActive: (e) => e.isActive("underline") },
    { key: "heading", icon: Heading3, label: "Heading", run: (chain) => chain.toggleHeading({ level: 3 }), isActive: (e) => e.isActive("heading", { level: 3 }) },
    { key: "bulletList", icon: List, label: "Bullet list", run: (chain) => chain.toggleBulletList(), isActive: (e) => e.isActive("bulletList") },
    { key: "orderedList", icon: ListOrdered, label: "Numbered list", run: (chain) => chain.toggleOrderedList(), isActive: (e) => e.isActive("orderedList") },
    { key: "blockquote", icon: Quote, label: "Quote", run: (chain) => chain.toggleBlockquote(), isActive: (e) => e.isActive("blockquote") },
];

/**
 * Simple rich text editor built on TipTap with a hand-picked minimal
 * extension set (no starter-kit) — bold, italic, underline, one
 * heading level, lists, quote, link, undo/redo. Nothing else. Output
 * is TipTap's own sanitized HTML (its schema physically can't produce
 * a tag/mark that isn't registered above), passed to onChange as a
 * plain string so it plugs into react-hook-form's Controller exactly
 * like the old Textarea did.
 *
 * @param {Object} props
 * @param {string} props.value - Current HTML content.
 * @param {(html: string) => void} props.onChange
 * @param {string} [props.placeholder]
 * @param {string} [props.minHeight="8rem"]
 * @returns {JSX.Element}
 */
export function RichTextEditor({ value, onChange, placeholder, minHeight = "8rem" }) {
    const editor = useEditor({
        extensions: EXTENSIONS,
        content: value || "",
        editorProps: {
            attributes: {
                class: "rich-text px-3 py-2 text-sm focus:outline-none",
                style: `min-height: ${minHeight}`,
            },
        },
        onUpdate: ({ editor }) => onChange(editor.getHTML()),
    });

    // Sync external value changes (e.g. form reset on dialog open) into
    // the editor, but only when it's not focused — otherwise every
    // keystroke would fight the form's own state and reset the cursor.
    useEffect(() => {
        if (!editor || editor.isFocused) return;
        const current = editor.getHTML();
        if (current !== (value || "")) editor.commands.setContent(value || "", false);
    }, [editor, value]);

    if (!editor) return null;

    return (
        <div
            className={cn(
                "rounded-md border border-input bg-background transition-colors duration-fast",
                editor.isFocused && "ring-2 ring-ring ring-offset-2 ring-offset-background"
            )}
        >
            <div className="flex flex-wrap items-center gap-0.5 border-b border-border/60 p-1">
                {TOOLBAR.map(({ key, icon: Icon, label, run, isActive }) => (
                    <button
                        key={key}
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => run(editor.chain().focus()).run()}
                        title={label}
                        className={cn(
                            "flex h-7 w-7 items-center justify-center rounded transition-colors duration-fast hover:bg-muted",
                            isActive(editor) && "bg-primary/10 text-primary"
                        )}
                    >
                        <Icon className="h-3.5 w-3.5" />
                    </button>
                ))}
                <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                        const url = window.prompt("Link URL");
                        if (!url) return;
                        editor.chain().focus().setLink({ href: url }).run();
                    }}
                    title="Link"
                    className={cn("flex h-7 w-7 items-center justify-center rounded transition-colors duration-fast hover:bg-muted", editor.isActive("link") && "bg-primary/10 text-primary")}
                >
                    <Link2 className="h-3.5 w-3.5" />
                </button>
                <span className="mx-1 h-4 w-px bg-border" />
                <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    title="Undo"
                    className="flex h-7 w-7 items-center justify-center rounded transition-colors duration-fast hover:bg-muted disabled:opacity-30"
                >
                    <Undo2 className="h-3.5 w-3.5" />
                </button>
                <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    title="Redo"
                    className="flex h-7 w-7 items-center justify-center rounded transition-colors duration-fast hover:bg-muted disabled:opacity-30"
                >
                    <Redo2 className="h-3.5 w-3.5" />
                </button>
            </div>

            <div className="relative">
                {editor.isEmpty && placeholder && (
                    <span className="pointer-events-none absolute left-3 top-2 text-sm text-muted-foreground">{placeholder}</span>
                )}
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}