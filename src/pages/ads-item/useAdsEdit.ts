import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getItemById, updateItem } from "../../entities/ad/api/adApi";
import type { AdItem } from "../../entities/ad/types";
import type { FormData } from "./adsEditTypes";
import {
    improveDescription,
    marketPrice,
    applyPriceFromText,
} from "./adsEditService";
import { loadDraft, saveDraft, updateFormData, updateParams } from "./adsEditUtils";

const defaultFormData: FormData = {
    category: "",
    title: "",
    price: 0,
    description: "",
    params: {},
};

export const useAdsEdit = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [ad, setAd] = useState<AdItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState<FormData>(defaultFormData);

    const [aiDescriptionLoading, setAiDescriptionLoading] = useState(false);
    const [aiPriceLoading, setAiPriceLoading] = useState(false);

    const [aiDescriptionResult, setAiDescriptionResult] = useState("");
    const [aiPriceResult, setAiPriceResult] = useState("");

    const [aiDescriptionMessage, setAiDescriptionMessage] = useState("");
    const [aiPriceMessage, setAiPriceMessage] = useState("");

    useEffect(() => {
        if (!id) {
            setLoading(false);
            return;
        }

        getItemById(Number(id))
            .then((res) => {
                const item = res.data;
                setAd(item);
                setFormData({
                    category: item.category,
                    title: item.title,
                    price: item.price,
                    description: item.description || "",
                    params: item.params || {},
                });
            })
            .catch((err) => {
                console.error("Ошибка загрузки объявления", err);
                setError("Не удалось загрузить объявление");
            })
            .finally(() => setLoading(false));
    }, [id]);

    useEffect(() => {
        const draft = loadDraft(id);
        if (draft) {
            setFormData(draft);
        }
    }, [id]);

    useEffect(() => {
        if (id && ad) {
            saveDraft(id, formData);
        }
    }, [formData, id, ad]);

    useEffect(() => {
        document.body.classList.add("ads-edit-page");
        return () => {
            document.body.classList.remove("ads-edit-page");
        };
    }, []);

    const setAsAd = (updated: FormData) => setFormData(updated);

    const updateField = (
        field: keyof FormData,
        value: string | number | Record<string, unknown>,
    ) => {
        setFormData((prev) => updateFormData(field, value, prev));
    };

    const updateParam = (key: string, value: string | number) => {
        setFormData((prev) => updateParams(key, value, prev));
    };

    const handleSave = async () => {
        if (!id || !ad) return;

        if (!formData.title.trim()) {
            setError("Название обязательно для заполнения");
            return;
        }
        if (!formData.category) {
            setError("Категория обязательна для заполнения");
            return;
        }
        if (formData.price <= 0) {
            setError("Цена должна быть больше 0");
            return;
        }

        setError(null);
        setSaving(true);

        try {
            await updateItem(Number(id), {
                category: formData.category,
                title: formData.title,
                price: formData.price,
                description: formData.description || undefined,
                params: formData.params,
            });

            localStorage.removeItem(`ad-draft-${id}`);
            navigate(`/ads/${id}`);
        } catch (err) {
            console.error("Ошибка сохранения", err);
            setError("Ошибка сохранения объявления");
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        navigate(`/ads/${id}`);
    };

    const handleImproveDescription = async () => {
        if (!formData.title.trim()) {
            setError("Пожалуйста, укажите название объявления перед улучшением текста");
            return;
        }

        setError(null);
        setAiDescriptionLoading(true);
        setAiPriceMessage("");

        try {
            const { result, message } = await improveDescription(formData);
            setAiDescriptionResult(result);
            setAiDescriptionMessage(message);
        } catch (err) {
            console.error("AI Improve error", err);
            setAiDescriptionResult("");
            setError(`Не удалось улучшить описание: ${err}`);
        } finally {
            setAiDescriptionLoading(false);
        }
    };

    const handleMarketPrice = async () => {
        setError(null);
        setAiPriceLoading(true);
        setAiDescriptionMessage("");

        try {
            const { result, message } = await marketPrice(formData);
            setAiPriceResult(result);
            setAiPriceMessage(message);
        } catch (err) {
            console.error("AI Price error", err);
            setAiPriceResult("");
            setError(`Не удалось получить цену: ${err}`);
        } finally {
            setAiPriceLoading(false);
        }
    };

    const handleApplyDescription = () => {
        if (!aiDescriptionResult) return;
        setFormData((prev) => ({ ...prev, description: aiDescriptionResult }));
        setAiDescriptionMessage("Описание применено.");
        setAiDescriptionResult("");
    };

    const handleApplyPrice = () => {
        if (!aiPriceResult) return;

        const { price, message } = applyPriceFromText(aiPriceResult);
        if (!price) {
            setAiPriceMessage(message);
            return;
        }

        setFormData((prev) => ({ ...prev, price }));
        setAiPriceMessage(message);
        setAiPriceResult("");
    };

    return {
        ad,
        loading,
        saving,
        error,
        formData,
        aiDescriptionLoading,
        aiPriceLoading,
        aiDescriptionMessage,
        aiPriceMessage,
        handleSave,
        handleCancel,
        handleImproveDescription,
        handleMarketPrice,
        handleApplyDescription,
        handleApplyPrice,
        setAsAd,
        updateField,
        updateParam,
    };
};
