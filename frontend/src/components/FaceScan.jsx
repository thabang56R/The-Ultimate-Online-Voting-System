import { motion } from "framer-motion";
import { FaUserCheck } from "react-icons/fa";
import { useState } from "react";

export default function FaceScan({ onSuccess }) {
  const [scanning, setScanning] = useState(false);

  const startScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      onSuccess();
    }, 3000);
  };

  return (
    <div className="container">
      <h2>Face Recognition</h2>

      <motion.div
        animate={{ opacity: scanning ? [0.5, 1, 0.5] : 1 }}
        transition={{ repeat: Infinity, duration: 1 }}
        style={{
          height: 200,
          border: "2px dashed #00eaff",
          borderRadius: 20,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "20px 0",
        }}
      >
        <FaUserCheck size={80} />
      </motion.div>

      <button onClick={startScan}>
        {scanning ? "Scanning..." : "Scan Face"}
      </button>
    </div>
  );
}
