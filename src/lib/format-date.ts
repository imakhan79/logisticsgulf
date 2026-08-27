// Fixed locale + timeZone so server-rendered and client-hydrated output always match,
// regardless of the executing machine's locale/timezone (avoids React hydration error #418).
export function formatDate(value: string | Date) {
  return new Date(value).toLocaleDateString("en-GB", { timeZone: "UTC" });
}

export function formatDateTime(value: string | Date) {
  return new Date(value).toLocaleString("en-GB", { timeZone: "UTC" });
}
