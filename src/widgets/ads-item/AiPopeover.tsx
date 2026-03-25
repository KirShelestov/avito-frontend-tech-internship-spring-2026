import {
    Popover,
    Stack,
    Text,
    Group,
    Button,
    Divider,
    Box,
} from "@mantine/core";
import { useState, ReactNode, useEffect } from "react";

type Props = {
    children: ReactNode;
    onRequest: () => Promise<void> | void;
    loading: boolean;
    message: string;
    onApply?: () => void;
};

export function AiPopover({
    children,
    onRequest,
    loading,
    message,
    onApply,
}: Props) {
    const [opened, setOpened] = useState(false);

    useEffect(() => {
        if (!loading && message) {
            setOpened(true);
        }
    }, [loading, message]);

    const handleClick = async () => {
        setOpened(true);
        await onRequest();
    };

    return (
        <Popover
            opened={opened}
            onChange={setOpened}
            position="top"
            withArrow
            shadow="md"
            width={350}
        >
            <Popover.Target>
                <div onClick={handleClick} style={{ cursor: "pointer" }}>
                    {children}
                </div>
            </Popover.Target>

            <Popover.Dropdown>
                <Stack gap="md">
                    <Box>
                        <Text fw={700} size="sm" c="blue" mb="xs">
                            Ответ AI:
                        </Text>
                        <Divider />
                    </Box>

                    <Box
                        style={{
                            maxHeight: 250,
                            overflowY: "auto",
                            lineHeight: 1.6,
                        }}
                    >
                        <Text size="sm" style={{ whiteSpace: "pre-wrap" }}>
                            {message}
                        </Text>
                    </Box>

                    <Group justify="flex-end" gap="xs">
                        {onApply && (
                            <Button
                                size="sm"
                                onClick={() => {
                                    onApply();
                                    setOpened(false);
                                }}
                                color="blue"
                            >
                                Применить
                            </Button>
                        )}

                        <Button
                            size="sm"
                            variant="light"
                            color="gray"
                            onClick={() => setOpened(false)}
                        >
                            Закрыть
                        </Button>
                    </Group>
                </Stack>
            </Popover.Dropdown>
        </Popover>
    );
}
