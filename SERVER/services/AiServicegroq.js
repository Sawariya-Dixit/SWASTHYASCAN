const Groq = require("groq-sdk");

// Get a free API key instantly at https://console.groq.com (no waitlist, no card needed)
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Fast, free-tier friendly model good at following JSON instructions
const MODEL_ID = process.env.GROQ_MODEL_ID || "openai/gpt-oss-120b";

function buildPrompt({ age, gender, symptoms, bp, sugar, language }) {
  const symptomsText = symptoms.join(", ");
  const languageInstruction =
    language === "hi" ? "Respond in Hindi." : "Respond in English.";

  return `You are a preliminary health screening assistant, not a doctor.

User data:
- Age: ${age}
- Gender: ${gender}
- Symptoms: ${symptomsText}
- Blood Pressure: ${bp || "not provided"}
- Blood Sugar: ${sugar || "not provided"}

Based on this, respond ONLY with valid JSON in exactly this format
(no extra text, no markdown, no code fences):

{
  "riskLevel": "Low" | "Medium" | "High",
  "factors": ["short phrase describing factor 1", "short phrase describing factor 2"],
  "advice": "2-3 simple, easy-to-understand sentences of guidance",
  "disclaimer": "This is not a medical diagnosis. Please consult a doctor for confirmation."
}

${languageInstruction} This is a preliminary screening only, not a diagnosis.`;
}

/**
 * Drop-in replacement for the Bedrock version — same function name,
 * same input shape, same return shape. screeningController.js needs
 * NO changes other than the require() path at the top of the file.
 */
async function getRiskAssessment({ age, gender, symptoms, bp, sugar, language }) {
  const prompt = buildPrompt({ age, gender, symptoms, bp, sugar, language });

  let completion;
  try {
    completion = await groq.chat.completions.create({
      model: MODEL_ID,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 1024,
      response_format: { type: "json_object" }, // forces valid JSON output
    });
  } catch (err) {
    console.error("Groq API error:", err.message);
    throw err;
  }

  const textOutput = completion.choices?.[0]?.message?.content || "{}";

  // Defensive parsing in case of stray formatting
  const cleanedText = textOutput.replace(/```json/gi, "").replace(/```/g, "").trim();
  const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
  const jsonString = jsonMatch ? jsonMatch[0] : cleanedText;

  let result;
  try {
    result = JSON.parse(jsonString);
  } catch (error) {
    console.error("Groq raw response:", textOutput);
    throw new Error("Groq returned an invalid JSON response.");
  }

  return result;
}

module.exports = { getRiskAssessment };