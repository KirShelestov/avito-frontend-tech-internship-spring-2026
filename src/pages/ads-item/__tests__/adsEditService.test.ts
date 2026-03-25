import { describe, it, expect, beforeEach, vi } from "vitest";
import {
    improveDescription,
    marketPrice,
    applyPriceFromText,
    chatWithAI,
} from "../adsEditService";
import * as llmApi from "../../../shared/api/llmApi";
import * as llmUtils from "../../../entities/ad/utils/llmAdUtils";
import type { FormData } from "../adsEditTypes";

vi.mock("../../../shared/api/llmApi");
vi.mock("../../../entities/ad/utils/llmAdUtils");

describe("adsEditService", () => {
    const mockFormData: FormData = {
        category: "electronics",
        title: "iPhone 14",
        price: 50000,
        description: "Great phone",
        params: { brand: "Apple" },
    };

    const mockContext =
        "Category: electronics\nTitle: iPhone 14\nPrice: 50000\nDescription: Great phone\n";

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(llmUtils.buildAdContext).mockReturnValue(mockContext);
        vi.mocked(llmUtils.buildImproveDescriptionPrompt).mockReturnValue(
            "Improve this description"
        );
        vi.mocked(llmUtils.buildMarketPricePrompt).mockReturnValue("What is market price?");
    });

    describe("improveDescription", () => {
        it("should return improved description text", async () => {
            const improvedText =
                "Excellent iPhone 14 with great camera and battery life";
            vi.mocked(llmApi.callGemini).mockResolvedValue(improvedText);

            const result = await improveDescription(mockFormData);

            expect(result.result).toBe(improvedText);
            expect(result.message).toContain("AI сгенерировал описание");
            expect(llmApi.callGemini).toHaveBeenCalledWith(
                "Improve this description",
                undefined
            );
        });

        it("should handle empty response from AI", async () => {
            vi.mocked(llmApi.callGemini).mockResolvedValue("");

            const result = await improveDescription(mockFormData);

            expect(result.result).toBe("");
            expect(result.message).toContain("Gemini вернул пустой ответ");
        });

        it("should trim whitespace from response", async () => {
            vi.mocked(llmApi.callGemini).mockResolvedValue(
                "  Trimmed description  \n"
            );

            const result = await improveDescription(mockFormData);

            expect(result.result).toBe("Trimmed description");
        });

        it("should accept abort signal", async () => {
            const abortController = new AbortController();
            const signal = abortController.signal;

            vi.mocked(llmApi.callGemini).mockResolvedValue("Description");

            await improveDescription(mockFormData, signal);

            expect(llmApi.callGemini).toHaveBeenCalledWith(
                "Improve this description",
                signal
            );
        });

        it("should build correct context for prompt", async () => {
            vi.mocked(llmApi.callGemini).mockResolvedValue("Improved");

            await improveDescription(mockFormData);

            expect(llmUtils.buildAdContext).toHaveBeenCalledWith(mockFormData);
            expect(llmUtils.buildImproveDescriptionPrompt).toHaveBeenCalledWith(mockContext);
        });
    });

    describe("marketPrice", () => {
        it("should return market price", async () => {
            const priceText = "Market price: 45000-55000 rubles";
            vi.mocked(llmApi.callGemini).mockResolvedValue(priceText);

            const result = await marketPrice(mockFormData);

            expect(result.result).toBe(priceText);
            expect(result.message).toContain("AI вернул цену");
        });

        it("should handle empty price response", async () => {
            vi.mocked(llmApi.callGemini).mockResolvedValue("");

            const result = await marketPrice(mockFormData);

            expect(result.result).toBe("");
            expect(result.message).toContain("Gemini не вернул информацию");
        });

        it("should trim price response", async () => {
            vi.mocked(llmApi.callGemini).mockResolvedValue("  55000  \n");

            const result = await marketPrice(mockFormData);

            expect(result.result).toBe("55000");
        });

        it("should accept abort signal", async () => {
            const signal = new AbortController().signal;
            vi.mocked(llmApi.callGemini).mockResolvedValue("55000");

            await marketPrice(mockFormData, signal);

            expect(llmApi.callGemini).toHaveBeenCalledWith(
                "What is market price?",
                signal
            );
        });

        it("should build price prompt with context", async () => {
            vi.mocked(llmApi.callGemini).mockResolvedValue("50000");

            await marketPrice(mockFormData);

            expect(llmUtils.buildMarketPricePrompt).toHaveBeenCalledWith(mockContext);
        });
    });

    describe("applyPriceFromText", () => {
        beforeEach(() => {
            vi.mocked(llmUtils.parsePriceFromText).mockReturnValue(null);
        });

        it("should parse price and return it", () => {
            vi.mocked(llmUtils.parsePriceFromText).mockReturnValue(55000);

            const result = applyPriceFromText("AI response: 55000 rubles");

            expect(result.price).toBe(55000);
            expect(result.message).toContain("Цена применена: 55000");
        });

        it("should handle unparseable price", () => {
            vi.mocked(llmUtils.parsePriceFromText).mockReturnValue(null);

            const result = applyPriceFromText("Some random text");

            expect(result.price).toBeNull();
            expect(result.message).toContain("Распарсить цену не удалось");
        });

        it("should call parsePriceFromText with correct argument", () => {
            const aiResponse = "Price is 45000";
            vi.mocked(llmUtils.parsePriceFromText).mockReturnValue(45000);

            applyPriceFromText(aiResponse);

            expect(llmUtils.parsePriceFromText).toHaveBeenCalledWith(aiResponse);
        });

    });

    describe("chatWithAI", () => {
        it("should send user message with context", async () => {
            const userMessage = "What is the camera quality?";
            const aiResponse = "The camera is excellent with 48MP sensor";

            vi.mocked(llmApi.callGemini).mockResolvedValue(aiResponse);

            const result = await chatWithAI(userMessage, mockFormData);

            expect(result).toBe(aiResponse);
            expect(llmApi.callGemini).toHaveBeenCalled();

            const callArg = vi.mocked(llmApi.callGemini).mock.calls[0][0];
            expect(callArg).toContain(mockContext);
            expect(callArg).toContain(userMessage);
            expect(callArg).toContain("Контекст объявления");
            expect(callArg).toContain("Вопрос пользователя");
        });

        it("should return trimmed response", async () => {
            vi.mocked(llmApi.callGemini).mockResolvedValue("  Response  \n");

            const result = await chatWithAI("Question?", mockFormData);

            expect(result).toBe("Response");
        });

        it("should handle empty response", async () => {
            vi.mocked(llmApi.callGemini).mockResolvedValue("");

            const result = await chatWithAI("Question?", mockFormData);

            expect(result).toBe("");
        });

        it("should accept abort signal", async () => {
            const signal = new AbortController().signal;
            vi.mocked(llmApi.callGemini).mockResolvedValue("Response");

            await chatWithAI("Question?", mockFormData, signal);

            expect(llmApi.callGemini).toHaveBeenCalledWith(
                expect.any(String),
                signal
            );
        });

        it("should build context from form data", async () => {
            vi.mocked(llmApi.callGemini).mockResolvedValue("Response");

            await chatWithAI("How much?", mockFormData);

            expect(llmUtils.buildAdContext).toHaveBeenCalledWith(mockFormData);
        });

        it("should format prompt correctly with multiple lines", async () => {
            const userMessage = "Tell me about battery life";
            vi.mocked(llmApi.callGemini).mockResolvedValue("Battery lasts 20 hours");

            await chatWithAI(userMessage, mockFormData);

            const callArg = vi.mocked(llmApi.callGemini).mock.calls[0][0];
            expect(callArg).toContain("Контекст объявления:");
            expect(callArg).toContain("Вопрос пользователя:");
            expect(callArg).toContain("Ответьте на вопрос в контексте");
        });

        it("should handle special characters in user message", async () => {
            const specialMessage = "What about special chars: @#$%^&*()";
            vi.mocked(llmApi.callGemini).mockResolvedValue("Response");

            await chatWithAI(specialMessage, mockFormData);

            const callArg = vi.mocked(llmApi.callGemini).mock.calls[0][0];
            expect(callArg).toContain(specialMessage);
        });
    });
});
