import { ActionIcon } from "@mantine/core";
import { IconMoon, IconSun } from "@tabler/icons-react";
import { useAppStore } from "../../shared/stores/appStore";

export function ThemeToggle() {
    const theme = useAppStore((state) => state.theme);
    const toggleTheme = useAppStore((state) => state.toggleTheme);

    return (
        <ActionIcon
            onClick={toggleTheme}
            variant="default"
            size="lg"
            radius="md"
            aria-label="Toggle color scheme"
        >
            {theme === "light" ? <IconMoon size={16} /> : <IconSun size={16} />}
        </ActionIcon>
    );
}
