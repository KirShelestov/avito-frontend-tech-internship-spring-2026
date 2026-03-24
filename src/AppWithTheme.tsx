import { Box } from "@mantine/core";
import { RouterProvider } from "react-router-dom";
import { useAppStore } from "./shared/stores/appStore";
import { router } from "./app/router/router";

export function AppWithTheme() {
    const theme = useAppStore((state) => state.theme);

    return (
        <Box
            style={{
                minHeight: "100vh",
                backgroundColor:
                    theme === "light"
                        ? "var(--mantine-color-gray-0)"
                        : "var(--mantine-color-gray-9)",
            }}
        >
            <RouterProvider router={router} />
        </Box>
    );
}
