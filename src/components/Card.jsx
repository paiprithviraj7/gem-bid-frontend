// Consistent card container used across dashboards, forms, and detail views.
// title/action are optional — pass only what you need.
// `interactive` adds a hover lift for cards that are clickable (leave false
// for static content cards like report sections).
export default function Card({
  title,
  action,
  children,
  className = "",
  interactive = false,
}) {
  return (
    <div
      className={`bg-surface-card border border-border rounded-card shadow-card p-6 transition-all duration-200 ease-out ${
        interactive
          ? "hover:shadow-elevated hover:-translate-y-0.5 cursor-pointer"
          : ""
      } ${className}`}
    >
      {(title || action) && (
        <div className="flex items-center justify-between mb-4">
          {title && (
            <h3 className="text-sm font-semibold text-ink-900">{title}</h3>
          )}
          {action}
        </div>
      )}
      {children}
    </div>
  );
}