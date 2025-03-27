import React, { useState } from "react";
import "./App.css";

const GeminiChatUI = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");

  const handleSend = async () => {
    if (!prompt.trim()) return;

    try {
      const res = await fetch("http://localhost:5001/api/tax-query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      setResponse(data.response || "No response from server.");
    } catch (err) {
      console.error(err);
      setResponse("Error sending request. Check console for details.");
    }
  };

  const handleCancel = () => {
    setPrompt("");
    setResponse("");
  };

  return (
    <div className="gemini-container">
      {/* Header with Gemini logo + title */}
      <div className="gemini-header">
        {/* Update the img src path to your actual Gemini logo file */}
        <img
          src="gemini.png"
          alt="Gemini Logo"
          className="gemini-logo"
        />
        {/* <h2 className="gemini-title">Gemini</h2> */}
      </div>

      {/* Prompt Label + Textarea */}
      <label className="prompt-label" htmlFor="prompt">
        Prompt:
      </label>
      <textarea
        id="prompt"
        className="prompt-textarea"
        placeholder="Enter your prompt here..."
        rows={6}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      {/* Buttons */}
      <div className="gemini-buttons">
        <button className="gemini-button send-button" onClick={handleSend}>
          Send
        </button>
        <button className="gemini-button cancel-button" onClick={handleCancel}>
          Cancel
        </button>
      </div>

      {/* Response Label + Output */}
      <label className="response-label" htmlFor="response">
        Response:
      </label>
      <textarea
        id="response"
        className="response-textarea"
        rows={6}
        value={response}
        readOnly
      />
    </div>
  );
};

export default GeminiChatUI;
