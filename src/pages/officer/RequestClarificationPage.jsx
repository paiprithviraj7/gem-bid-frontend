import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/Card";
import Button from "../../components/Button";
import { TextField, SelectField } from "../../components/FormFields";
import { getCurrentUser } from "../../utils/auth";
import {
  getBidById,
  getBidderProfile,
  getOfficerProfile,
  createClarification,
  createNotification,
} from "../../services/api";

const DOCUMENT_OPTIONS = [
  "Authorized Representative Proof",
  "GST Certificate",
  "PAN",
  "Experience Certificate",
  "Financial Statement",
  "Technical Capability Documents",
  "ISO Certificate",
];

export default function RequestClarificationPage() {
  const navigate = useNavigate();
  const { id } = useParams(); // bid id
  const [officer, setOfficer] = useState(null);
  const [bid, setBid] = useState(null);
  const [bidder, setBidder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const [form, setForm] = useState({
    document: DOCUMENT_OPTIONS[0],
    reason: "",
    message: "",
  });

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== "officer") {
      navigate("/login");
      return;
    }

    getOfficerProfile(user.profileId).then(setOfficer);

    getBidById(id)
      .then(async (bidData) => {
        setBid(bidData);
        const bidderProfile = await getBidderProfile(bidData.bidderId);
        setBidder(bidderProfile);
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  async function handleSend() {
    setSending(true);
    try {
      await createClarification({
        bidId: bid.id,
        tenderId: bid.tenderId,
        bidderId: bid.bidderId,
        document: form.document,
        reason: form.reason,
        message: form.message,
      });

      // Notify the bidder — section 52/57.
      await createNotification({
        recipientRole: "bidder",
        recipientId: bid.bidderId,
        type: "clarification",
        title: "Clarification Required",
        message: `${form.document}: ${form.reason}`,
        link: `/bidder/bids/${bid.id}/clarification`,
      });

      navigate(`/officer/bids/${id}`);
    } finally {
      setSending(false);
    }
  }

  if (loading || !bid) {
    return (
      <DashboardLayout role="officer" userName={officer?.fullName ?? "Officer"}>
        <p className="text-sm text-ink-600">Loading...</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      role="officer"
      userName={officer?.fullName ?? "Officer"}
      notificationCount={1}
    >
      <h1 className="text-xl font-semibold text-ink-900 mb-1">
        Clarification Request
      </h1>
      <p className="text-sm text-ink-600 mb-6">
        {bidder?.companyName} — {bid.tenderId}
      </p>

      <Card>
        <div className="space-y-4">
          <SelectField
            label="Document"
            value={form.document}
            onChange={(v) => update("document", v)}
            options={DOCUMENT_OPTIONS}
          />
          <TextField
            label="Reason"
            value={form.reason}
            onChange={(v) => update("reason", v)}
            placeholder="e.g. Document contains an unclear authorization date"
          />
          <div>
            <label className="block text-xs font-medium text-ink-600 mb-1">
              Message to Bidder
            </label>
            <textarea
              rows={4}
              value={form.message}
              onChange={(e) => update("message", e.target.value)}
              className="w-full border border-border rounded-badge px-3 py-2 text-sm text-ink-900 focus:outline-none focus:border-navy-900"
              placeholder="Please submit a valid updated document."
            />
          </div>

          <Button
            variant="primary"
            className="w-full"
            disabled={sending || !form.reason || !form.message}
            onClick={handleSend}
          >
            {sending ? "Sending..." : "Send Request"}
          </Button>
        </div>
      </Card>
    </DashboardLayout>
  );
}