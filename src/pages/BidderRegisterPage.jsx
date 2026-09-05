import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Check } from "lucide-react";
import Button from "../components/Button";
import { registerBidder } from "../services/api";
import { setCurrentUser } from "../utils/auth";

import StepCompany from "./bidderSteps/StepCompany";
import StepGST from "./bidderSteps/StepGST";
import StepPAN from "./bidderSteps/StepPAN";
import StepExperience from "./bidderSteps/StepExperience";
import StepFinancial from "./bidderSteps/StepFinancial";
import StepTechnical from "./bidderSteps/StepTechnical";
import StepCertifications from "./bidderSteps/StepCertifications";
import StepRepresentative from "./bidderSteps/StepRepresentative";
import StepReview from "./bidderSteps/StepReview";

const STEPS = [
  { label: "Company", component: StepCompany },
  { label: "GST", component: StepGST },
  { label: "PAN", component: StepPAN },
  { label: "Experience", component: StepExperience },
  { label: "Financial", component: StepFinancial },
  { label: "Technical", component: StepTechnical },
  { label: "Certifications", component: StepCertifications },
  { label: "Representative", component: StepRepresentative },
  { label: "Review", component: StepReview },
];

const INITIAL_FORM = {
  // A. Company Identity
  companyName: "",
  companyType: "Private Limited",
  companyRegNumber: "",
  registeredAddress: "",
  state: "",
  city: "",
  incorporationDate: "",
  companyRegCertFile: "",
  // B. GST
  gstin: "",
  legalBusinessName: "",
  gstRegDate: "",
  gstStatus: "Active",
  gstCertFile: "",
  // C. PAN
  panNumber: "",
  panHolderName: "",
  panDocFile: "",
  // D. Experience
  yearsExperience: "",
  previousGovtProjects: "",
  majorCompletedProjects: "",
  experienceCertFile: "",
  // E. Financial
  annualTurnover: "",
  financialYear: "",
  netWorth: "",
  financialStatementFile: "",
  // F. Technical Capability
  technicalInfrastructure: "",
  equipment: "",
  manpower: "",
  technicalCapacity: "",
  technicalDocFile: "",
  // G. Certifications
  isoApplicable: "No",
  isoFile: "",
  bisApplicable: "No",
  bisFile: "",
  otherCertApplicable: "No",
  otherCertFile: "",
  // H. Representative
  representativeName: "",
  representativeDesignation: "",
  representativeEmail: "",
  representativePhone: "",
  representativeDocFile: "",
  // Login credential
  password: "",
};

export default function BidderRegisterPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

  async function handleSubmit() {
    setError("");
    setLoading(true);
    try {
      const { user } = await registerBidder(form);
      setCurrentUser(user);
      navigate("/bidder/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const StepComponent = STEPS[currentStep].component;
  const isLastStep = currentStep === STEPS.length - 1;

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
        <h1 className="text-xl font-semibold text-ink-900">
          Bidder Registration
        </h1>
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

        {/* Active step content */}
        <div className="mt-8 bg-surface-card border border-border rounded-card p-6">
          <StepComponent form={form} update={update} />
        </div>

        {error && (
          <p className="mt-4 text-sm text-status-red bg-status-red-bg px-3 py-2 rounded-badge">
            {error}
          </p>
        )}

        {/* Navigation buttons */}
        <div className="mt-6 flex justify-between">
          <Button
            variant="secondary"
            onClick={goBack}
            disabled={currentStep === 0}
          >
            Back
          </Button>
          {isLastStep ? (
            <Button variant="primary" onClick={handleSubmit} disabled={loading}>
              {loading ? "Submitting..." : "Complete Registration"}
            </Button>
          ) : (
            <Button variant="primary" onClick={goNext}>
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}