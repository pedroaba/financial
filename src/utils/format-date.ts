export class DateFormatter {
  private static readonly formatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  static format(date: string): string {
    const dateObj = new Date(date)
    if (Number.isNaN(dateObj.getTime())) {
      return date
    }

    return this.formatter.format(dateObj)
  }
}
