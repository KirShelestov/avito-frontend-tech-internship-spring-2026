import { MantineProvider } from "@mantine/core";
import { useAppStore } from "./shared/stores/appStore";
import { AppWithTheme } from "./AppWithTheme";

export function App() {
    const theme = useAppStore((state) => state.theme);

    return (
        <MantineProvider
            theme={{
                primaryColor: "blue",
            }}
            forceColorScheme={theme}
        >
            <AppWithTheme />
        </MantineProvider>
    );
}
