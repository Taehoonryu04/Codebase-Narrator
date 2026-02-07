/**
 * Simple script to test Gemini API connectivity
 * Run: node test-gemini.js
 */

const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");

// Load .env.local file manually
function loadEnv() {
    const envPath = path.join(__dirname, ".env.local");
    if (!fs.existsSync(envPath)) {
        console.error("❌ .env.local file not found");
        process.exit(1);
    }

    const envContent = fs.readFileSync(envPath, "utf8");
    const lines = envContent.split("\n");

    for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith("#")) {
            const [key, ...valueParts] = trimmed.split("=");
            const value = valueParts.join("=").trim();
            if (key && value) {
                process.env[key.trim()] = value;
            }
        }
    }
}

async function testGeminiAPI() {
    loadEnv();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        console.error("❌ GEMINI_API_KEY not found in .env.local");
        process.exit(1);
    }

    console.log("🔑 API Key found:", apiKey.substring(0, 10) + "...");
    console.log("🤖 Testing Gemini API connection...\n");

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = "Say hello in JSON format: {\"message\": \"your message\"}";
        console.log("📤 Sending test prompt...");

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log("✅ Gemini API is working!");
        console.log("📝 Response:", text);
        console.log("\n✨ Your Gemini API setup is correct!");
    } catch (error) {
        console.error("❌ Gemini API error:");
        console.error("Error name:", error.name);
        console.error("Error message:", error.message);

        if (error.message.includes("API key") || error.message.includes("API_KEY")) {
            console.error("\n💡 Your API key may be invalid. Get a new one from:");
            console.error("   https://aistudio.google.com/app/apikey");
        } else if (error.message.includes("404")) {
            console.error("\n💡 Model 'gemini-1.5-flash' may not be available.");
            console.error("   Try using a different model version.");
        } else if (error.message.includes("quota") || error.message.includes("rate limit")) {
            console.error("\n💡 API quota exceeded. Check your usage at:");
            console.error("   https://console.cloud.google.com/");
        }

        process.exit(1);
    }
}

testGeminiAPI();
