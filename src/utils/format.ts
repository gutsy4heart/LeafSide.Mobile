export const formatCurrency = (value: number | null | undefined, currency = 'EUR') => {
  if (value === null || value === undefined) {
    return 'Price not specified';
  }
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${currency} ${value.toFixed(2)}`;
  }
};

export const truncate = (value: string, limit = 120) => {
  if (value.length <= limit) return value;
  return `${value.slice(0, limit)}…`;
};

