import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
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
            <Notifications position="top-right" />
            <AppWithTheme />
        </MantineProvider>
    );
}
