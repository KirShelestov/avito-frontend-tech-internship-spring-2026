import { create } from "zustand";
import type { AdItem } from "../../entities/ad/types";
import type { FormData } from "./adsEditTypes";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

type AdsEditState = {
  ad: AdItem | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  formData: FormData;
  aiDescriptionLoading: boolean;
  aiPriceLoading: boolean;
  aiDescriptionMessage: string;
  aiPriceMessage: string;
  aiDescriptionResult: string;
  aiPriceResult: string;
  chatMessages: ChatMessage[];
  chatLoading: boolean;
  setAd: (value: AdItem | null) => void;
  setLoading: (value: boolean) => void;
  setSaving: (value: boolean) => void;
  setError: (message: string | null) => void;
  setFormData: (value: FormData) => void;
  updateField: (field: keyof FormData, value: string | number | Record<string, string | number | undefined>) => void;
  updateParam: (key: string, value: string | number) => void;
  setAiDescriptionLoading: (value: boolean) => void;
  setAiPriceLoading: (value: boolean) => void;
  setAiDescriptionMessage: (value: string) => void;
  setAiPriceMessage: (value: string) => void;
  setAiDescriptionResult: (value: string) => void;
  setAiPriceResult: (value: string) => void;
  addChatMessage: (message: ChatMessage) => void;
  setChatMessages: (messages: ChatMessage[]) => void;
  setChatLoading: (value: boolean) => void;
  clearChat: () => void;
};

export const useAdsEditStore = create<AdsEditState>((set) => ({
  ad: null,
  loading: true,
  saving: false,
  error: null,
  formData: { category: "", title: "", price: 0, description: "", params: {} },
  aiDescriptionLoading: false,
  aiPriceLoading: false,
  aiDescriptionMessage: "",
  aiPriceMessage: "",
  aiDescriptionResult: "",
  aiPriceResult: "",
  chatMessages: [],
  chatLoading: false,
  setAd: (ad) => set({ ad }),
  setLoading: (loading) => set({ loading }),
  setSaving: (saving) => set({ saving }),
  setError: (error) => set({ error }),
  setFormData: (value: FormData) => set({ formData: value }),
  updateField: (field, value) => set((state) => ({
    formData: {
      ...state.formData,
      [field]: value,
      ...(field === "category" ? { params: {} } : {}),
    },
  })),
  updateParam: (key, value) => set((state) => ({
    formData: {
      ...state.formData,
      params: {
        ...state.formData.params,
        [key]: value,
      },
    },
  })),
  setAiDescriptionLoading: (aiDescriptionLoading) => set({ aiDescriptionLoading }),
  setAiPriceLoading: (aiPriceLoading) => set({ aiPriceLoading }),
  setAiDescriptionMessage: (aiDescriptionMessage) => set({ aiDescriptionMessage }),
  setAiPriceMessage: (aiPriceMessage) => set({ aiPriceMessage }),
  setAiDescriptionResult: (aiDescriptionResult) => set({ aiDescriptionResult }),
  setAiPriceResult: (aiPriceResult) => set({ aiPriceResult }),
  addChatMessage: (message) => set((state) => ({
    chatMessages: [...state.chatMessages, message],
  })),
  setChatMessages: (chatMessages) => set({ chatMessages }),
  setChatLoading: (chatLoading) => set({ chatLoading }),
  clearChat: () => set({ chatMessages: [] }),
}));

