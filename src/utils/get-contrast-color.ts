/**
 * Returns a text color (black or white) that contrasts with the given background color.
 * Uses relative luminance (WCAG) to choose between #000000 and #FFFFFF.
 *
 * @param hex - The hexadecimal color code to check.
 * @returns The text color (black or white) that contrasts with the given background color.
 * @example
 * // Returns '#000000'
 * getContrastTextColor('#FFFFFF')
 * // Returns '#FFFFFF'
 * getContrastTextColor('#000000')
 */
export function getContrastTextColor(hex: string): string {
  const normalized = hex.replace(/^#/, '').trim()
  if (normalized.length !== 6 || !/^[0-9A-Fa-f]{6}$/.test(normalized)) {
    return '#000000'
  }

  const r = parseInt(normalized.substring(0, 2), 16) / 255
  const g = parseInt(normalized.substring(2, 4), 16) / 255
  const b = parseInt(normalized.substring(4, 6), 16) / 255

  const transform = (c: number) =>
    c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4

  const luminance =
    0.2126 * transform(r) + 0.7152 * transform(g) + 0.0722 * transform(b)

  return luminance > 0.179 ? '#000000' : '#FFFFFF'
}
