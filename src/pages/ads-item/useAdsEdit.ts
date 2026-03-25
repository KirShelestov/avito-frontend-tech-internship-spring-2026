import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";import { notifications } from "@mantine/notifications";import { getItemById, updateItem } from "../../entities/ad/api/adApi";
import { improveDescription, marketPrice, applyPriceFromText, chatWithAI } from "./adsEditService";
import { loadDraft, saveDraft, clearDraft } from "./adsEditUtils";
import { useAdsEditStore, type ChatMessage } from "./adsEditStore";

const AUTOSAVE_DELAY = 1000; 

export const useAdsEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const abortControllerRef = useRef<AbortController | null>(null);
  const autosaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedDataRef = useRef<string | null>(null);

  const {
    ad,
    loading,
    saving,
    error,
    formData,
    aiDescriptionLoading,
    aiPriceLoading,
    aiDescriptionMessage,
    aiPriceMessage,
    aiDescriptionResult,
    aiPriceResult,
    chatMessages,
    chatLoading,
    hasDraft,
    setAd,
    setLoading,
    setSaving,
    setError,
    setFormData,
    updateField,
    updateParam,
    setAiDescriptionLoading,
    setAiPriceLoading,
    setAiDescriptionMessage,
    setAiPriceMessage,
    setAiDescriptionResult,
    setAiPriceResult,
    addChatMessage,
    setChatLoading,
    setHasDraft,
  } = useAdsEditStore();

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const draft = loadDraft(id);
    if (draft) {
      setFormData(draft);
      setHasDraft(true);
    }
    getItemById(Number(id))
      .then((res) => {
        const item = res.data;
        setAd(item);
        if (!draft) {
          setFormData({
            category: item.category,
            title: item.title,
            price: item.price,
            description: item.description || "",
            params: item.params || {},
          });
        }
      })
      .catch((err) => {
        console.error("Ошибка загрузки объявления", err);
        const errorMessage = "Не удалось загрузить объявление";
        setError(errorMessage);
        notifications.show({
          title: "Ошибка",
          message: errorMessage,
          color: "red",
          autoClose: 5000,
        });
      })
      .finally(() => setLoading(false));
  }, [id, setAd, setFormData, setError, setLoading, setHasDraft]);

  useEffect(() => {
    if (!id) return;

    const currentDataString = JSON.stringify(formData);
    if (currentDataString === lastSavedDataRef.current) {
      return;
    }

    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }

    autosaveTimerRef.current = setTimeout(() => {
      saveDraft(id, formData);
      lastSavedDataRef.current = currentDataString;
      console.log(`Черновик для объявления #${id} сохранен в localStorage`);
    }, AUTOSAVE_DELAY);

    return () => {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
      }
    };
  }, [formData, id]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (id && formData) {
        saveDraft(id, formData);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.body.classList.remove("ads-edit-page");
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
      }
    };
  }, [id, formData]);

  useEffect(() => {
    document.body.classList.add("ads-edit-page");
    return () => {
      document.body.classList.remove("ads-edit-page");
    };
  }, []);

  const handleSave = async () => {
    if (!id || !ad) return;

    if (!formData.title.trim()) {
      notifications.show({
        title: "Ошибка",
        message: "Название обязательно для заполнения",
        color: "red",
        autoClose: 5000,
      });
      setError("Название обязательно для заполнения");
      return;
    }
    if (!formData.category) {
      notifications.show({
        title: "Ошибка",
        message: "Категория обязательна для заполнения",
        color: "red",
        autoClose: 5000,
      });
      setError("Категория обязательна для заполнения");
      return;
    }
    if (formData.price <= 0) {
      notifications.show({
        title: "Ошибка",
        message: "Цена должна быть больше 0",
        color: "red",
        autoClose: 5000,
      });
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

      clearDraft(id);
      setHasDraft(false);
      
      // Показать успешное сохранение
      notifications.show({
        title: "Успешно!",
        message: "Объявление сохранено",
        color: "green",
        autoClose: 1000,
      });
      
      // Редирект через 1 секунду
      setTimeout(() => {
        navigate(`/ads/${id}`);
      }, 1000);
    } catch (err) {
      console.error("Ошибка сохранения", err);
      const errorMessage = "Ошибка сохранения объявления";
      setError(errorMessage);
      notifications.show({
        title: "Ошибка",
        message: errorMessage,
        color: "red",
        autoClose: 5000,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
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

    abortControllerRef.current = new AbortController();

    try {
      const { result } = await improveDescription(
        formData,
        abortControllerRef.current.signal
      );
      setAiDescriptionResult(result);
      setAiDescriptionMessage(result);
    } catch (err: unknown) {
      if (err === "AbortError") {
        console.log("Запрос описания отменён");
        return;
      }
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

    abortControllerRef.current = new AbortController();

    try {
      const { result } = await marketPrice(
        formData,
        abortControllerRef.current.signal
      );
      setAiPriceResult(result);
      setAiPriceMessage(result);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") {
        console.log("Запрос цены отменён");
        return;
      }
      console.error("AI Price error", err);
      setAiPriceResult("");
      setError(`Не удалось получить цену: ${err}`);
    } finally {
      setAiPriceLoading(false);
    }
  };

  const handleApplyDescription = () => {
    if (!aiDescriptionResult) return;
    updateField("description", aiDescriptionResult);
    setAiDescriptionMessage("");
    setAiDescriptionResult("");
  };

  const handleApplyPrice = () => {
    if (!aiPriceResult) return;

    const { price, message } = applyPriceFromText(aiPriceResult);
    if (!price) {
      setAiPriceMessage(message);
      return;
    }

    updateField("price", price);
    setAiPriceMessage("");
    setAiPriceResult("");
  };

  const handleSendChatMessage = async (messageText: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };
    addChatMessage(userMessage);

    setChatLoading(true);
    abortControllerRef.current = new AbortController();

    try {
      const response = await chatWithAI(
        messageText,
        formData,
        abortControllerRef.current.signal
      );

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response || "Не удалось получить ответ от AI",
        timestamp: new Date(),
      };
      addChatMessage(assistantMessage);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") {
        console.log("Запрос чата отменён");
        return;
      }
      console.error("Chat error", err);
      if (err instanceof Error) {
        setError(`Ошибка чата: ${err.message}`);
      } else {
        setError("Неизвестная ошибка чата");
      }
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Ошибка: ${err || "Не удалось получить ответ"}`,
        timestamp: new Date(),
      };
      addChatMessage(errorMessage);
    } finally {
      setChatLoading(false);
    }
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
    chatMessages,
    chatLoading,
    handleSendChatMessage,
    updateField,
    updateParam,
    hasDraft,
  };
};
