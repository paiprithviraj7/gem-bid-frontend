import { Upload, CheckCircle2 } from "lucide-react";

export function TextField({
  label,
  value,
  onChange,
  type = "text",
  required = true,
  placeholder = "",
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-ink-600 mb-1">
        {label}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-border rounded-badge px-3 py-2 text-sm text-ink-900 focus:outline-none focus:border-navy-900"
      />
    </div>
  );
}

export function SelectField({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-xs font-medium text-ink-600 mb-1">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-border rounded-badge px-3 py-2 text-sm text-ink-900 focus:outline-none focus:border-navy-900"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

export function FileUploadField({ label, fileName, onChange }) {
  return (
    <div>
      <label className="block text-xs font-medium text-ink-600 mb-1">
        {label}
      </label>
      <label className="flex items-center gap-2 border border-dashed border-border rounded-badge px-3 py-2.5 text-sm text-ink-600 cursor-pointer hover:border-navy-900">
        {fileName ? (
          <>
            <CheckCircle2 className="w-4 h-4 text-status-green shrink-0" />
            <span className="text-ink-900">{fileName}</span>
          </>
        ) : (
          <>
            <Upload className="w-4 h-4 shrink-0" />
            <span>Choose PDF file</span>
          </>
        )}
        <input
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => onChange(e.target.files[0]?.name ?? "")}
        />
      </label>
    </div>
  );
}

// For "Is this certification applicable?" — Yes/No toggle (section 11G)
export function YesNoField({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-xs font-medium text-ink-600 mb-1">
        {label}
      </label>
      <div className="flex gap-2">
        {["Yes", "No"].map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`px-4 py-1.5 rounded-badge text-sm font-medium border transition-colors ${
              value === opt
                ? "bg-navy-900 text-white border-navy-900"
                : "bg-white text-ink-900 border-border hover:border-navy-900"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}