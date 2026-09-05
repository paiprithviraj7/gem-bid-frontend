import { TextField, SelectField, FileUploadField } from "../../components/FormFields";

const GST_STATUSES = ["Active", "Cancelled", "Suspended"];

export default function StepGST({ form, update }) {
  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold text-navy-900">GST Details</h2>
      <TextField
        label="GSTIN"
        value={form.gstin}
        onChange={(v) => update("gstin", v)}
        placeholder="e.g. 27ABCDE1234F1Z5"
      />
      <TextField
        label="Legal Business Name"
        value={form.legalBusinessName}
        onChange={(v) => update("legalBusinessName", v)}
      />
      <TextField
        label="GST Registration Date"
        type="date"
        value={form.gstRegDate}
        onChange={(v) => update("gstRegDate", v)}
      />
      <SelectField
        label="GST Status"
        value={form.gstStatus}
        onChange={(v) => update("gstStatus", v)}
        options={GST_STATUSES}
      />
      <FileUploadField
        label="GST Certificate"
        fileName={form.gstCertFile}
        onChange={(v) => update("gstCertFile", v)}
      />
    </div>
  );
}