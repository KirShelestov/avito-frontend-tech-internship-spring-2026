import { create } from "zustand";
import { persist } from "zustand/middleware";

type Notification = {
    id: string;
    message: string;
    type: "success" | "error" | "warning" | "info";
};

type AppState = {
    theme: "light" | "dark";
    setTheme: (theme: "light" | "dark") => void;
    toggleTheme: () => void;
    notifications: Notification[];
    addNotification: (message: string, type?: Notification["type"]) => void;
    removeNotification: (id: string) => void;
    clearNotifications: () => void;
    modals: Record<string, boolean>;
    openModal: (name: string) => void;
    closeModal: (name: string) => void;
};

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            theme: "light",

            setTheme: (theme) => set({ theme }),

            toggleTheme: () => {
                const current = get().theme;
                set({ theme: current === "light" ? "dark" : "light" });
            },

            notifications: [],

            addNotification: (message, type = "info") => {
                const id = Math.random().toString(36).substr(2, 9);
                set((state) => ({
                    notifications: [
                        ...state.notifications,
                        { id, message, type },
                    ],
                }));

                setTimeout(() => {
                    get().removeNotification(id);
                }, 5000);
            },

            removeNotification: (id) => {
                set((state) => ({
                    notifications: state.notifications.filter((n) => n.id !== id),
                }));
            },

            clearNotifications: () => set({ notifications: [] }),

            modals: {},

            openModal: (name) =>
                set((state) => ({
                    modals: { ...state.modals, [name]: true },
                })),

            closeModal: (name) =>
                set((state) => ({
                    modals: { ...state.modals, [name]: false },
                })),
        }),
        {
            name: "app-store",
            partialize: (state) => ({
                theme: state.theme,
            }),
        },
    ),
);
