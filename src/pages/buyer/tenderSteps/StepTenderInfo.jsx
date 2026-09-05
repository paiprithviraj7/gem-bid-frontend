import { TextField, SelectField } from "../../../components/FormFields";

const CATEGORIES = [
  "Petroleum & Equipment",
  "Construction & Infrastructure",
  "IT & Electronics",
  "Medical Supplies",
  "Consultancy Services",
];

export default function StepTenderInfo({ form, update }) {
  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold text-navy-900">
        Tender Information
      </h2>
      <TextField
        label="Tender Title"
        value={form.title}
        onChange={(v) => update("title", v)}
      />
      <TextField
        label="Tender ID"
        value={form.tenderId}
        onChange={(v) => update("tenderId", v)}
        placeholder="e.g. MoPNG/2026/001"
      />
      <div>
        <label className="block text-xs font-medium text-ink-600 mb-1">
          Description
        </label>
        <textarea
          rows={4}
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          className="w-full border border-border rounded-badge px-3 py-2 text-sm text-ink-900 focus:outline-none focus:border-navy-900"
        />
      </div>
      <SelectField
        label="Category"
        value={form.category}
        onChange={(v) => update("category", v)}
        options={CATEGORIES}
      />
      <TextField
        label="Estimated Value (₹)"
        type="number"
        value={form.estimatedValue}
        onChange={(v) => update("estimatedValue", v)}
        placeholder="e.g. 250000000 for ₹25 Cr"
      />
      <TextField
        label="Submission Deadline"
        type="date"
        value={form.deadline}
        onChange={(v) => update("deadline", v)}
      />
    </div>
  );
}