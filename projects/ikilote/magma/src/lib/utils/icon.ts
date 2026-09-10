/**
 * Returns true if the given icon value should be rendered as an `<img>` element
 * rather than as text/ligature.
 *
 * Matches absolute URLs (http/https), protocol-relative URLs (//),
 * root-relative paths (/path/to/icon.png), and relative paths ending with
 * a known image extension.
 */
export function isIconUrl(icon: string): boolean {
    return (
        /^https?:\/\//i.test(icon) || icon.includes('/') || /\.(png|jpe?g|gif|svg|webp|avif|ico)(\?.*)?$/i.test(icon)
    );
}
