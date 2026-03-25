export type LlmServiceResult = {
  result?: string;
  output?: { text?: string };
  choices?: Array<{ text?: string }>; 
  text?: string;
};

export const callGemini = async (
  prompt: string,
  signal?: AbortSignal
): Promise<string> => {
  const url = "http://localhost:8090/grok";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: prompt,
    }),
    signal,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.details || errorData.error || "Ошибка сервера",
    );
  }

  const data = await response.json();

  return data.result || "";
};