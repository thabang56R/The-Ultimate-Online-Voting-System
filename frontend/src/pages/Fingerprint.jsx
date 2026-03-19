import React, { useState } from "react";

export default function Fingerprint() {
  const [verified, setVerified] = useState(false);

  return (
    <div className="page">
      <h2>🖐️ Fingerprint Verification</h2>

      <button onClick={() => setVerified(true)}>
        Scan Fingerprint
      </button>

      {verified && <p>Fingerprint matched ✔️</p>}
    </div>
  );
}
