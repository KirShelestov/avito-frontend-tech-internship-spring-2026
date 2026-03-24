import { create } from "zustand";
import { getItemById } from "./api/adApi";

type Ad = {
    id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    createdAt: string;
    updatedAt: string;
    needsRevision: boolean;
} & Record<string, unknown>;

type AdsItemState = {
    ad: Ad | null;
    loading: boolean;
    error: string | null;
    fetchAd: (id: string | number) => Promise<void>;
    setAd: (ad: Ad | null) => void;
    updateAd: (updates: Partial<Ad>) => void;
    clearError: () => void;
    reset: () => void;
};

export const useAdsItemStore = create<AdsItemState>((set) => ({
    ad: null,
    loading: false,
    error: null,

    fetchAd: async (id: string | number) => {
        set({ loading: true, error: null });
        try {
            const res = await getItemById(Number(id));
            if (res.data) {
                set({ ad: res.data });
            } else {
                set({ error: "Объявление не найдено" });
            }
        } catch (error) {
            set({ error: "Ошибка загрузки объявления" });
            console.error("Failed to fetch ad:", error);
        } finally {
            set({ loading: false });
        }
    },

    setAd: (ad) => set({ ad }),

    updateAd: (updates) =>
        set((state) => ({
            ad: state.ad ? { ...state.ad, ...updates } : null,
        })),

    clearError: () => set({ error: null }),

    reset: () => set({ ad: null, loading: false, error: null }),
}));
