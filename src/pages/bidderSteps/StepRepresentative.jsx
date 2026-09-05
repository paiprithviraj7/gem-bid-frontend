import { TextField, FileUploadField } from "../../components/FormFields";

export default function StepRepresentative({ form, update }) {
  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold text-navy-900">
        Organization Profile / Authorized Representative
      </h2>
      <TextField
        label="Authorized Representative Name"
        value={form.representativeName}
        onChange={(v) => update("representativeName", v)}
      />
      <TextField
        label="Designation"
        value={form.representativeDesignation}
        onChange={(v) => update("representativeDesignation", v)}
      />
      <TextField
        label="Official Email"
        type="email"
        value={form.representativeEmail}
        onChange={(v) => update("representativeEmail", v)}
      />
      <TextField
        label="Official Phone"
        value={form.representativePhone}
        onChange={(v) => update("representativePhone", v)}
      />
      <FileUploadField
        label="Authorization / Authorized Representative Document"
        fileName={form.representativeDocFile}
        onChange={(v) => update("representativeDocFile", v)}
      />

      <div className="pt-4 border-t border-border">
        <TextField
          label="Set a Password"
          type="password"
          value={form.password}
          onChange={(v) => update("password", v)}
        />
      </div>
    </div>
  );
}