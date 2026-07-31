export const WEEKDAY_LABELS = ["日", "月", "火", "水", "木", "金", "土"];

export function toDateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function parseDateKey(dateKey: string): { year: number; month: number; day: number } {
  const [year, month, day] = dateKey.split("-").map(Number);
  return { year, month, day };
}

export function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export function weekdayLabel(year: number, month: number, day: number): string {
  return WEEKDAY_LABELS[new Date(year, month - 1, day).getDay()];
}

export function todayDateKey(): string {
  const now = new Date();
  return toDateKey(now.getFullYear(), now.getMonth() + 1, now.getDate());
}

export function startOfMonthDateKey(): string {
  const now = new Date();
  return toDateKey(now.getFullYear(), now.getMonth() + 1, 1);
}

export function formatDateJa(dateKey: string): string {
  const { year, month, day } = parseDateKey(dateKey);
  return `${year}年${month}月${day}日`;
}
