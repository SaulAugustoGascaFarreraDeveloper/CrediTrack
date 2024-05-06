const CURRENCY_FORMATTER = new Intl.NumberFormat("es-MX", {
    currency: "MXN",
    style: "currency",
    minimumFractionDigits: 2,
  });
  
  export function formatCurrency(amount: number) {
    return CURRENCY_FORMATTER.format(amount);
  }
  
  const NUMBER_FORMATTER = new Intl.NumberFormat("es-MX");
  
  export function formatNumber(number: number) {
    return NUMBER_FORMATTER.format(number);
  }
  