// Reusable button with a small set of intentional variants.
// variant: "primary" (navy fill), "secondary" (outlined), "ghost" (text only)
export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-badge transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-navy-900 text-white hover:bg-navy-800",
    secondary:
      "bg-white text-navy-900 border border-navy-900 hover:bg-navy-100",
    ghost: "text-navy-900 hover:bg-navy-100",
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}