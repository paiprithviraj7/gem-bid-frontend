import { TextField, FileUploadField } from "../../components/FormFields";

export default function StepFinancial({ form, update }) {
  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold text-navy-900">
        Audited Financial Statements
      </h2>
      <TextField
        label="Annual Turnover (₹)"
        type="number"
        value={form.annualTurnover}
        onChange={(v) => update("annualTurnover", v)}
      />
      <TextField
        label="Financial Year"
        value={form.financialYear}
        onChange={(v) => update("financialYear", v)}
        placeholder="e.g. 2024-25"
      />
      <TextField
        label="Net Worth (₹)"
        type="number"
        value={form.netWorth}
        onChange={(v) => update("netWorth", v)}
      />
      <FileUploadField
        label="Audited Financial Statement"
        fileName={form.financialStatementFile}
        onChange={(v) => update("financialStatementFile", v)}
      />
    </div>
  );
}