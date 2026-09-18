// const {
//   BedrockRuntimeClient,
//   InvokeModelCommand,
// } = require("@aws-sdk/client-bedrock-runtime");

// const client = new BedrockRuntimeClient({
//   region: process.env.AWS_REGION || "us-east-1",
// });

// const MODEL_ID = process.env.BEDROCK_MODEL_ID || "amazon.nova-lite-v1:0";

// function buildPrompt({ age, gender, symptoms, bp, sugar, language }) {
// //   const symptomsText = symptoms.join(", ");
//   const languageInstruction =
//     language === "hi" ? "Respond in Hindi." : "Respond in English.";

//   return `You are a preliminary health screening assistant, not a doctor.

// User data:
// - Age: ${age}
// - Gender: ${gender}
// - Symptoms: ${symptomsText}
// - Blood Pressure: ${bp || "not provided"}
// - Blood Sugar: ${sugar || "not provided"}

// Based on this, respond ONLY with valid JSON in exactly this format
// (no extra text, no markdown, no code fences):

// {
//   "riskLevel": "Low" | "Medium" | "High",
//   "factors": ["short phrase describing factor 1", "short phrase describing factor 2"],
//   "advice": "2-3 simple, easy-to-understand sentences of guidance",
//   "disclaimer": "This is not a medical diagnosis. Please consult a doctor for confirmation."
// }

// ${languageInstruction} This is a preliminary screening only, not a diagnosis.`;
// }

// async function getRiskAssessment({ age, gender, symptoms, bp, sugar, language }) {
//   const prompt = buildPrompt({ age, gender, symptoms, bp, sugar, language });

//   // NOVA request format — different from Claude/Anthropic format
//   const command = new InvokeModelCommand({
//     modelId: MODEL_ID,
//     contentType: "application/json",
//     accept: "application/json",
//     body: JSON.stringify({
//       messages: [
//         {
//           role: "user",
//           content: [{ text: prompt }], // must be an array of content blocks
//         },
//       ],
//       inferenceConfig: {
//         maxTokens: 300,
//         temperature: 0.3,
//       },
//     }),
//   });

//   let response;
//   try {
//     response = await client.send(command);
//   } catch (err) {
//     // ---- DIAGNOSTIC BLOCK: tells us the REAL reason, not just the generic name ----
//     console.error("========== BEDROCK ERROR DETAILS ==========");
//     console.error("MODEL_ID used:", MODEL_ID);
//     console.error("REGION used:", process.env.AWS_REGION || "us-east-1");
//     console.error("err.name:", err.name);
//     console.error("err.message:", err.message);
//     console.error("err.$metadata:", JSON.stringify(err.$metadata, null, 2));
//     console.error("=============================================");
//     throw err;
//   }

//   const rawBody = JSON.parse(new TextDecoder().decode(response.body));

//   // NOVA response shape: { output: { message: { content: [ { text: "..." } ] } }, ... }
//   const contentList = rawBody?.output?.message?.content || [];
//   const textBlock = contentList.find((item) => item.text);
//   const textOutput = textBlock ? textBlock.text : "{}";

//   // Defensive parsing in case the model wraps JSON in extra text/backticks
//   const jsonMatch = textOutput.match(/\{[\s\S]*\}/);
//   const jsonString = jsonMatch ? jsonMatch[0] : textOutput;

//   return JSON.parse(jsonString);
// }

// module.exports = { getRiskAssessment };