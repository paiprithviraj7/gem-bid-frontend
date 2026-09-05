import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import Button from "../components/Button";
import { loginRequest } from "../services/api";
import { setCurrentUser } from "../utils/auth";

const ROLES = [
  { value: "bidder", label: "Bidder" },
  { value: "buyer", label: "Buyer" },
  { value: "officer", label: "Procurement Officer" },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("bidder");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await loginRequest({ email, password, role });
      setCurrentUser(user);
      navigate(`/${user.role}/dashboard`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

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
        <div className="max-w-sm w-full bg-surface-card border border-border rounded-card p-8">
          <h1 className="text-lg font-semibold text-ink-900 text-center">
            Login
          </h1>
          <p className="mt-1 text-sm text-ink-600 text-center">
            Access your dashboard
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-medium text-ink-600 mb-1">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border border-border rounded-badge px-3 py-2 text-sm text-ink-900 focus:outline-none focus:border-navy-900"
              >
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-ink-600 mb-1">
                Email / User ID
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-border rounded-badge px-3 py-2 text-sm text-ink-900 focus:outline-none focus:border-navy-900"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-ink-600 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-border rounded-badge px-3 py-2 text-sm text-ink-900 focus:outline-none focus:border-navy-900"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-sm text-status-red bg-status-red-bg px-3 py-2 rounded-badge">
                {error}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}