import React, { useState, useEffect } from "react";
import API from "../services/api";

export default function Blockchain() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/blockchain/verify")
      .then((res) => {
        setRecords(res.data.records);
        setLoading(false);
      })
      .catch((err) => {
        alert("Failed to fetch blockchain records");
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h2>🔗 Blockchain Verification</h2>
      {loading ? (
        <p>Loading blockchain records...</p>
      ) : records.length === 0 ? (
        <p>No blockchain records found</p>
      ) : (
        <table style={{ margin: "auto", borderCollapse: "collapse", width: "80%" }}>
          <thead>
            <tr>
              <th style={cellStyle}>Vote ID</th>
              <th style={cellStyle}>Candidate</th>
              <th style={cellStyle}>Timestamp</th>
              <th style={cellStyle}>Hash</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id}>
                <td style={cellStyle}>{r.id}</td>
                <td style={cellStyle}>{r.candidate}</td>
                <td style={cellStyle}>{r.timestamp}</td>
                <td style={cellStyle}>{r.hash}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const cellStyle = { border: "1px solid #ccc", padding: "8px", textAlign: "center" };
