/**
 * Utility class responsible for generating random hexadecimal color codes.
 */
export class RandomColor {
  /**
   * Generates a random color in hexadecimal format.
   *
   * This method produces a random number between 0 (inclusive) and 0xFFFFFF (exclusive),
   * which covers the full range of RGB colors in hexadecimal. The number is converted
   * to a hexadecimal string and padded with leading zeros to always use 6 digits,
   * then prefixed with a '#' to form a valid CSS color string.
   *
   * @example
   * // Returns a value like "#1a2b3c" or "#f5e4d3"
   * const color = RandomColor.generate();
   *
   * @returns {string} A string representing the generated color, always in the format "#rrggbb".
   */
  static generate(): string {
    const n = (Math.random() * 0xffffff) << 0
    return '#' + n.toString(16).padStart(6, '0')
  }
}
