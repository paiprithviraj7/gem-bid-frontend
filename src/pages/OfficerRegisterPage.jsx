import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Upload, CheckCircle2, Check } from "lucide-react";
import Button from "../components/Button";
import { registerOfficer } from "../services/api";
import { setCurrentUser } from "../utils/auth";

const PERMISSIONS = [
  "View Tender",
  "View Bids",
  "Review Compliance",
  "View Risk Reports",
  "Evaluate Bid",
  "Make Recommendation",
];

function FileUploadField({ label, fileName, onChange }) {
  return (
    <div>
      <label className="block text-xs font-medium text-ink-600 mb-1">
        {label}
      </label>
      <label className="flex items-center gap-2 border border-dashed border-border rounded-badge px-3 py-2.5 text-sm text-ink-600 cursor-pointer hover:border-navy-900">
        {fileName ? (
          <>
            <CheckCircle2 className="w-4 h-4 text-status-green shrink-0" />
            <span className="text-ink-900">{fileName}</span>
          </>
        ) : (
          <>
            <Upload className="w-4 h-4 shrink-0" />
            <span>Choose PDF file</span>
          </>
        )}
        <input
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => onChange(e.target.files[0]?.name ?? "")}
        />
      </label>
    </div>
  );
}

function TextField({ label, value, onChange, type = "text", required = true }) {
  return (
    <div>
      <label className="block text-xs font-medium text-ink-600 mb-1">
        {label}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-border rounded-badge px-3 py-2 text-sm text-ink-900 focus:outline-none focus:border-navy-900"
      />
    </div>
  );
}

export default function OfficerRegisterPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    // A. Officer Identity
    fullName: "",
    employeeId: "",
    designation: "",
    department: "",
    officialEmail: "",
    officialPhone: "",
    // B. Organization Association
    organization: "",
    employeeNumber: "",
    // C. Authorization Proof
    authorizationDocFile: "",
    // Login credential
    password: "",
  });

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { user } = await registerOfficer(form);
      setCurrentUser(user);
      navigate("/officer/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-border bg-white">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-navy-900" />
          <span className="text-sm font-semibold text-navy-900">
            GeM Bid Compliance Verification Platform
          </span>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-xl font-semibold text-ink-900">
          Procurement Officer Registration
        </h1>
        <p className="mt-1 text-sm text-ink-600">
          Register to verify, evaluate and decide on submitted bids.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-8">
          {/* A. Officer Identity */}
          <section className="bg-surface-card border border-border rounded-card p-6 space-y-4">
            <h2 className="text-sm font-semibold text-navy-900">
              Official Employee / Officer Identity
            </h2>
            <TextField
              label="Full Name"
              value={form.fullName}
              onChange={(v) => update("fullName", v)}
            />
            <TextField
              label="Employee ID"
              value={form.employeeId}
              onChange={(v) => update("employeeId", v)}
            />
            <TextField
              label="Designation"
              value={form.designation}
              onChange={(v) => update("designation", v)}
            />
            <TextField
              label="Department"
              value={form.department}
              onChange={(v) => update("department", v)}
            />
            <TextField
              label="Official Email"
              type="email"
              value={form.officialEmail}
              onChange={(v) => update("officialEmail", v)}
            />
            <TextField
              label="Official Phone"
              value={form.officialPhone}
              onChange={(v) => update("officialPhone", v)}
            />
          </section>

          {/* B. Organization Association */}
          <section className="bg-surface-card border border-border rounded-card p-6 space-y-4">
            <h2 className="text-sm font-semibold text-navy-900">
              Organization Association
            </h2>
            <TextField
              label="Organization"
              value={form.organization}
              onChange={(v) => update("organization", v)}
            />
            <TextField
              label="Employee Number"
              value={form.employeeNumber}
              onChange={(v) => update("employeeNumber", v)}
            />
          </section>

          {/* C. Authorization Proof */}
          <section className="bg-surface-card border border-border rounded-card p-6 space-y-4">
            <h2 className="text-sm font-semibold text-navy-900">
              Authorization / Role Proof
            </h2>
            <FileUploadField
              label="Officer Authorization / Role Proof"
              fileName={form.authorizationDocFile}
              onChange={(v) => update("authorizationDocFile", v)}
            />
          </section>

          {/* D. Permissions (read-only, predefined) */}
          <section className="bg-surface-card border border-border rounded-card p-6">
            <h2 className="text-sm font-semibold text-navy-900 mb-4">
              Role / Permissions
            </h2>
            <div className="space-y-2">
              {PERMISSIONS.map((perm) => (
                <div key={perm} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-status-green shrink-0" />
                  <span className="text-sm text-ink-900">{perm}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Login credential for the demo */}
          <section className="bg-surface-card border border-border rounded-card p-6 space-y-4">
            <h2 className="text-sm font-semibold text-navy-900">
              Set a Password
            </h2>
            <TextField
              label="Password"
              type="password"
              value={form.password}
              onChange={(v) => update("password", v)}
            />
          </section>

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
            {loading ? "Submitting..." : "Complete Registration"}
          </Button>
        </form>
      </div>
    </div>
  );
}