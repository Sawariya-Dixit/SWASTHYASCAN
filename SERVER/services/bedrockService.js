const {
  BedrockRuntimeClient,
  InvokeModelCommand,
} = require("@aws-sdk/client-bedrock-runtime");

const client = new BedrockRuntimeClient({ region: process.env.AWS_REGION || "us-east-1" });

function buildPrompt({ age, gender, symptoms, bp, sugar, language }) {
  return `You are a preliminary health screening assistant, not a doctor.
User data:
- Age: ${age}, Gender: ${gender}
- Symptoms: ${symptoms.join(", ")}
- BP: ${bp || "not provided"}, Sugar: ${sugar || "not provided"}

Respond ONLY in this JSON format (no extra text):
{
  "riskLevel": "Low" | "Medium" | "High",
  "factors": ["short phrase 1", "short phrase 2"],
  "advice": "2-3 lines of simple, easy-to-understand guidance in ${language === "hi" ? "Hindi" : "English"}",
  "disclaimer": "This is not a medical diagnosis. Please consult a doctor."
}`;
}

async function getRiskAssessment({ age, gender, symptoms, bp, sugar, language }) {
  const prompt = buildPrompt({ age, gender, symptoms, bp, sugar, language });

  const command = new InvokeModelCommand({
    modelId: "anthropic.claude-3-haiku-20240307-v1:0",
    body: JSON.stringify({
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 300,
      messages: [{ role: "user", content: prompt }],
    }),
    contentType: "application/json",
  });

  const response = await client.send(command);
  const raw = JSON.parse(new TextDecoder().decode(response.body));
  return JSON.parse(raw.content[0].text);
}

module.exports = { getRiskAssessment };
