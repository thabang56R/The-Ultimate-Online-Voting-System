import React, { useEffect } from "react";

export default function FaceScan() {
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true });
  }, []);

  return (
    <div className="page">
      <h2>👤 Face Recognition</h2>
      <video autoPlay width="320" height="240" />
      <p>Face verified successfully ✔️</p>
    </div>
  );
}
