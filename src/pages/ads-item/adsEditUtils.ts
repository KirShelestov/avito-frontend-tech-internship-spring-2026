import type { FormData } from "./adsEditTypes";

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
        return { ...prevData, params: value as Record<string, unknown> };
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

export const loadDraft = (id: string | undefined): FormData | null => {
    if (!id) return null;
    const draft = localStorage.getItem(getDraftKey(id));
    if (!draft) return null;

    try {
        return JSON.parse(draft) as FormData;
    } catch {
        return null;
    }
};

export const saveDraft = (id: string | undefined, data: FormData) => {
    if (!id) return;
    localStorage.setItem(getDraftKey(id), JSON.stringify(data));
};
