// Solid-fill status badge. `status` controls color; keep the label text
// short (e.g. "Verified", "Missing", "LOW", "Expiring Soon").
const STATUS_STYLES = {
  green: "bg-status-green-bg text-status-green",
  amber: "bg-status-amber-bg text-status-amber",
  red: "bg-status-red-bg text-status-red",
  neutral: "bg-navy-100 text-navy-800",
};

export default function StatusBadge({ status = "neutral", children }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-badge text-xs font-semibold tracking-wide ${STATUS_STYLES[status]}`}
    >
      {children}
    </span>
  );
}