export function formatPrice(value: number, currency: "EUR" | "USD" = "EUR") {
  const symbol = currency === "EUR" ? "€" : "$";
  return `${symbol}${value}`;
}
