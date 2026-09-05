// Consistent card container used across dashboards, forms, and detail views.
// title/action are optional — pass only what you need.
export default function Card({ title, action, children, className = "" }) {
  return (
    <div
      className={`bg-surface-card border border-border rounded-card p-6 ${className}`}
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