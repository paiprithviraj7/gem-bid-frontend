import { Search, Bell, User } from "lucide-react";

export default function Navbar({ userName = "User", notificationCount = 0 }) {
  return (
    <header className="h-16 bg-white border-b border-border flex items-center justify-between px-6">
      <div className="flex items-center gap-2 max-w-md w-full">
        <Search className="w-4 h-4 text-ink-400 shrink-0" />
        <input
          type="text"
          placeholder="Search tenders, bids, documents..."
          className="w-full bg-transparent text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none"
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-badge hover:bg-navy-100">
          <Bell className="w-5 h-5 text-navy-900" />
          {notificationCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center rounded-full bg-status-red text-white text-[10px] font-semibold">
              {notificationCount}
            </span>
          )}
        </button>

        <div className="flex items-center gap-2 pl-3 border-l border-border">
          <div className="w-8 h-8 rounded-full bg-navy-100 flex items-center justify-center">
            <User className="w-4 h-4 text-navy-800" />
          </div>
          <span className="text-sm font-medium text-ink-900">{userName}</span>
        </div>
      </div>
    </header>
  );
}