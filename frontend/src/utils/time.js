// Small helper for formatting HH:MM (24h) -> 12-hour with AM/PM
export function format12HourTime(military) {
  if (!military || typeof military !== 'string') return '';
  const parts = military.split(':');
  if (parts.length < 2) return military; // unexpected format, return as-is
  const [h, min] = parts;
  const hour = parseInt(h, 10);
  if (Number.isNaN(hour)) return military;
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour}:${min} ${suffix}`;
}

export default format12HourTime;
