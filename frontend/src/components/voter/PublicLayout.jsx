import React from "react";
import PublicNavbar from "./PublicNavbar";
import PublicFooter from "./PublicFooter";

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 text-slate-900">
      <PublicNavbar />
      <main className="w-full">{children}</main>
      <PublicFooter />
    </div>
  );
}