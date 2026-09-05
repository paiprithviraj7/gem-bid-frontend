import { useState } from "react";
import { Upload, CheckCircle2, Loader2, Check } from "lucide-react";
import { FileUploadField } from "../../../components/FormFields";

const ANALYSIS_STEPS = [
  "Reading tender document",
  "Identifying eligibility requirements",
  "Identifying financial requirements",
  "Identifying technical requirements",
  "Identifying required documents",
  "Identifying certifications",
  "Identifying submission deadline",
];

export default function StepUpload({ form, update, onAnalysisComplete }) {
  const [analyzing, setAnalyzing] = useState(false);
  const [visibleSteps, setVisibleSteps] = useState(0);
  const [done, setDone] = useState(form.tenderPdfAnalyzed || false);

  function handleFileSelect(fileName) {
    update("tenderPdfFile", fileName);
    if (!fileName) return;

    setAnalyzing(true);
    setVisibleSteps(0);
    setDone(false);

    // Reveal each analysis step one at a time, roughly 500ms apart —
    // this is a simulation only, no real document parsing happens here.
    ANALYSIS_STEPS.forEach((_, i) => {
      setTimeout(() => {
        setVisibleSteps(i + 1);
        if (i === ANALYSIS_STEPS.length - 1) {
          setTimeout(() => {
            setAnalyzing(false);
            setDone(true);
            update("tenderPdfAnalyzed", true);
            onAnalysisComplete?.(true);
          }, 400);
        }
      }, i * 500);
    });
  }

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold text-navy-900">Tender Document</h2>
      <p className="text-sm text-ink-600 -mt-2">
        Upload the tender PDF. The platform will analyze it to extract
        requirements.
      </p>

      <FileUploadField
        label="Tender PDF"
        fileName={form.tenderPdfFile}
        onChange={handleFileSelect}
      />

      {(analyzing || done) && (
        <div className="mt-4 border border-border rounded-card p-5 bg-surface">
          <h3 className="text-sm font-semibold text-navy-900 mb-3">
            AI-Powered Tender Analysis
          </h3>
          <div className="space-y-2">
            {ANALYSIS_STEPS.map((step, i) => (
              <div
                key={step}
                className={`flex items-center gap-2 text-sm transition-opacity ${
                  i < visibleSteps ? "opacity-100" : "opacity-0"
                }`}
              >
                <Check className="w-4 h-4 text-status-green shrink-0" />
                <span className="text-ink-900">{step}</span>
              </div>
            ))}
          </div>

          {analyzing && visibleSteps < ANALYSIS_STEPS.length && (
            <div className="flex items-center gap-2 mt-3 text-sm text-ink-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing tender document...
            </div>
          )}

          {done && (
            <div className="mt-4 pt-3 border-t border-border flex items-center gap-2 text-sm font-medium text-status-green">
              <CheckCircle2 className="w-4 h-4" />
              Requirements extracted: 12
            </div>
          )}
        </div>
      )}
    </div>
  );
}