// Compares a tender's required documents against a bidder's existing
// profile to produce a checklist. This is the core logic behind
// section 28 (Automatic Compliance Checklist) and section 29
// (Upload Only Missing Documents).
//
// `tender` — the tender object (has requireGST, requirePAN, etc. booleans)
// `bidder` — the bidder profile object (has gstCertFile, panDocFile, etc.)
// `uploadedExtras` — optional object of documents the bidder has uploaded
//   specifically for this tender (e.g. { iso: "filename.pdf" }), used once
//   we build the "upload missing documents" step.
export function buildComplianceChecklist(tender, bidder, uploadedExtras = {}) {
  const REQUIREMENT_MAP = [
    {
      key: "requireCompanyRegistration",
      label: "Company Registration",
      bidderField: "companyRegCertFile",
      extraKey: "companyRegistration",
    },
    {
      key: "requireGST",
      label: "GST Certificate",
      bidderField: "gstCertFile",
      extraKey: "gst",
    },
    {
      key: "requirePAN",
      label: "PAN",
      bidderField: "panDocFile",
      extraKey: "pan",
    },
    {
      key: "requireExperience",
      label: "Experience Certificate",
      bidderField: "experienceCertFile",
      extraKey: "experience",
    },
    {
      key: "requireFinancial",
      label: "Audited Financial Statement",
      bidderField: "financialStatementFile",
      extraKey: "financial",
    },
    {
      key: "requireTechnical",
      label: "Technical Capability",
      bidderField: "technicalDocFile",
      extraKey: "technical",
    },
    {
      key: "requireISO",
      label: "ISO Certificate",
      bidderField: "isoFile",
      extraKey: "iso",
      // ISO is only actually "on file" if the bidder marked it applicable.
      onlyIfApplicable: "isoApplicable",
    },
    {
      key: "requireBIS",
      label: "BIS Certificate",
      bidderField: "bisFile",
      extraKey: "bis",
      onlyIfApplicable: "bisApplicable",
    },
  ];

  const items = REQUIREMENT_MAP.filter((req) => tender[req.key]).map((req) => {
    const hasProfileDoc = req.onlyIfApplicable
      ? bidder[req.onlyIfApplicable] === "Yes" && !!bidder[req.bidderField]
      : !!bidder[req.bidderField];

    const hasUploadedExtra = !!uploadedExtras[req.extraKey];
    const available = hasProfileDoc || hasUploadedExtra;

    return {
      key: req.key,
      label: req.label,
      extraKey: req.extraKey,
      available,
      source: hasUploadedExtra ? "uploaded" : hasProfileDoc ? "profile" : null,
    };
  });

  const available = items.filter((i) => i.available).length;
  const missing = items.length - available;

  return { items, total: items.length, available, missing };
}