import { TextField, SelectField, FileUploadField } from "../../components/FormFields";

const COMPANY_TYPES = [
  "Private Limited",
  "Public Limited",
  "Partnership",
  "Sole Proprietorship",
  "LLP",
];

export default function StepCompany({ form, update }) {
  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold text-navy-900">
        Company Registration / Legal Identity
      </h2>
      <TextField
        label="Company Name"
        value={form.companyName}
        onChange={(v) => update("companyName", v)}
      />
      <SelectField
        label="Company Type"
        value={form.companyType}
        onChange={(v) => update("companyType", v)}
        options={COMPANY_TYPES}
      />
      <TextField
        label="Company Registration Number"
        value={form.companyRegNumber}
        onChange={(v) => update("companyRegNumber", v)}
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
        label="Date of Incorporation"
        type="date"
        value={form.incorporationDate}
        onChange={(v) => update("incorporationDate", v)}
      />
      <FileUploadField
        label="Company Registration Certificate"
        fileName={form.companyRegCertFile}
        onChange={(v) => update("companyRegCertFile", v)}
      />
    </div>
  );
}