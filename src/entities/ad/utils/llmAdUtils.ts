type FormData = {
  category: string;
  title: string;
  price: number;
  description: string;
  params: Record<string, any>;
};

export const buildAdContext = (formData: FormData) => {
  const params = Object.entries(formData.params || {})
    .map(([key, value]) => `${key}: ${value}`)
    .join("; ");

  return `Объявление:\nКатегория: ${formData.category}\nНазвание: ${formData.title}\nЦена: ${formData.price}\nОписание: ${formData.description}\nПараметры: ${params}`;
};

export const buildImproveDescriptionPrompt = (context: string) =>
  `Преобразуй описание для Avito.\nПРАВИЛА:\n1. ДЛИНА: Не более 900 символов.\n2. ФОРМАТ: Только простой текст. НЕ ИСПОЛЬЗУЙ Markdown.\n3. СТИЛЬ: Обычные абзацы.\n4. НЕ начинай с "Вот ваше описание".\n\nДАННЫЕ:\n${context}`;

export const buildMarketPricePrompt = (context: string) =>
  `Определи рыночную адекватную цену для объявления:\n${context}\nОтвечай только числом в рублях или диапазоном (например, 123000-135000).`;

export const parsePriceFromText = (text: string): number | null => {
  const matches = text.match(/\d+[\s\d]*/g);
  if (!matches) return null;

  const numbers = matches
    .map((m) => Number(m.replace(/\s+/g, "")))
    .filter((n) => Number.isFinite(n) && n > 0);

  if (!numbers.length) return null;

  return Math.round(numbers.reduce((acc, v) => acc + v, 0) / numbers.length);
};