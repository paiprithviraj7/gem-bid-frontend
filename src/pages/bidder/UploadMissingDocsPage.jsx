import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/Card";
import Button from "../../components/Button";
import { FileUploadField } from "../../components/FormFields";
import { getCurrentUser } from "../../utils/auth";
import {
  getTenderById,
  getBidderProfile,
  getExtraDocuments,
  saveExtraDocuments,
} from "../../services/api";
import { buildComplianceChecklist } from "../../utils/complianceChecklist";

export default function UploadMissingDocsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [bidder, setBidder] = useState(null);
  const [tender, setTender] = useState(null);
  const [extras, setExtras] = useState({});
  const [pendingUploads, setPendingUploads] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== "bidder") {
      navigate("/login");
      return;
    }

    Promise.all([
      getBidderProfile(user.profileId),
      getTenderById(id),
      getExtraDocuments(user.profileId, id),
    ])
      .then(([bidderProfile, tenderData, existingExtras]) => {
        setBidder(bidderProfile);
        setTender(tenderData);
        setExtras(existingExtras);
      })
      .finally(() => setLoading(false));
  }, [navigate, id]);

  if (loading || !bidder || !tender) {
    return (
      <DashboardLayout role="bidder" userName={bidder?.companyName ?? "Bidder"}>
        <p className="text-sm text-ink-600">Loading...</p>
      </DashboardLayout>
    );
  }

  const checklist = buildComplianceChecklist(tender, bidder, extras);
  const missingItems = checklist.items.filter((i) => !i.available);

  function handleFileSelect(extraKey, fileName) {
    setPendingUploads((prev) => ({ ...prev, [extraKey]: fileName }));
  }

  async function handleSaveAll() {
    setSaving(true);
    try {
      const user = getCurrentUser();
      await saveExtraDocuments(user.profileId, id, pendingUploads);
      const updated = await getExtraDocuments(user.profileId, id);
      setExtras(updated);
      setPendingUploads({});
    } finally {
      setSaving(false);
    }
  }

  const hasPendingUploads = Object.keys(pendingUploads).length > 0;
  const allResolved = missingItems.length === 0;

  return (
    <DashboardLayout
      role="bidder"
      userName={bidder.companyName}
      notificationCount={3}
    >
      <p className="text-xs text-ink-600">{tender.tenderId}</p>
      <h1 className="text-xl font-semibold text-ink-900 mb-1">
        Upload Missing Documents
      </h1>
      <p className="text-sm text-ink-600 mb-6">
        You do not need to upload documents already available in your
        profile. Only the additional documents below are required.
      </p>

      <Card>
        {allResolved ? (
          <div className="text-center py-6">
            <CheckCircle2 className="w-10 h-10 text-status-green mx-auto mb-3" />
            <p className="text-sm font-medium text-ink-900">
              All required documents are now available.
            </p>
            <Button
              variant="primary"
              className="mt-4"
              onClick={() => navigate(`/bidder/tenders/${tender.id}`)}
            >
              Back to Tender
            </Button>
          </div>
        ) : (
          <div className="space-y-5">
            {missingItems.map((item) => (
              <FileUploadField
                key={item.extraKey}
                label={item.label}
                fileName={pendingUploads[item.extraKey]}
                onChange={(fileName) =>
                  handleFileSelect(item.extraKey, fileName)
                }
              />
            ))}

            <Button
              variant="primary"
              className="w-full"
              disabled={!hasPendingUploads || saving}
              onClick={handleSaveAll}
            >
              {saving ? "Saving..." : "Save Uploaded Documents"}
            </Button>
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
}