import React, { useState } from "react";
import './App.css';

const DeloitteChatUI = () => {
    const [prompt, setPrompt] = useState("");
    const [response, setResponse] = useState("");

    const handleSend = async () => {
        if (!prompt.trim()) return;

        const res = await fetch("http://localhost:5001/api/tax-query", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt }),
        });

        const data = await res.json();
        setResponse(data.response);
    };

    return (
        <div className="chat-container">
            <h2>Deloitte Auditor Chat UI</h2>
            <textarea 
                className="chat-textarea"
                rows="4" 
                placeholder="Enter Tax Prompt..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
            />
            <div className="chat-buttons">
                <button className="chat-button send-button" onClick={handleSend}>Send</button>
                <button className="chat-button cancel-button" onClick={() => setPrompt("")}>Cancel</button>
            </div>
            <div className="response-box">
                {response}
            </div>
        </div>
    );
};

export default DeloitteChatUI;
