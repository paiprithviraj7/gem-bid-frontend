// Reusable button with a small set of intentional variants.
// variant: "primary" (navy fill), "secondary" (outlined), "ghost" (text only)
export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-badge transition-all duration-150 ease-out disabled:opacity-50 disabled:cursor-not-allowed active:translate-y-0";

  const variants = {
    primary:
      "bg-navy-900 text-white shadow-card hover:bg-navy-800 hover:shadow-elevated hover:-translate-y-px",
    secondary:
      "bg-white text-navy-900 border border-border-strong hover:bg-navy-100 hover:border-navy-900 hover:-translate-y-px",
    ghost: "text-navy-900 hover:bg-navy-100",
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}