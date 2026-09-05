import { TextField, FileUploadField } from "../../components/FormFields";

export default function StepTechnical({ form, update }) {
  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold text-navy-900">
        Technical Capability
      </h2>
      <TextField
        label="Technical Infrastructure"
        value={form.technicalInfrastructure}
        onChange={(v) => update("technicalInfrastructure", v)}
        placeholder="e.g. Facilities, plant capacity"
      />
      <TextField
        label="Equipment"
        value={form.equipment}
        onChange={(v) => update("equipment", v)}
      />
      <TextField
        label="Manpower"
        value={form.manpower}
        onChange={(v) => update("manpower", v)}
        placeholder="e.g. Number of technical staff"
      />
      <TextField
        label="Technical Capacity"
        value={form.technicalCapacity}
        onChange={(v) => update("technicalCapacity", v)}
        placeholder="e.g. 1200 units/day"
      />
      <FileUploadField
        label="Technical Capability Documents"
        fileName={form.technicalDocFile}
        onChange={(v) => update("technicalDocFile", v)}
      />
    </div>
  );
}