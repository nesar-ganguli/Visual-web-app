import React, { useState } from 'react';

function App() {
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState('');
  const [imageUrl, setImageUrl] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setError(null);
    setImageUrl(null);
    try {
      const response = await fetch('http://localhost:5050/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
        mode: 'cors', 
      });

      const result = await response.json();

      if (response.ok) {
        setImageUrl(result.image_url);  
      } else {
        setError(result.error || 'Unknown error');
      }
    } catch (err) {
      setError('Request failed: ' + err.message);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h2>Language Agnostic Visualization App</h2>

      <label>Choose Language: </label>
      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="python">Python</option>
        <option value="r">R</option>
      </select>

      <br />
      <br />

      <label>Enter Visualization Code:</label>
      <br />
      <textarea
        rows="10"
        cols="80"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Write your Python or R code here..."
      />

      <br />
      <br />
      <button onClick={handleSubmit}>Generate</button>

      <br />
      <br />

      {imageUrl && (
        <div>
          <h3>Output Visualization:</h3>
          {imageUrl.endsWith(".html") ? (
            <iframe
              src={imageUrl}
              width="100%"
              height="500px"
              style={{ border: "1px solid #ccc", borderRadius: "8px" }}
              title="Interactive Visualization"
            />
          ) : (
            <img
              src={imageUrl}
              alt="Visualization Output"
              style={{ maxWidth: "100%", borderRadius: "8px" }}
            />
          )}
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default App;
