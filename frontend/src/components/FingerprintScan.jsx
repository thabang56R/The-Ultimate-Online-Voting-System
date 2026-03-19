import { motion } from "framer-motion";
import { FaFingerprint } from "react-icons/fa";
import { useState } from "react";

export default function FingerprintScan({ onSuccess }) {
  const [scanning, setScanning] = useState(false);

  const startScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      onSuccess();
    }, 2500);
  };

  return (
    <div className="container">
      <h2>Fingerprint Verification</h2>

      <motion.div
        animate={{ scale: scanning ? [1, 1.1, 1] : 1 }}
        transition={{ repeat: Infinity, duration: 0.8 }}
        style={{ textAlign: "center", margin: "30px 0" }}
      >
        <FaFingerprint size={100} />
      </motion.div>

      <button onClick={startScan}>
        {scanning ? "Verifying..." : "Scan Fingerprint"}
      </button>
    </div>
  );
}
