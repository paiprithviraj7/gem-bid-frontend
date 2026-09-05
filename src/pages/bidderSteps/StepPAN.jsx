import { TextField, FileUploadField } from "../../components/FormFields";

export default function StepPAN({ form, update }) {
  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold text-navy-900">PAN Details</h2>
      <TextField
        label="PAN Number"
        value={form.panNumber}
        onChange={(v) => update("panNumber", v)}
        placeholder="e.g. ABCDE1234F"
      />
      <TextField
        label="PAN Holder / Company Name"
        value={form.panHolderName}
        onChange={(v) => update("panHolderName", v)}
      />
      <FileUploadField
        label="PAN Document"
        fileName={form.panDocFile}
        onChange={(v) => update("panDocFile", v)}
      />
    </div>
  );
}