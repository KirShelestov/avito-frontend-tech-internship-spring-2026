import { Popover, Stack, Text, Group, Button } from "@mantine/core";
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
        setOpened(false);
        await onRequest();
    };

    return (
        <Popover
            opened={opened}
            onChange={setOpened}
            position="top"
            withArrow
            shadow="md"
            width={320}
        >
            <Popover.Target>
                <div onClick={handleClick} style={{ cursor: "pointer" }}>
                    {children}
                </div>
            </Popover.Target>

            <Popover.Dropdown>
                <Stack>
                    <Text fw={600}>Ответ AI:</Text>

                    <Text size="sm">{message}</Text>

                    <Group>
                        {onApply && (
                            <Button
                                size="xs"
                                onClick={() => {
                                    onApply();
                                    setOpened(false);
                                }}
                            >
                                Применить
                            </Button>
                        )}

                        <Button
                            size="xs"
                            variant="light"
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
