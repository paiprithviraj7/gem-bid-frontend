function ReviewRow({ label, value }) {
  return (
    <div className="flex justify-between py-1.5 text-sm">
      <span className="text-ink-600">{label}</span>
      <span className="text-ink-900 font-medium text-right">
        {value || "—"}
      </span>
    </div>
  );
}

function ReviewSection({ title, children }) {
  return (
    <div className="pb-4 mb-4 border-b border-border last:border-b-0 last:mb-0 last:pb-0">
      <h3 className="text-xs font-semibold text-navy-900 uppercase tracking-wide mb-2">
        {title}
      </h3>
      {children}
    </div>
  );
}

export default function StepReview({ form }) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-navy-900 mb-4">
        Review & Submit
      </h2>
      <p className="text-sm text-ink-600 mb-6">
        Please review your details before submitting. You can go back to any
        step to make changes.
      </p>

      <ReviewSection title="Company Identity">
        <ReviewRow label="Company Name" value={form.companyName} />
        <ReviewRow label="Company Type" value={form.companyType} />
        <ReviewRow label="Registration Number" value={form.companyRegNumber} />
        <ReviewRow label="Address" value={form.registeredAddress} />
        <ReviewRow label="State / City" value={`${form.state} / ${form.city}`} />
        <ReviewRow label="Date of Incorporation" value={form.incorporationDate} />
      </ReviewSection>

      <ReviewSection title="GST">
        <ReviewRow label="GSTIN" value={form.gstin} />
        <ReviewRow label="Legal Business Name" value={form.legalBusinessName} />
        <ReviewRow label="GST Status" value={form.gstStatus} />
      </ReviewSection>

      <ReviewSection title="PAN">
        <ReviewRow label="PAN Number" value={form.panNumber} />
        <ReviewRow label="PAN Holder Name" value={form.panHolderName} />
      </ReviewSection>

      <ReviewSection title="Experience">
        <ReviewRow label="Years of Experience" value={form.yearsExperience} />
        <ReviewRow label="Previous Govt Projects" value={form.previousGovtProjects} />
      </ReviewSection>

      <ReviewSection title="Financial">
        <ReviewRow label="Annual Turnover" value={form.annualTurnover} />
        <ReviewRow label="Net Worth" value={form.netWorth} />
        <ReviewRow label="Financial Year" value={form.financialYear} />
      </ReviewSection>

      <ReviewSection title="Technical Capability">
        <ReviewRow label="Technical Capacity" value={form.technicalCapacity} />
        <ReviewRow label="Manpower" value={form.manpower} />
      </ReviewSection>

      <ReviewSection title="Certifications">
        <ReviewRow label="ISO Applicable" value={form.isoApplicable} />
        <ReviewRow label="BIS Applicable" value={form.bisApplicable} />
      </ReviewSection>

      <ReviewSection title="Authorized Representative">
        <ReviewRow label="Name" value={form.representativeName} />
        <ReviewRow label="Designation" value={form.representativeDesignation} />
        <ReviewRow label="Email" value={form.representativeEmail} />
      </ReviewSection>
    </div>
  );
}