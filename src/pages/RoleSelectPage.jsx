import { useNavigate } from "react-router-dom";
import { Building2, Gavel, ClipboardCheck, ShieldCheck } from "lucide-react";

const ROLES = [
  {
    role: "bidder",
    icon: Building2,
    title: "Bidder",
    description: "Register your company to participate in government tenders.",
  },
  {
    role: "buyer",
    icon: Gavel,
    title: "Buyer",
    description: "Register your organization to create and publish tenders.",
  },
  {
    role: "officer",
    icon: ClipboardCheck,
    title: "Procurement Officer",
    description: "Register to verify, evaluate and decide on submitted bids.",
  },
];

export default function RoleSelectPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <header className="border-b border-border bg-white">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-navy-900" />
          <span className="text-sm font-semibold text-navy-900">
            GeM Bid Compliance Verification Platform
          </span>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-3xl w-full">
          <h1 className="text-2xl font-semibold text-ink-900 text-center">
            Select Your Role
          </h1>
          <p className="mt-2 text-sm text-ink-600 text-center">
            Choose how you'll be using the platform. You'll register the
            details for this role next.
          </p>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
            {ROLES.map(({ role, icon: Icon, title, description }) => (
              <button
                key={role}
                onClick={() => navigate(`/register/${role}`)}
                className="bg-surface-card border border-border rounded-card p-6 text-left hover:border-navy-900 transition-colors"
              >
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-navy-100 mb-4">
                  <Icon className="w-5 h-5 text-navy-800" />
                </div>
                <h3 className="text-sm font-semibold text-ink-900">{title}</h3>
                <p className="mt-1 text-sm text-ink-600">{description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}