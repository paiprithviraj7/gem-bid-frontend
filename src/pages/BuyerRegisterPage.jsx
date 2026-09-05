import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Upload, CheckCircle2 } from "lucide-react";
import Button from "../components/Button";
import { registerBuyer } from "../services/api";
import { setCurrentUser } from "../utils/auth";

const ORG_TYPES = [
  "Central Government Ministry",
  "State Government Department",
  "Public Sector Undertaking (PSU)",
  "Autonomous Body",
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

export default function BuyerRegisterPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    // A. Organization Registration
    organizationName: "",
    organizationType: ORG_TYPES[0],
    registrationNumber: "",
    registeredAddress: "",
    state: "",
    city: "",
    officialWebsite: "",
    registrationProofFile: "",
    // B. Organization Authorization
    authorizationDocFile: "",
    // C. Official Details
    department: "",
    officialContact: "",
    officialEmail: "",
    // D. Authorized Signatory
    signatoryName: "",
    signatoryDesignation: "",
    signatoryEmail: "",
    signatoryPhone: "",
    signatoryDocFile: "",
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
      const { user } = await registerBuyer(form);
      setCurrentUser(user);
      navigate("/buyer/dashboard");
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
          Buyer Registration
        </h1>
        <p className="mt-1 text-sm text-ink-600">
          Register your organization to create and publish tenders.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-8">
          {/* A. Organization Registration */}
          <section className="bg-surface-card border border-border rounded-card p-6 space-y-4">
            <h2 className="text-sm font-semibold text-navy-900">
              Organization Registration
            </h2>
            <TextField
              label="Organization Name"
              value={form.organizationName}
              onChange={(v) => update("organizationName", v)}
            />
            <div>
              <label className="block text-xs font-medium text-ink-600 mb-1">
                Organization Type
              </label>
              <select
                value={form.organizationType}
                onChange={(e) => update("organizationType", e.target.value)}
                className="w-full border border-border rounded-badge px-3 py-2 text-sm text-ink-900 focus:outline-none focus:border-navy-900"
              >
                {ORG_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <TextField
              label="Registration Number"
              value={form.registrationNumber}
              onChange={(v) => update("registrationNumber", v)}
            />
            <TextField
              label="Registered Address"
              value={form.registeredAddress}
              onChange={(v) => update("registeredAddress", v)}
            />
            <div className="grid grid-cols-2 gap-4">
              <TextField
                label="State"
                value={form.state}
                onChange={(v) => update("state", v)}
              />
              <TextField
                label="City"
                value={form.city}
                onChange={(v) => update("city", v)}
              />
            </div>
            <TextField
              label="Official Website"
              value={form.officialWebsite}
              onChange={(v) => update("officialWebsite", v)}
              required={false}
            />
            <FileUploadField
              label="Organization Registration / Establishment Proof"
              fileName={form.registrationProofFile}
              onChange={(v) => update("registrationProofFile", v)}
            />
          </section>

          {/* B. Organization Authorization */}
          <section className="bg-surface-card border border-border rounded-card p-6 space-y-4">
            <h2 className="text-sm font-semibold text-navy-900">
              Organization Authorization
            </h2>
            <FileUploadField
              label="Organization Authorization Document"
              fileName={form.authorizationDocFile}
              onChange={(v) => update("authorizationDocFile", v)}
            />
          </section>

          {/* C. Official Details */}
          <section className="bg-surface-card border border-border rounded-card p-6 space-y-4">
            <h2 className="text-sm font-semibold text-navy-900">
              Official Organization Details
            </h2>
            <TextField
              label="Department"
              value={form.department}
              onChange={(v) => update("department", v)}
            />
            <TextField
              label="Official Contact Number"
              value={form.officialContact}
              onChange={(v) => update("officialContact", v)}
            />
            <TextField
              label="Official Email"
              type="email"
              value={form.officialEmail}
              onChange={(v) => update("officialEmail", v)}
            />
          </section>

          {/* D. Authorized Signatory */}
          <section className="bg-surface-card border border-border rounded-card p-6 space-y-4">
            <h2 className="text-sm font-semibold text-navy-900">
              Authorized Signatory Details
            </h2>
            <TextField
              label="Authorized Signatory Name"
              value={form.signatoryName}
              onChange={(v) => update("signatoryName", v)}
            />
            <TextField
              label="Designation"
              value={form.signatoryDesignation}
              onChange={(v) => update("signatoryDesignation", v)}
            />
            <TextField
              label="Official Email"
              type="email"
              value={form.signatoryEmail}
              onChange={(v) => update("signatoryEmail", v)}
            />
            <TextField
              label="Official Phone"
              value={form.signatoryPhone}
              onChange={(v) => update("signatoryPhone", v)}
            />
            <FileUploadField
              label="Authorized Signatory Authorization Document"
              fileName={form.signatoryDocFile}
              onChange={(v) => update("signatoryDocFile", v)}
            />
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