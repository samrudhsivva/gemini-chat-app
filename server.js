require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

// ✅ Secure CORS Configuration
app.use(cors({
    origin: "http://localhost:3000", // Allow frontend access
    methods: ["POST"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// ✅ Use Google Gemini API Key (From .env or Hardcoded)
const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

if (!apiKey.startsWith("AIza")) {
    console.error("❌ ERROR: Invalid or missing Google Gemini API key!");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

// ✅ API Endpoint for Tax Queries
app.post("/api/tax-query", async (req, res) => {
    const { prompt } = req.body;

    if (!prompt || !prompt.toLowerCase().includes("tax")) {
        return res.status(400).json({ response: "Only tax-related queries are allowed." });
    }

    try {
        console.log("🚀 Sending request to Google Gemini API:", prompt);

        const chatSession = model.startChat({ generationConfig, history: [] });
        const result = await chatSession.sendMessage(`You are a tax expert. Answer this tax-related question:\n${prompt}`);

        if (!result || !result.response) {
            throw new Error("Invalid response from Google Gemini API");
        }

        const responseText = result.response.text();

        // ✅ Store Queries in a Log File
        fs.appendFileSync("tax_queries.json", JSON.stringify({ prompt, response: responseText }) + "\n");

        res.json({ response: responseText });
    } catch (error) {
        console.error("❌ Google Gemini API Error:", error.message);
        res.status(500).json({ response: "Error processing request. Check server logs." });
    }
});

// ✅ Start Server on Port 5001
const PORT = 5001;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

// ✅ Debugging: Show API Key Status
console.log("🔑 Google Gemini API Key Loaded:", apiKey ? "✅ [HIDDEN]" : "❌ MISSING");
