import { TextField, FileUploadField } from "../../components/FormFields";

export default function StepExperience({ form, update }) {
  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold text-navy-900">
        Experience Certificates
      </h2>
      <TextField
        label="Years of Experience"
        type="number"
        value={form.yearsExperience}
        onChange={(v) => update("yearsExperience", v)}
      />
      <TextField
        label="Previous Government Projects"
        value={form.previousGovtProjects}
        onChange={(v) => update("previousGovtProjects", v)}
        placeholder="e.g. Names or count of past government contracts"
      />
      <TextField
        label="Major Completed Projects"
        value={form.majorCompletedProjects}
        onChange={(v) => update("majorCompletedProjects", v)}
        placeholder="Brief description of major completed work"
      />
      <FileUploadField
        label="Experience Certificates"
        fileName={form.experienceCertFile}
        onChange={(v) => update("experienceCertFile", v)}
      />
    </div>
  );
}