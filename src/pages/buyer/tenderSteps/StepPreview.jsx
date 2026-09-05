function PreviewRow({ label, value }) {
  return (
    <div className="flex justify-between py-1.5 text-sm">
      <span className="text-ink-600">{label}</span>
      <span className="text-ink-900 font-medium text-right">
        {value || "—"}
      </span>
    </div>
  );
}

const DOCUMENT_LABELS = {
  requireCompanyRegistration: "Company Registration",
  requireGST: "GST",
  requirePAN: "PAN",
  requireExperience: "Experience Certificate",
  requireFinancial: "Audited Financial Statement",
  requireTechnical: "Technical Capability",
  requireISO: "ISO",
  requireBIS: "BIS",
};

export default function StepPreview({ form }) {
  const selectedDocs = Object.entries(DOCUMENT_LABELS).filter(
    ([key]) => form[key]
  );

  return (
    <div>
      <h2 className="text-sm font-semibold text-navy-900 mb-4">
        Tender Preview
      </h2>
      <p className="text-sm text-ink-600 mb-6">
        Review the tender before publishing. Bidders will see this
        information once published.
      </p>

      <div className="space-y-4">
        <div className="pb-4 border-b border-border">
          <h3 className="text-xs font-semibold text-navy-900 uppercase tracking-wide mb-2">
            Tender Information
          </h3>
          <PreviewRow label="Tender ID" value={form.tenderId} />
          <PreviewRow label="Title" value={form.title} />
          <PreviewRow label="Description" value={form.description} />
          <PreviewRow label="Category" value={form.category} />
          <PreviewRow
            label="Estimated Value"
            value={form.estimatedValue ? `₹${form.estimatedValue}` : ""}
          />
          <PreviewRow label="Submission Deadline" value={form.deadline} />
        </div>

        <div className="pb-4 border-b border-border">
          <h3 className="text-xs font-semibold text-navy-900 uppercase tracking-wide mb-2">
            Eligibility
          </h3>
          <PreviewRow
            label="Minimum Experience"
            value={form.minExperience ? `${form.minExperience} years` : ""}
          />
          <PreviewRow
            label="Minimum Turnover"
            value={form.minTurnover ? `₹${form.minTurnover}` : ""}
          />
          <PreviewRow
            label="Minimum Technical Capacity"
            value={form.minTechnicalCapacity}
          />
        </div>

        <div>
          <h3 className="text-xs font-semibold text-navy-900 uppercase tracking-wide mb-2">
            Required Documents ({selectedDocs.length})
          </h3>
          {selectedDocs.length === 0 ? (
            <p className="text-sm text-ink-600">No documents selected.</p>
          ) : (
            <ul className="text-sm text-ink-900 space-y-1">
              {selectedDocs.map(([key, label]) => (
                <li key={key}>• {label}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}