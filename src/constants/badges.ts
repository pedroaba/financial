export const CATEGORY_KIND_BADGES = {
  expense: {
    label: 'Expense',
    backgroundColor: 'bg-destructive',
    textColor: 'text-destructive-foreground',
  },
  income: {
    label: 'Income',
    backgroundColor: 'bg-green-500',
    textColor: 'text-white',
  },
  investment: {
    label: 'Investment',
    backgroundColor: 'bg-blue-500',
    textColor: 'text-white',
  },
} as const

export const TRANSACTION_TYPE_BADGES = {
  income: {
    label: 'Income',
    backgroundColor: 'bg-green-500',
    textColor: 'text-white',
    amountClass: 'text-green-600 dark:text-green-400',
    prefix: '+',
  },
  expense: {
    label: 'Expense',
    backgroundColor: 'bg-destructive',
    textColor: 'text-destructive-foreground',
    amountClass: 'text-destructive',
    prefix: '−',
  },
  savings: {
    label: 'Savings',
    backgroundColor: 'bg-blue-500',
    textColor: 'text-white',
    amountClass: 'text-blue-600 dark:text-blue-400',
    prefix: '',
  },
} as const
