export const formatCurrency = (value: number | null | undefined, currency = 'EUR') => {
  if (value === null || value === undefined) {
    return 'Цена не указана';
  }
  try {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${value.toFixed(2)} ${currency}`;
  }
};

export const truncate = (value: string, limit = 120) => {
  if (value.length <= limit) return value;
  return `${value.slice(0, limit)}…`;
};

