import { useNavigate } from "react-router-dom";
import { ShieldCheck, Building2, Gavel, ClipboardCheck } from "lucide-react";
import Button from "../components/Button";

const ROLE_CARDS = [
  {
    role: "bidder",
    icon: Building2,
    title: "Bidder",
    description: "Participate in government tenders",
  },
  {
    role: "buyer",
    icon: Gavel,
    title: "Buyer",
    description: "Create and publish tenders",
  },
  {
    role: "officer",
    icon: ClipboardCheck,
    title: "Procurement Officer",
    description: "Verify and evaluate bids",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface">
      {/* Public header — separate from the dashboard Navbar */}
      <header className="border-b border-border bg-white">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-navy-900" />
            <span className="text-sm font-semibold text-navy-900">
              GeM Bid Compliance Verification Platform
            </span>
          </div>
          <nav className="flex items-center gap-6 text-sm font-medium text-ink-600">
            <a href="#about" className="hover:text-navy-900">
              About
            </a>
            <a href="#help" className="hover:text-navy-900">
              Help
            </a>
            <button
              onClick={() => navigate("/login")}
              className="hover:text-navy-900"
            >
              Login
            </button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl font-semibold text-ink-900 leading-tight max-w-3xl mx-auto">
          AI-Powered Integrated Bid Compliance Verification
        </h1>
        <p className="mt-4 text-base text-ink-600 max-w-xl mx-auto">
          Simplifying tender compliance, verification and evaluation.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Button variant="primary" onClick={() => navigate("/register")}>
            Register
          </Button>
          <Button variant="secondary" onClick={() => navigate("/login")}>
            Login
          </Button>
        </div>
      </section>

      {/* Role cards */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {ROLE_CARDS.map(({ role, icon: Icon, title, description }) => (
            <div
              key={role}
              className="bg-surface-card border border-border rounded-card p-6 text-center"
            >
              <div className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-navy-100 mb-4">
                <Icon className="w-5 h-5 text-navy-800" />
              </div>
              <h3 className="text-sm font-semibold text-ink-900">{title}</h3>
              <p className="mt-1 text-sm text-ink-600">{description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}