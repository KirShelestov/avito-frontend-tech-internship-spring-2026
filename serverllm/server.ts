import Fastify from "fastify";
import cors from "@fastify/cors";
import dotenv from "dotenv";

dotenv.config();

const fastify = Fastify({ logger: true });

await fastify.register(cors, { origin: true });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

fastify.post("/grok", async (request, reply) => {
  const { prompt } = request.body as { prompt?: string };
  if (!prompt) return reply.status(400).send({ error: "Prompt is required" });

  try {
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`;   

    const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
        temperature: 0.85,
        maxOutputTokens: 300,
        topP: 0.8,
        
        },
        safetySettings: [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
        ],
        
    })
    });


    const data: any = await response.json();

    console.log("--- ПОЛНЫЙ ОТВЕТ ОТ GOOGLE ---");
console.log(JSON.stringify(data, null, 2)); 
console.log("--- КОНЕЦ ОТВЕТА ---");
    if (!response.ok) {
      return reply.status(response.status).send({
        error: "Google API Error",
        details: data.error?.message || data
      });
    }

    const resultText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    return reply.send({ result: resultText || "Нейросеть не выдала ответ." });

  } catch (err) {
    fastify.log.error(err);
    return reply.status(502).send({ 
      error: "Ошибка сети/VPN", 
      details: String(err) 
    });
  }
});

fastify.get("/", async () => {
  return { message: "Server is up and running!" };
});

const port = 8090;
fastify.listen({ port, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`\n🚀 ГОТОВО! Сервер слушает на: ${address}`);
});