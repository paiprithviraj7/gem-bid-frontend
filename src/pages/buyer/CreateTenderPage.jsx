import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Check, CheckCircle2 } from "lucide-react";
import Button from "../../components/Button";
import { createTender, publishTender, createNotification } from "../../services/api";

import StepTenderInfo from "./tenderSteps/StepTenderInfo";
import StepEligibility from "./tenderSteps/StepEligibility";
import StepDocuments from "./tenderSteps/StepDocuments";
import StepUpload from "./tenderSteps/StepUpload";
import StepPreview from "./tenderSteps/StepPreview";

const STEPS = [
  { label: "Tender Info", component: StepTenderInfo },
  { label: "Eligibility", component: StepEligibility },
  { label: "Documents", component: StepDocuments },
  { label: "Upload PDF", component: StepUpload },
  { label: "Preview", component: StepPreview },
];

const INITIAL_FORM = {
  title: "",
  tenderId: "",
  description: "",
  category: "Petroleum & Equipment",
  estimatedValue: "",
  deadline: "",
  minExperience: "",
  minTurnover: "",
  minTechnicalCapacity: "",
  requireCompanyRegistration: true,
  requireGST: true,
  requirePAN: true,
  requireExperience: true,
  requireFinancial: true,
  requireTechnical: true,
  requireISO: false,
  requireBIS: false,
  tenderPdfFile: "",
  tenderPdfAnalyzed: false,
};

export default function CreateTenderPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [published, setPublished] = useState(false);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function goNext() {
    setError("");
    setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function goBack() {
    setError("");
    setCurrentStep((s) => Math.max(s - 1, 0));
  }

  async function handleSaveDraft() {
    setError("");
    setLoading(true);
    try {
      await createTender(form);
      navigate("/buyer/tenders");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handlePublish() {
    setError("");
    setLoading(true);
    try {
      const tender = await createTender(form);
      await publishTender(tender.id);

      // Notify the demo bidder that a new tender is available — see
      // section 25 (Buyer→Bidder connection) and section 57.
      await createNotification({
        recipientRole: "bidder",
        recipientId: "BID-001",
        type: "new_tender",
        title: "New Tender Published",
        message: `${tender.title} — deadline ${tender.deadline}`,
        link: `/bidder/tenders/${tender.id}`,
      });

      setPublished(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Step 4 (Upload) requires the AI analysis to finish before Next is
  // enabled — matches section 22's intent that this shouldn't feel skippable.
  const isUploadStep = currentStep === 3;
  const nextDisabled = isUploadStep && !form.tenderPdfAnalyzed;

  const StepComponent = STEPS[currentStep].component;
  const isPreviewStep = currentStep === STEPS.length - 1;

  if (published) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-surface-card border border-border rounded-card p-8 text-center">
          <CheckCircle2 className="w-12 h-12 text-status-green mx-auto mb-4" />
          <h1 className="text-lg font-semibold text-ink-900">
            Tender Published Successfully
          </h1>
          <p className="mt-2 text-sm text-ink-600">
            Eligible bidders will be notified.
          </p>
          <Button
            variant="primary"
            className="mt-6 w-full"
            onClick={() => navigate("/buyer/tenders")}
          >
            View My Tenders
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-border bg-white">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-navy-900" />
          <span className="text-sm font-semibold text-navy-900">
            GeM Bid Compliance Verification Platform
          </span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-xl font-semibold text-ink-900">Create Tender</h1>
        <p className="mt-1 text-sm text-ink-600">
          Step {currentStep + 1} of {STEPS.length}
        </p>

        {/* Progress indicator */}
        <div className="mt-6 flex items-center">
          {STEPS.map((step, i) => (
            <div key={step.label} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${
                    i < currentStep
                      ? "bg-status-green text-white"
                      : i === currentStep
                      ? "bg-navy-900 text-white"
                      : "bg-navy-100 text-navy-800"
                  }`}
                >
                  {i < currentStep ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span className="text-[11px] text-ink-600 whitespace-nowrap">
                  {step.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-px mx-1 mb-4 ${
                    i < currentStep ? "bg-status-green" : "bg-border"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 bg-surface-card border border-border rounded-card p-6">
          <StepComponent form={form} update={update} />
        </div>

        {error && (
          <p className="mt-4 text-sm text-status-red bg-status-red-bg px-3 py-2 rounded-badge">
            {error}
          </p>
        )}

        <div className="mt-6 flex justify-between">
          <Button
            variant="secondary"
            onClick={goBack}
            disabled={currentStep === 0}
          >
            Back
          </Button>

          {isPreviewStep ? (
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={handleSaveDraft}
                disabled={loading}
              >
                Save Draft
              </Button>
              <Button
                variant="primary"
                onClick={handlePublish}
                disabled={loading}
              >
                {loading ? "Publishing..." : "Publish Tender"}
              </Button>
            </div>
          ) : (
            <Button variant="primary" onClick={goNext} disabled={nextDisabled}>
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}