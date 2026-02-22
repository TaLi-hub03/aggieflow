// Utility to normalize Date -> YYYY-MM-DD
export function formatDate(d) {
  if (!d) return "";
  const dd = new Date(d);
  return dd.toISOString().split("T")[0];
}

export default formatDate;
