import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAdsEditStore, type ChatMessage } from "../adsEditStore";
import type { AdItem } from "../../../entities/ad/types";

describe("useAdsEditStore", () => {
    beforeEach(() => {
        // Reset store before each test
        const state = useAdsEditStore.getState();
        state.setAd(null);
        state.setLoading(true);
        state.setSaving(false);
        state.setError(null);
        state.setFormData({
            category: "",
            title: "",
            price: 0,
            description: "",
            params: {},
        });
        state.setAiDescriptionLoading(false);
        state.setAiPriceLoading(false);
        state.setAiDescriptionMessage("");
        state.setAiPriceMessage("");
        state.setAiDescriptionResult("");
        state.setAiPriceResult("");
        state.setChatMessages([]);
        state.setChatLoading(false);
    });

    describe("Ad state management", () => {
        it("should set ad", () => {
            const mockAd: AdItem = {
                id: 1,
                category: "electronics",
                title: "iPhone",
                price: 50000,
                description: "Great phone",
                params: {},
                imageUrl: "url",
                views: 0,
                createdAt: new Date(),
            };

            const { result } = renderHook(() => useAdsEditStore());

            act(() => {
                result.current.setAd(mockAd);
            });

            expect(result.current.ad).toEqual(mockAd);
        });

        it("should set loading state", () => {
            const { result } = renderHook(() => useAdsEditStore());

            act(() => {
                result.current.setLoading(false);
            });

            expect(result.current.loading).toBe(false);
        });

        it("should set saving state", () => {
            const { result } = renderHook(() => useAdsEditStore());

            act(() => {
                result.current.setSaving(true);
            });

            expect(result.current.saving).toBe(true);
        });

        it("should set error", () => {
            const { result } = renderHook(() => useAdsEditStore());
            const errorMsg = "Failed to load";

            act(() => {
                result.current.setError(errorMsg);
            });

            expect(result.current.error).toBe(errorMsg);
        });

        it("should clear error", () => {
            const { result } = renderHook(() => useAdsEditStore());

            act(() => {
                result.current.setError("Some error");
            });

            act(() => {
                result.current.setError(null);
            });

            expect(result.current.error).toBeNull();
        });
    });

    describe("Form data management", () => {
        it("should set form data", () => {
            const { result } = renderHook(() => useAdsEditStore());

            const formData = {
                category: "electronics",
                title: "iPhone 14",
                price: 50000,
                description: "Good phone",
                params: { brand: "Apple" },
            };

            act(() => {
                result.current.setFormData(formData);
            });

            expect(result.current.formData).toEqual(formData);
        });

        it("should update single field", () => {
            const { result } = renderHook(() => useAdsEditStore());

            act(() => {
                result.current.setFormData({
                    category: "electronics",
                    title: "iPhone",
                    price: 0,
                    description: "",
                    params: {},
                });
            });

            act(() => {
                result.current.updateField("title", "iPhone 14");
            });

            expect(result.current.formData.title).toBe("iPhone 14");
            expect(result.current.formData.category).toBe("electronics");
        });

        it("should clear params when changing category", () => {
            const { result } = renderHook(() => useAdsEditStore());

            act(() => {
                result.current.setFormData({
                    category: "electronics",
                    title: "iPhone",
                    price: 0,
                    description: "",
                    params: { brand: "Apple", color: "red" },
                });
            });

            act(() => {
                result.current.updateField("category", "auto");
            });

            expect(result.current.formData.category).toBe("auto");
            expect(result.current.formData.params).toEqual({});
        });

        it("should update params", () => {
            const { result } = renderHook(() => useAdsEditStore());

            act(() => {
                result.current.setFormData({
                    category: "electronics",
                    title: "iPhone",
                    price: 0,
                    description: "",
                    params: { brand: "Apple" },
                });
            });

            act(() => {
                result.current.updateParam("color", "red");
            });

            expect(result.current.formData.params.color).toBe("red");
            expect(result.current.formData.params.brand).toBe("Apple");
        });

        it("should update multiple params sequentially", () => {
            const { result } = renderHook(() => useAdsEditStore());

            act(() => {
                result.current.setFormData({
                    category: "electronics",
                    title: "iPhone",
                    price: 0,
                    description: "",
                    params: {},
                });
            });

            act(() => {
                result.current.updateParam("brand", "Apple");
                result.current.updateParam("color", "red");
                result.current.updateParam("storage", 256);
            });

            expect(result.current.formData.params).toEqual({
                brand: "Apple",
                color: "red",
                storage: 256,
            });
        });
    });

    describe("AI states management", () => {
        it("should manage description AI state", () => {
            const { result } = renderHook(() => useAdsEditStore());

            act(() => {
                result.current.setAiDescriptionLoading(true);
            });

            expect(result.current.aiDescriptionLoading).toBe(true);

            act(() => {
                result.current.setAiDescriptionMessage("AI generated text");
            });

            expect(result.current.aiDescriptionMessage).toBe("AI generated text");

            act(() => {
                result.current.setAiDescriptionResult("Improved description");
            });

            expect(result.current.aiDescriptionResult).toBe("Improved description");
        });

        it("should manage price AI state", () => {
            const { result } = renderHook(() => useAdsEditStore());

            act(() => {
                result.current.setAiPriceLoading(true);
            });

            expect(result.current.aiPriceLoading).toBe(true);

            act(() => {
                result.current.setAiPriceMessage("Price: 55000");
            });

            expect(result.current.aiPriceMessage).toBe("Price: 55000");

            act(() => {
                result.current.setAiPriceResult("55000");
            });

            expect(result.current.aiPriceResult).toBe("55000");
        });

        it("should independently manage description and price states", () => {
            const { result } = renderHook(() => useAdsEditStore());

            act(() => {
                result.current.setAiDescriptionLoading(true);
                result.current.setAiPriceLoading(false);
            });

            expect(result.current.aiDescriptionLoading).toBe(true);
            expect(result.current.aiPriceLoading).toBe(false);
        });
    });

    describe("Chat management", () => {
        it("should add chat message", () => {
            const { result } = renderHook(() => useAdsEditStore());

            const message: ChatMessage = {
                id: "1",
                role: "user",
                content: "Hello",
                timestamp: new Date(),
            };

            act(() => {
                result.current.addChatMessage(message);
            });

            expect(result.current.chatMessages).toHaveLength(1);
            expect(result.current.chatMessages[0]).toEqual(message);
        });

        it("should maintain message order", () => {
            const { result } = renderHook(() => useAdsEditStore());

            const msg1: ChatMessage = {
                id: "1",
                role: "user",
                content: "First",
                timestamp: new Date(2024, 0, 1),
            };

            const msg2: ChatMessage = {
                id: "2",
                role: "assistant",
                content: "Response",
                timestamp: new Date(2024, 0, 2),
            };

            act(() => {
                result.current.addChatMessage(msg1);
                result.current.addChatMessage(msg2);
            });

            expect(result.current.chatMessages).toHaveLength(2);
            expect(result.current.chatMessages[0].content).toBe("First");
            expect(result.current.chatMessages[1].content).toBe("Response");
        });

        it("should set chat loading state", () => {
            const { result } = renderHook(() => useAdsEditStore());

            act(() => {
                result.current.setChatLoading(true);
            });

            expect(result.current.chatLoading).toBe(true);

            act(() => {
                result.current.setChatLoading(false);
            });

            expect(result.current.chatLoading).toBe(false);
        });

        it("should set multiple chat messages", () => {
            const { result } = renderHook(() => useAdsEditStore());

            const messages: ChatMessage[] = [
                { id: "1", role: "user", content: "Hi", timestamp: new Date() },
                {
                    id: "2",
                    role: "assistant",
                    content: "Hello",
                    timestamp: new Date(),
                },
                {
                    id: "3",
                    role: "user",
                    content: "How are you?",
                    timestamp: new Date(),
                },
            ];

            act(() => {
                result.current.setChatMessages(messages);
            });

            expect(result.current.chatMessages).toEqual(messages);
        });

        it("should clear chat", () => {
            const { result } = renderHook(() => useAdsEditStore());

            const message: ChatMessage = {
                id: "1",
                role: "user",
                content: "Hello",
                timestamp: new Date(),
            };

            act(() => {
                result.current.addChatMessage(message);
            });

            expect(result.current.chatMessages).toHaveLength(1);

            act(() => {
                result.current.clearChat();
            });

            expect(result.current.chatMessages).toHaveLength(0);
        });

        it("should handle add message with existing messages", () => {
            const { result } = renderHook(() => useAdsEditStore());

            const msg1: ChatMessage = {
                id: "1",
                role: "user",
                content: "First",
                timestamp: new Date(),
            };

            const msg2: ChatMessage = {
                id: "2",
                role: "assistant",
                content: "Second",
                timestamp: new Date(),
            };

            act(() => {
                result.current.addChatMessage(msg1);
            });

            const previousLength = result.current.chatMessages.length;

            act(() => {
                result.current.addChatMessage(msg2);
            });

            expect(result.current.chatMessages.length).toBe(previousLength + 1);
        });
    });
});
