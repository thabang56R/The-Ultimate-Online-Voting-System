import { useState } from "react";
import FaceScan from "../components/FaceScan";
import FingerprintScan from "../components/FingerprintScan";
import API from "../services/api";

export default function Vote() {
  const [step, setStep] = useState(1);

  const castVote = async (candidate) => {
    await API.post("/vote/cast", { candidate });
    alert("Vote successfully cast!");
  };

  if (step === 1)
    return <FaceScan onSuccess={() => setStep(2)} />;

  if (step === 2)
    return <FingerprintScan onSuccess={() => setStep(3)} />;

  return (
    <div className="center">
      <div className="container">
        <h2>Cast Your Vote</h2>
        <button onClick={() => castVote("Candidate A")}>
          Vote Candidate A
        </button>
        <br /><br />
        <button onClick={() => castVote("Candidate B")}>
          Vote Candidate B
        </button>
      </div>
    </div>
  );
}
