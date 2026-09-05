import { TextField } from "../../../components/FormFields";

export default function StepEligibility({ form, update }) {
  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold text-navy-900">
        Eligibility Requirements
      </h2>
      <TextField
        label="Minimum Years of Experience"
        type="number"
        value={form.minExperience}
        onChange={(v) => update("minExperience", v)}
        placeholder="e.g. 5"
      />
      <TextField
        label="Minimum Turnover (₹)"
        type="number"
        value={form.minTurnover}
        onChange={(v) => update("minTurnover", v)}
        placeholder="e.g. 100000000 for ₹10 Cr"
      />
      <TextField
        label="Minimum Technical Capacity"
        value={form.minTechnicalCapacity}
        onChange={(v) => update("minTechnicalCapacity", v)}
        placeholder="e.g. 1000 units/day"
      />
    </div>
  );
}