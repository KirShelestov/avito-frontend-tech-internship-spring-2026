import type { FormData } from "./adsEditTypes";

const DRAFT_TIMESTAMP_SUFFIX = "-timestamp";

export const updateFormData = (
    field: keyof FormData,
    value: string | number | Record<string, unknown>,
    prevData: FormData,
): FormData => {
    if (field === "category" && typeof value === "string" && value !== prevData.category) {
        return { ...prevData, category: value, params: {} };
    }

    if (field === "title" && typeof value === "string") {
        return { ...prevData, title: value };
    }

    if (field === "description" && typeof value === "string") {
        return { ...prevData, description: value };
    }

    if (field === "price" && typeof value === "number") {
        return { ...prevData, price: value };
    }

    if (field === "params" && typeof value === "object" && value !== null) {
        return { ...prevData, params: value as Record<string, string | number | undefined> };
    }

    return prevData;
};

export const updateParams = (
    key: string,
    value: string | number,
    prevData: FormData,
): FormData => ({
    ...prevData,
    params: { ...prevData.params, [key]: value },
});

export const getDraftKey = (id: string | undefined) =>
    id ? `ad-draft-${id}` : "";

export const getDraftTimestampKey = (id: string | undefined) =>
    id ? `ad-draft-${id}${DRAFT_TIMESTAMP_SUFFIX}` : "";

export const loadDraft = (id: string | undefined): FormData | null => {
    if (!id) return null;
    const draft = localStorage.getItem(getDraftKey(id));
    if (!draft) return null;

    try {
        return JSON.parse(draft) as FormData;
    } catch {
        localStorage.removeItem(getDraftKey(id));
        localStorage.removeItem(getDraftTimestampKey(id));
        return null;
    }
};

export const saveDraft = (id: string | undefined, data: FormData) => {
    if (!id) return;
    try {
        localStorage.setItem(getDraftKey(id), JSON.stringify(data));
        localStorage.setItem(getDraftTimestampKey(id), new Date().toISOString());
    } catch (error) {
        console.error("Ошибка при сохранении черновика:", error);
    }
};

export const getDraftTimestamp = (id: string | undefined): Date | null => {
    if (!id) return null;
    const timestamp = localStorage.getItem(getDraftTimestampKey(id));
    if (!timestamp) return null;
    
    try {
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) {
            return null;
        }
        return date;
    } catch {
        return null;
    }
};

export const clearDraft = (id: string | undefined) => {
    if (!id) return;
    localStorage.removeItem(getDraftKey(id));
    localStorage.removeItem(getDraftTimestampKey(id));
};

export const clearAllDrafts = () => {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
        if (key.startsWith("ad-draft-") && !key.endsWith(DRAFT_TIMESTAMP_SUFFIX)) {
            localStorage.removeItem(key);
            localStorage.removeItem(key + DRAFT_TIMESTAMP_SUFFIX);
        }
    });
};
