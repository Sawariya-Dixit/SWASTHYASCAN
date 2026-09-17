const {
  BedrockRuntimeClient,
  InvokeModelCommand,
} = require("@aws-sdk/client-bedrock-runtime");

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || "us-east-1",
});

const MODEL_ID =
  process.env.BEDROCK_MODEL_ID || "anthropic.claude-3-haiku-20240307-v1:0";

/**
 * Builds the prompt sent to Bedrock. Always asks for strict JSON back,
 * so the backend can parse it reliably.
 */
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
 * Calls Amazon Bedrock and returns a parsed risk assessment object.
 * Throws if Bedrock fails or returns something unparseable — the
 * controller is responsible for catching this and returning a
 * friendly error to the frontend.
 */
async function getRiskAssessment({ age, gender, symptoms, bp, sugar, language }) {
  const prompt = buildPrompt({ age, gender, symptoms, bp, sugar, language });

  const command = new InvokeModelCommand({
    modelId: MODEL_ID,
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 300,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const response = await client.send(command);
  const rawBody = JSON.parse(new TextDecoder().decode(response.body));

  // Claude-on-Bedrock returns content as an array of blocks; the text is in content[0].text
  const textOutput = rawBody.content?.[0]?.text || "{}";

  // Defensive parsing in case the model wraps JSON in extra text/backticks
  const jsonMatch = textOutput.match(/\{[\s\S]*\}/);
  const jsonString = jsonMatch ? jsonMatch[0] : textOutput;

  return JSON.parse(jsonString);
}

module.exports = { getRiskAssessment };
