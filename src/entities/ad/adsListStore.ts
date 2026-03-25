import { create } from "zustand";
import { getItems } from "./api/adApi";
import type { AdItem } from "./types";

type AdsListFilters = {
    search: string;
    onlyRevision: boolean;
    categories: string[];
    page: number;
    sortColumn: "createdAt" | "price" | "title";
    sortDirection: "asc" | "desc";
    gridView: boolean;
};

type AdsListState = {
    ads: AdItem[];
    total: number;
    loading: boolean;
    filters: AdsListFilters;
    setAds: (ads: AdItem[]) => void;
    setTotal: (total: number) => void;
    setLoading: (loading: boolean) => void;
    setFilters: (filters: Partial<AdsListFilters>) => void;
    updateFilters: (filters: Partial<AdsListFilters>) => Promise<void>;
    setPage: (page: number) => void;
    updatePage: (page: number) => Promise<void>;
    fetchAds: () => Promise<void>;
    resetFilters: () => void;
};

const defaultFilters: AdsListFilters = {
    search: "",
    onlyRevision: false,
    categories: [],
    page: 1,
    sortColumn: "createdAt",
    sortDirection: "desc",
    gridView: true,
};

export const useAdsListStore = create<AdsListState>((set, get) => ({
    ads: [],
    total: 0,
    loading: false,
    filters: defaultFilters,

    setAds: (ads) => set({ ads }),
    setTotal: (total) => set({ total }),
    setLoading: (loading) => set({ loading }),

    setFilters: (newFilters) =>
        set((state) => ({
            filters: { ...state.filters, ...newFilters },
        })),

    updateFilters: async (newFilters) => {
        const { setFilters, fetchAds } = get();
        setFilters(newFilters);
        await fetchAds();
    },

    setPage: (page) =>
        set((state) => ({
            filters: { ...state.filters, page },
        })),

    updatePage: async (page) => {
        const { setPage, fetchAds } = get();
        setPage(page);
        await fetchAds();
    },

    fetchAds: async () => {
        const { filters, setAds, setTotal, setLoading } = get();
        try {
            setLoading(true);
            const res = await getItems({
                q: filters.search || undefined,
                skip: (filters.page - 1) * 10,
                needsRevision: filters.onlyRevision || undefined,
                categories: filters.categories.length
                    ? filters.categories.join(",")
                    : undefined,
                sortColumn: filters.sortColumn === "price" ? undefined : filters.sortColumn,
                sortDirection: filters.sortColumn === "price" ? undefined : filters.sortDirection,
            });
            let items = res.data.items;
            if (filters.sortColumn === "price") {
                items = items.sort((a: AdItem, b: AdItem) =>
                    filters.sortDirection === "asc" ? a.price - b.price : b.price - a.price,
                );
            }
            setAds(items);
            setTotal(res.data.total);
        } catch (error) {
            console.error("Failed to fetch ads:", error);
        } finally {
            setLoading(false);
        }
    },

    resetFilters: () => set({ filters: defaultFilters }),
}));
