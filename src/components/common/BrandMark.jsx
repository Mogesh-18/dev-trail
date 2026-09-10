/**
 * Brand glyph — a peak with a checkpoint marker. Add `group` to a
 * parent (Sidebar/MobileHeader brand row) to get the marker's subtle
 * rotate-on-hover — a small signature touch on the one element that
 * appears on every screen.
 *
 * @param {Object} props
 * @param {string} [props.className]
 * @returns {JSX.Element}
 */
export function BrandMark({ className }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            className={`transition-transform duration-base ease-trail group-hover:-rotate-6 ${className ?? ""}`}
            aria-hidden="true"
        >
            <path
                d="M3 18L9.5 7L13 12.5L15.5 9L21 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <circle cx="15.5" cy="9" r="2" fill="currentColor" />
        </svg>
    );
}