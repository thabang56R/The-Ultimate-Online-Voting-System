import React from "react";

export default function PublicFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 text-sm text-slate-500 sm:px-6 lg:px-8 md:flex-row md:items-center md:justify-between">
        <p>© 2026 SecureVote AI. Election integrity, transparency, and trust.</p>
        <p>Built with MERN + ML-powered fraud detection.</p>
        <small>Designed and Developed By:Thabang Rakeng</small>
      </div>
    </footer>
  );
}