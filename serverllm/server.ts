import Fastify from "fastify";
import cors from "@fastify/cors";
import dotenv from "dotenv";
import crypto from "crypto"; 
dotenv.config();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const fastify = Fastify({ logger: true });

await fastify.register(cors, { origin: true });

async function getAccessToken() {
  const response = await fetch("https://ngw.devices.sberbank.ru:9443/api/v2/oauth", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept": "application/json",
      "RqUID": crypto.randomUUID(),
      "Authorization": process.env.SBER_AUTH_KEY!,
    },
    body: "scope=GIGACHAT_API_PERS",
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(JSON.stringify(data));
  }

  return data.access_token;
}

fastify.post("/grok", async (request, reply) => {
  const { prompt } = request.body as { prompt?: string };
  if (!prompt) return reply.status(400).send({ error: "Prompt is required" });

  try {
    const token = await getAccessToken();

    const response = await fetch("https://gigachat.devices.sberbank.ru/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        model: "GigaChat",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    const data: Record<string, unknown> = await response.json();

    if (!response.ok) {
      return reply.status(response.status).send({
        error: "GigaChat API Error",
        details: data,
      });
    }

    const resultText = data?.choices?.[0]?.message?.content;

    return reply.send({ result: resultText || "Сбер не ответил 😢" });

  } catch (err) {
    fastify.log.error(err);
    return reply.status(502).send({
      error: "Ошибка сети/серверная",
      details: String(err),
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
  console.log(`\n🚀 Сервер слушает на: ${address}`);
});