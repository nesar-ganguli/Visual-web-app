import React, { useState } from "react";

function App() {
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setError(null);
    setImageUrl(null);
    try {
      const response = await fetch("http://localhost:5050/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
        mode: "cors",
      });

      const result = await response.json();

      if (response.ok) {
        setImageUrl(result.image_url);
      } else {
        setError(result.error || "Unknown error");
      }
    } catch (err) {
      setError("Request failed: " + err.message);
    }
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        padding: "2rem",
        backgroundColor: "#f7f9fc",
        minHeight: "100vh",
      }}
    >
      <h2 style={{ marginBottom: "2rem", color: "#1d3557" }}>
        Language Agnostic Visualization App
      </h2>

      <div
        style={{
          display: "flex",
          gap: "2rem",
          alignItems: "stretch", // makes both columns equal height
        }}
      >
        {/* Left Panel: Code Input */}
        <div
          style={{
            flex: 1,
            backgroundColor: "#ffffff",
            padding: "1.5rem",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <label style={{ fontWeight: "bold", color: "#333" }}>
            Choose Language:
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{
              padding: "0.5rem",
              marginTop: "0.5rem",
              marginBottom: "1rem",
              width: "100%",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          >
            <option value="python">Python</option>
            <option value="r">R</option>
          </select>

          <label style={{ fontWeight: "bold", color: "#333" }}>
            Enter Visualization Code:
          </label>
          <textarea
            rows="20"
            cols="50"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Write your Python or R code here..."
            style={{
              width: "100%",
              fontFamily: "monospace",
              padding: "1rem",
              marginTop: "0.5rem",
              borderRadius: "4px",
              border: "1px solid #ccc",
              resize: "vertical",
              minHeight: "350px",
              boxSizing: "border-box",
            }}
          />

          <button
            onClick={handleSubmit}
            style={{
              marginTop: "1rem",
              padding: "0.75rem 1.5rem",
              backgroundColor: "#457b9d",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Generate
          </button>

          {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
        </div>

        {/* Right Panel: Visualization Output */}
        <div
          style={{
            flex: 1,
            backgroundColor: "#ffffff",
            padding: "1.5rem",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {imageUrl ? (
            <>
              <h3 style={{ color: "#1d3557" }}>Output Visualization:</h3>
              {imageUrl.endsWith(".html") ? (
                <iframe
                  src={imageUrl}
                  width="100%"
                  height="400px"
                  style={{
                    flexGrow: 1,
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    minHeight: "350px",
                  }}
                  title="Interactive Visualization"
                />
              ) : (
                <img
                  src={imageUrl}
                  alt="Visualization Output"
                  style={{
                    width: "100%",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    objectFit: "contain",
                    maxHeight: "400px",
                  }}
                />
              )}
            </>
          ) : (
            <p style={{ color: "#999" }}>
              Your visualization will appear here after submission.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
