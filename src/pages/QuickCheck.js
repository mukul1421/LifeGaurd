import React, { useState } from "react";
import Swal from "sweetalert2";
import api from "../api";

export default function QuickCheck() {
  const [symptom, setSymptom] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState("");

  /* ===== ANALYZE USING AI ===== */
  const handleAnalyze = async () => {
    if (!symptom.trim()) {
      Swal.fire("Please enter symptoms");
      return;
    }

    setLoading(true);
    setAiResponse("");

    try {
      const res = await api.post("/ai-check", {
  symptoms: symptom,
});


      setAiResponse(res.data.text);
    } catch (err) {
      console.error(err);
      Swal.fire("AI service error");
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px",
        background: "#f5f7fb",
      }}
    >
      <div
        style={{
          maxWidth: 700,
          margin: "auto",
          background: "white",
          padding: 30,
          borderRadius: 14,
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <h2>🩺 Quick Health Check</h2>

        <textarea
          rows="4"
          style={{
            width: "100%",
            marginTop: 15,
            padding: 12,
            borderRadius: 10,
            border: "1px solid #ddd",
          }}
          placeholder="Example: fever, headache, cough"
          value={symptom}
          onChange={(e) => setSymptom(e.target.value)}
        />

        <button
          onClick={handleAnalyze}
          style={{
            marginTop: 15,
            padding: "10px 18px",
            borderRadius: 10,
            border: "none",
            background: "#2563eb",
            color: "white",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          🔍 Analyze
        </button>

        {loading && (
          <div style={{ marginTop: 20 }}>Analyzing symptoms...</div>
        )}

        {aiResponse && (
          <div
            style={{
              marginTop: 20,
              padding: 15,
              borderRadius: 10,
              background: "#f1f5f9",
            }}
          >
            <h3>🤖 AI Medical Suggestion</h3>
            <p style={{ whiteSpace: "pre-line" }}>{aiResponse}</p>
          </div>
        )}
      </div>
    </div>
  );
}
