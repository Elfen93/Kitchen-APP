// Weekly spending log. Weeks start on Monday (local time).

export function weekStart(date = new Date()) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = (d.getDay() + 6) % 7; // Mon=0
  d.setDate(d.getDate() - day);
  return d;
}

export function weekKey(date = new Date()) {
  const d = weekStart(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function spentThisWeek(log, date = new Date()) {
  const k = weekKey(date);
  return log.filter((e) => e.week === k).reduce((s, e) => s + e.amount, 0);
}

export function addSpend(log, amount, note = '', date = new Date()) {
  const a = Math.round(Number(amount));
  if (!a || a < 0) return log;
  // keep ~12 weeks of history
  const entry = { id: `${date.getTime()}`, week: weekKey(date), amount: a, note: note.slice(0, 60), at: date.toISOString() };
  // week keys are YYYY-MM-DD, so string comparison is chronological
  const oldest = weekKey(new Date(Date.now() - 12 * 7 * 864e5));
  return [entry, ...log].filter((e) => e.week >= oldest || e === entry);
}

export function daysLeftInWeek(date = new Date()) {
  return 7 - ((date.getDay() + 6) % 7);
}
