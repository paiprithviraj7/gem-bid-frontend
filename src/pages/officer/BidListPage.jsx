import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/Card";
import StatusBadge from "../../components/StatusBadge";
import Table from "../../components/Table";
import { getCurrentUser } from "../../utils/auth";
import { getBids, getBidderProfile, getTenderById, getOfficerProfile } from "../../services/api";

function riskColor(level) {
  if (level === "LOW") return "green";
  if (level === "MEDIUM") return "amber";
  return "red";
}

function statusColor(status) {
  if (status === "Approved") return "green";
  if (status === "Rejected") return "red";
  if (status === "Clarification Requested") return "amber";
  return "neutral";
}

export default function BidListPage() {
  const navigate = useNavigate();
  const [officer, setOfficer] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== "officer") {
      navigate("/login");
      return;
    }

    Promise.all([getOfficerProfile(user.profileId), getBids()])
      .then(async ([officerProfile, bids]) => {
        setOfficer(officerProfile);

        // Enrich each bid with the bidder's company name and tender title
        // so the table doesn't just show raw IDs.
        const enriched = await Promise.all(
          bids.map(async (bid) => {
            const [bidder, tender] = await Promise.all([
              getBidderProfile(bid.bidderId).catch(() => null),
              getTenderById(bid.tenderId).catch(() => null),
            ]);
            return {
              ...bid,
              bidderName: bidder?.companyName ?? bid.bidderId,
              tenderTitle: tender?.title ?? bid.tenderId,
            };
          })
        );
        setRows(enriched);
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const columns = [
    { key: "bidderName", label: "Bidder" },
    { key: "tenderTitle", label: "Tender" },
    { key: "complianceScore", label: "Compliance" },
    { key: "riskLevel", label: "Risk" },
    { key: "status", label: "Status" },
  ];

  return (
    <DashboardLayout
      role="officer"
      userName={officer?.fullName ?? "Officer"}
      notificationCount={1}
    >
      <h1 className="text-xl font-semibold text-ink-900 mb-1">Bids</h1>
      <p className="text-sm text-ink-600 mb-6">
        All bids submitted across your tenders.
      </p>

      {loading ? (
        <p className="text-sm text-ink-600">Loading bids...</p>
      ) : rows.length === 0 ? (
        <Card>
          <p className="text-sm text-ink-600 text-center py-6">
            No bids have been submitted yet.
          </p>
        </Card>
      ) : (
        <Table
          columns={columns}
          rows={rows}
          renderCell={(key, row) => {
            if (key === "complianceScore") return `${row.complianceScore}%`;
            if (key === "riskLevel")
              return (
                <StatusBadge status={riskColor(row.riskLevel)}>
                  {row.riskLevel}
                </StatusBadge>
              );
            if (key === "status")
              return (
                <StatusBadge status={statusColor(row.status)}>
                  {row.status}
                </StatusBadge>
              );
            if (key === "bidderName")
              return (
                <button
                  className="text-navy-900 font-medium hover:underline"
                  onClick={() => navigate(`/officer/bids/${row.id}`)}
                >
                  {row.bidderName}
                </button>
              );
            return row[key];
          }}
        />
      )}
    </DashboardLayout>
  );
}