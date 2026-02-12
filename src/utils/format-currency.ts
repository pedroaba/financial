export class CurrencyFormatter {
  private static readonly formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  static format(amount: string): string {
    const num = Number(amount)
    if (Number.isNaN(num)) {
      return String(amount)
    }

    return this.formatter.format(num)
  }
}
