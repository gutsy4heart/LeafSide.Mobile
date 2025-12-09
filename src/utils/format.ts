export const formatCurrency = (value: number | null | undefined, currency = 'RUB') => {
  if (value === null || value === undefined) {
    return 'Цена не указана';
  }
  try {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${value.toFixed(0)} ${currency}`;
  }
};

export const truncate = (value: string, limit = 120) => {
  if (value.length <= limit) return value;
  return `${value.slice(0, limit)}…`;
};

