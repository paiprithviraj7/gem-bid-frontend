import DashboardLayout from "../layouts/DashboardLayout";
import Card from "../components/Card";

// Used for any route not yet built with a real page. Wraps content in the
// dashboard shell so navigation stays visible while we build out features.
export default function PlaceholderPage({ title }) {
  return (
    <DashboardLayout role="bidder" userName="ABC Petroleum" notificationCount={3}>
      <h1 className="text-xl font-semibold text-ink-900 mb-4">{title}</h1>
      <Card>
        <p className="text-sm text-ink-600">
          This route is wired and rendering correctly. The real page is built
          in a later phase.
        </p>
      </Card>
    </DashboardLayout>
  );
}