import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
    updateFormData,
    updateParams,
    getDraftKey,
    getDraftTimestampKey,
    loadDraft,
    saveDraft,
    getDraftTimestamp,
    clearDraft,
    clearAllDrafts,
} from "../adsEditUtils";
import type { FormData } from "../adsEditTypes";

describe("adsEditUtils", () => {
    const mockFormData: FormData = {
        category: "electronics",
        title: "iPhone 14",
        price: 50000,
        description: "Great phone",
        params: { brand: "Apple" },
    };

    describe("updateFormData", () => {
        it("should update title field", () => {
            const result = updateFormData("title", "iPhone 15", mockFormData);
            expect(result.title).toBe("iPhone 15");
            expect(result.category).toBe("electronics");
        });

        it("should update price field", () => {
            const result = updateFormData("price", 60000, mockFormData);
            expect(result.price).toBe(60000);
        });

        it("should update description field", () => {
            const result = updateFormData("description", "Amazing phone", mockFormData);
            expect(result.description).toBe("Amazing phone");
        });

        it("should update category and clear params", () => {
            const result = updateFormData("category", "auto", mockFormData);
            expect(result.category).toBe("auto");
            expect(result.params).toEqual({});
        });

        it("should update params field", () => {
            const newParams = { brand: "Samsung", model: "S24" };
            const result = updateFormData("params", newParams, mockFormData);
            expect(result.params).toEqual(newParams);
        });

        it("should return same object if same category is passed", () => {
            const result = updateFormData("category", "electronics", mockFormData);
            expect(result.category).toBe("electronics");
            expect(result.params).toEqual({ brand: "Apple" });
        });

        it("should return original data for invalid field value type", () => {
            const result = updateFormData("title", 123 as unknown as string, mockFormData);
            expect(result).toEqual(mockFormData);
        });
    });

    describe("updateParams", () => {
        it("should add new param", () => {
            const result = updateParams("color", "red", mockFormData);
            expect(result.params.color).toBe("red");
            expect(result.params.brand).toBe("Apple");
        });

        it("should update existing param", () => {
            const result = updateParams("brand", "Samsung", mockFormData);
            expect(result.params.brand).toBe("Samsung");
        });

        it("should not mutate original data", () => {
            const result = updateParams("model", "14 Pro", mockFormData);
            expect(mockFormData.params.model).toBeUndefined();
            expect(result.params.model).toBe("14 Pro");
        });

        it("should handle numeric param values", () => {
            const result = updateParams("yearOfManufacture", 2024, mockFormData);
            expect(result.params.yearOfManufacture).toBe(2024);
        });
    });

    describe("getDraftKey", () => {
        it("should return correct draft key with id", () => {
            const key = getDraftKey("123");
            expect(key).toBe("ad-draft-123");
        });

        it("should return empty string without id", () => {
            const key = getDraftKey(undefined);
            expect(key).toBe("");
        });

        it("should return empty string with empty id", () => {
            const key = getDraftKey("");
            expect(key).toBe("");
        });
    });

    describe("draft management", () => {
        beforeEach(() => {
            localStorage.clear();
            vi.clearAllMocks();
        });

        afterEach(() => {
            localStorage.clear();
        });

        describe("saveDraft", () => {
            it("should save draft to localStorage", () => {
                const id = "123";
                saveDraft(id, mockFormData);
                const saved = localStorage.getItem("ad-draft-123");
                expect(saved).toBeTruthy();
                expect(JSON.parse(saved!)).toEqual(mockFormData);
            });

            it("should not save draft without id", () => {
                saveDraft(undefined, mockFormData);
                const keys = Object.keys(localStorage);
                expect(keys).toHaveLength(0);
            });

            it("should update existing draft", () => {
                const id = "123";
                saveDraft(id, mockFormData);
                const updatedData = { ...mockFormData, title: "iPhone 15" };
                saveDraft(id, updatedData);
                const saved = localStorage.getItem("ad-draft-123");
                expect(JSON.parse(saved!).title).toBe("iPhone 15");
            });
        });

        describe("loadDraft", () => {
            it("should load draft from localStorage", () => {
                const id = "123";
                localStorage.setItem("ad-draft-123", JSON.stringify(mockFormData));
                const loaded = loadDraft(id);
                expect(loaded).toEqual(mockFormData);
            });

            it("should return null if draft not found", () => {
                const loaded = loadDraft("nonexistent");
                expect(loaded).toBeNull();
            });

            it("should return null without id", () => {
                const loaded = loadDraft(undefined);
                expect(loaded).toBeNull();
            });

            it("should return null if JSON is invalid", () => {
                localStorage.setItem("ad-draft-123", "invalid json");
                const loaded = loadDraft("123");
                expect(loaded).toBeNull();
            });

            it("should correctly parse complex params", () => {
                const dataWithParams = {
                    ...mockFormData,
                    params: {
                        brand: "Apple",
                        color: "space-gray",
                        storage: 256,
                        condition: "new",
                    },
                };
                localStorage.setItem("ad-draft-456", JSON.stringify(dataWithParams));
                const loaded = loadDraft("456");
                expect(loaded?.params).toEqual(dataWithParams.params);
            });

            it("should remove timestamp key if draft JSON is invalid", () => {
                const id = "789";
                localStorage.setItem("ad-draft-789", "invalid json");
                localStorage.setItem("ad-draft-789-timestamp", new Date().toISOString());
                loadDraft(id);
                expect(localStorage.getItem("ad-draft-789-timestamp")).toBeNull();
            });
        });

        describe("getDraftTimestampKey", () => {
            it("should return correct timestamp key with id", () => {
                const key = getDraftTimestampKey("123");
                expect(key).toBe("ad-draft-123-timestamp");
            });

            it("should return empty string without id", () => {
                const key = getDraftTimestampKey(undefined);
                expect(key).toBe("");
            });
        });

        describe("getDraftTimestamp", () => {
            it("should load timestamp from localStorage", () => {
                const id = "123";
                const now = new Date();
                localStorage.setItem("ad-draft-123-timestamp", now.toISOString());
                const timestamp = getDraftTimestamp(id);
                expect(timestamp).toBeInstanceOf(Date);
                expect(timestamp?.toISOString()).toBe(now.toISOString());
            });

            it("should return null if timestamp not found", () => {
                const timestamp = getDraftTimestamp("nonexistent");
                expect(timestamp).toBeNull();
            });

            it("should return null without id", () => {
                const timestamp = getDraftTimestamp(undefined);
                expect(timestamp).toBeNull();
            });

            it("should return null if timestamp is invalid", () => {
                localStorage.setItem("ad-draft-123-timestamp", "invalid date");
                const timestamp = getDraftTimestamp("123");
                expect(timestamp).toBeNull();
            });
        });

        describe("clearDraft", () => {
            it("should remove draft and timestamp from localStorage", () => {
                const id = "123";
                localStorage.setItem("ad-draft-123", JSON.stringify(mockFormData));
                localStorage.setItem("ad-draft-123-timestamp", new Date().toISOString());
                clearDraft(id);
                expect(localStorage.getItem("ad-draft-123")).toBeNull();
                expect(localStorage.getItem("ad-draft-123-timestamp")).toBeNull();
            });

            it("should not throw error if draft does not exist", () => {
                expect(() => clearDraft("nonexistent")).not.toThrow();
            });

            it("should not do anything without id", () => {
                expect(() => clearDraft(undefined)).not.toThrow();
            });
        });

        describe("clearAllDrafts", () => {
            it("should clear all draft keys from localStorage", () => {
                localStorage.setItem("ad-draft-123", JSON.stringify(mockFormData));
                localStorage.setItem("ad-draft-123-timestamp", new Date().toISOString());
                localStorage.setItem("ad-draft-456", JSON.stringify(mockFormData));
                localStorage.setItem("ad-draft-456-timestamp", new Date().toISOString());
                localStorage.setItem("other-key", "value");
                
                clearAllDrafts();
                
                expect(localStorage.getItem("ad-draft-123")).toBeNull();
                expect(localStorage.getItem("ad-draft-123-timestamp")).toBeNull();
                expect(localStorage.getItem("ad-draft-456")).toBeNull();
                expect(localStorage.getItem("ad-draft-456-timestamp")).toBeNull();
                expect(localStorage.getItem("other-key")).toBe("value");
            });

            it("should not throw error if no drafts exist", () => {
                expect(() => clearAllDrafts()).not.toThrow();
            });
        });

        describe("enhanced saveDraft with timestamp", () => {
            it("should save both draft and timestamp", () => {
                const id = "123";
                saveDraft(id, mockFormData);
                expect(localStorage.getItem("ad-draft-123")).toBeTruthy();
                expect(localStorage.getItem("ad-draft-123-timestamp")).toBeTruthy();
            });

            it("should update timestamp when draft is updated", async () => {
                vi.useFakeTimers();
                try {
                    const id = "123";
                    saveDraft(id, mockFormData);
                    const firstTimestamp = localStorage.getItem("ad-draft-123-timestamp");
                    
                    // Advance time by 1 second
                    vi.advanceTimersByTime(1000);
                    
                    // Wait a bit and save again
                    const updatedData = { ...mockFormData, title: "Updated" };
                    saveDraft(id, updatedData);
                    const secondTimestamp = localStorage.getItem("ad-draft-123-timestamp");
                    
                    expect(firstTimestamp).not.toBe(secondTimestamp);
                } finally {
                    vi.useRealTimers();
                }
            });
        });
    });
});
