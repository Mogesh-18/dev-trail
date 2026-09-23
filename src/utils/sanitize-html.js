const ALLOWED_TAGS = new Set(["P", "BR", "B", "STRONG", "I", "EM", "U", "S", "UL", "OL", "LI", "A", "CODE", "PRE", "BLOCKQUOTE", "H3", "H4", "DIV", "SPAN"]);
const ALLOWED_ATTRS = { A: ["href", "target", "rel"] };

/**
 * Minimal whitelist-based HTML sanitizer — no external dependency.
 * Walks the parsed DOM, drops any element not in ALLOWED_TAGS (but
 * keeps its text/child content, so stray formatting collapses to
 * plain text rather than vanishing), strips all attributes except the
 * few allowed on <a>, and forces safe rel/target on links. Used both
 * when saving RichTextEditor output and when rendering it, so content
 * is safe even if it somehow entered the database some other way.
 *
 * @param {string} html
 * @returns {string}
 */
export function sanitizeHtml(html) {
    if (!html) return "";
    const doc = new DOMParser().parseFromString(html, "text/html");

    function clean(node) {
        [...node.childNodes].forEach((child) => {
            if (child.nodeType === Node.TEXT_NODE) return;

            if (child.nodeType !== Node.ELEMENT_NODE || !ALLOWED_TAGS.has(child.tagName)) {
                // Unwrap: replace the disallowed element with its children
                // (keeps text content) rather than deleting it outright.
                while (child.firstChild) node.insertBefore(child.firstChild, child);
                node.removeChild(child);
                return;
            }

            [...child.attributes].forEach((attr) => {
                const allowed = ALLOWED_ATTRS[child.tagName] ?? [];
                if (!allowed.includes(attr.name)) child.removeAttribute(attr.name);
            });

            if (child.tagName === "A") {
                if (child.getAttribute("href")?.trim().toLowerCase().startsWith("javascript:")) {
                    child.removeAttribute("href");
                }
                child.setAttribute("target", "_blank");
                child.setAttribute("rel", "noopener noreferrer");
            }

            clean(child);
        });
    }

    clean(doc.body);
    return doc.body.innerHTML;
}

/**
 * Strips all HTML, leaving plain text — used for previews/snippets
 * (e.g. a card summary) where markup would look broken.
 *
 * @param {string} html
 * @returns {string}
 */
export function stripHtml(html) {
    if (!html) return "";
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent ?? "";
}