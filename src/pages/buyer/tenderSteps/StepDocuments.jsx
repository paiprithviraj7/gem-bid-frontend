const DOCUMENT_OPTIONS = [
  { key: "requireCompanyRegistration", label: "Company Registration" },
  { key: "requireGST", label: "GST" },
  { key: "requirePAN", label: "PAN" },
  { key: "requireExperience", label: "Experience Certificate" },
  { key: "requireFinancial", label: "Audited Financial Statement" },
  { key: "requireTechnical", label: "Technical Capability" },
  { key: "requireISO", label: "ISO" },
  { key: "requireBIS", label: "BIS" },
];

export default function StepDocuments({ form, update }) {
  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold text-navy-900">
        Required Documents
      </h2>
      <p className="text-sm text-ink-600 -mt-2">
        Select which documents bidders must provide to be eligible for this
        tender.
      </p>

      <div className="space-y-2">
        {DOCUMENT_OPTIONS.map(({ key, label }) => (
          <label
            key={key}
            className="flex items-center gap-3 border border-border rounded-badge px-4 py-3 cursor-pointer hover:border-navy-900"
          >
            <input
              type="checkbox"
              checked={form[key]}
              onChange={(e) => update(key, e.target.checked)}
              className="w-4 h-4 accent-navy-900"
            />
            <span className="text-sm text-ink-900">{label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}