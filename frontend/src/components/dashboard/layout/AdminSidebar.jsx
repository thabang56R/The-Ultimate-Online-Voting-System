
import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ShieldAlert,
  Vote,
  Users,
  FileSearch,
  ClipboardList,
  LogOut,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Elections", path: "/admin/elections", icon: Vote },
  { label: "Candidates", path: "/admin/candidates", icon: Users },
  { label: "Review Queue", path: "/admin/review-queue", icon: ShieldAlert },
  { label: "Risk Events", path: "/admin/risk-events", icon: FileSearch },
  { label: "Audit Logs", path: "/admin/audit-logs", icon: ClipboardList },
];

export default function AdminSidebar() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/admin/login";
  };

  return (
    <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white xl:flex xl:flex-col">
      <div className="border-b border-slate-200 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          SecureVote AI
        </p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900">Admin Panel</h2>
        <p className="mt-1 text-sm text-slate-500">Election monitoring and fraud review</p>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`
              }
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-200"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}