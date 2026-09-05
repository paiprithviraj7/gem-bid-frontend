import { YesNoField, FileUploadField } from "../../components/FormFields";

export default function StepCertifications({ form, update }) {
  return (
    <div className="space-y-6">
      <h2 className="text-sm font-semibold text-navy-900">Certifications</h2>
      <p className="text-sm text-ink-600 -mt-2">
        Some certifications are not mandatory for every bidder. Only mark
        "Yes" if applicable to your company.
      </p>

      <div className="space-y-3 pb-4 border-b border-border">
        <YesNoField
          label="Is ISO Certification applicable?"
          value={form.isoApplicable}
          onChange={(v) => update("isoApplicable", v)}
        />
        {form.isoApplicable === "Yes" && (
          <FileUploadField
            label="ISO Certificate"
            fileName={form.isoFile}
            onChange={(v) => update("isoFile", v)}
          />
        )}
      </div>

      <div className="space-y-3 pb-4 border-b border-border">
        <YesNoField
          label="Is BIS Certification applicable?"
          value={form.bisApplicable}
          onChange={(v) => update("bisApplicable", v)}
        />
        {form.bisApplicable === "Yes" && (
          <FileUploadField
            label="BIS Certificate"
            fileName={form.bisFile}
            onChange={(v) => update("bisFile", v)}
          />
        )}
      </div>

      <div className="space-y-3">
        <YesNoField
          label="Any other relevant certification applicable?"
          value={form.otherCertApplicable}
          onChange={(v) => update("otherCertApplicable", v)}
        />
        {form.otherCertApplicable === "Yes" && (
          <FileUploadField
            label="Other Certification Document"
            fileName={form.otherCertFile}
            onChange={(v) => update("otherCertFile", v)}
          />
        )}
      </div>
    </div>
  );
}