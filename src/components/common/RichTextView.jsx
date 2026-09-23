import { sanitizeHtml } from "@/utils/sanitize-html";

/**
 * Renders rich-text HTML produced by RichTextEditor. Sanitization here
 * is now a defense-in-depth layer rather than a strict necessity —
 * TipTap's schema physically can't emit a tag outside the extension
 * set (see RichTextEditor's EXTENSIONS list), but data saved before a
 * future extension-set change, or content edited directly in the DB,
 * could still contain something unexpected, so this stays in place.
 *
 * @param {Object} props
 * @param {string} props.html
 * @param {string} [props.className]
 * @returns {JSX.Element}
 */
export function RichTextView({ html, className }) {
    return <div className={`rich-text ${className ?? ""}`} dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }} />;
}