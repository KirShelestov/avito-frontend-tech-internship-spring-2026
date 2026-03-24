import { callGemini } from "../../shared/api/llmApi";
import {
    buildAdContext,
    buildImproveDescriptionPrompt,
    buildMarketPricePrompt,
    parsePriceFromText,
} from "../../entities/ad/utils/llmAdUtils";
import type { FormData } from "./adsEditTypes";

export const improveDescription = async (formData: FormData) => {
    const context = buildAdContext(formData);
    const prompt = buildImproveDescriptionPrompt(context);
    const text = await callGemini(prompt);
    const result = text?.trim() || "";

    return {
        result,
        message: result
            ? "AI сгенерировал описание — нажмите Применить"
            : "Gemini вернул пустой ответ.",
    };
};

export const marketPrice = async (formData: FormData) => {
    const context = buildAdContext(formData);
    const prompt = buildMarketPricePrompt(context);
    const text = await callGemini(prompt);
    const result = text?.trim() || "";

    return {
        result,
        message: result
            ? "AI вернул цену — нажмите Применить"
            : "Gemini не вернул информацию по цене.",
    };
};

export const applyPriceFromText = (aiPriceResult: string) => {
    const price = parsePriceFromText(aiPriceResult);
    if (!price) {
        return {
            price: null,
            message: "Распарсить цену не удалось. Проверьте текст в ответе AI.",
        };
    }
    return {
        price,
        message: `Цена применена: ${price}`,
    };
};
