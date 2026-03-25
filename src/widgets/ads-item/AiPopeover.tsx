import {
    Popover,
    Stack,
    Text,
    Group,
    Button,
    Divider,
    Box,
    Badge,
} from "@mantine/core";
import { useState, ReactNode, useEffect } from "react";

type Props = {
    children: ReactNode;
    onRequest: () => Promise<void> | void;
    loading: boolean;
    message: string;
    originalText?: string;
    onApply?: () => void;
};

const calculateDifferences = (original: string, improved: string) => {
    const originalWords = original.split(/\s+/);
    const improvedWords = improved.split(/\s+/);

    const maxLen = Math.max(originalWords.length, improvedWords.length);
    const differences: {
        type: "added" | "removed" | "same";
        text: string;
    }[] = [];

    for (let i = 0; i < maxLen; i++) {
        const origWord = originalWords[i] || "";
        const impWord = improvedWords[i] || "";

        if (!origWord && impWord) {
            differences.push({ type: "added", text: impWord });
        } else if (origWord && !impWord) {
            differences.push({ type: "removed", text: origWord });
        } else if (origWord !== impWord) {
            differences.push({ type: "removed", text: origWord });
            differences.push({ type: "added", text: impWord });
        } else {
            differences.push({ type: "same", text: origWord });
        }
    }

    return differences;
};

export function AiPopover({
    children,
    onRequest,
    loading,
    message,
    originalText = "",
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

    const differences = originalText
        ? calculateDifferences(originalText, message)
        : [];
    const hasChanges = differences.some((d) => d.type !== "same");

    return (
        <Popover
            opened={opened}
            onChange={setOpened}
            position="top"
            withArrow
            shadow="md"
            width={450}
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

                    {originalText && hasChanges && (
                        <Box>
                            <Group mb="md" justify="space-between">
                                <Badge size="lg" variant="light" color="gray">
                                    Было
                                </Badge>
                                <Badge size="lg" variant="light" color="blue">
                                    Стало
                                </Badge>
                            </Group>

                            <Group grow mb="md">
                                <Box
                                    style={{
                                        padding: "8px",
                                        backgroundColor: "#F5F5F5",
                                        borderRadius: "6px",
                                        maxHeight: 150,
                                        overflowY: "auto",
                                        lineHeight: 1.6,
                                        fontSize: "12px",
                                    }}
                                >
                                    <Text
                                        size="xs"
                                        style={{ whiteSpace: "pre-wrap" }}
                                    >
                                        {originalText}
                                    </Text>
                                </Box>

                                <Box
                                    style={{
                                        padding: "8px",
                                        backgroundColor: "#F0F9FF",
                                        borderRadius: "6px",
                                        maxHeight: 150,
                                        overflowY: "auto",
                                        lineHeight: 1.6,
                                        fontSize: "12px",
                                    }}
                                >
                                    <Text size="xs">
                                        {differences.map((d, idx) => (
                                            <span
                                                key={idx}
                                                style={{
                                                    backgroundColor:
                                                        d.type === "added"
                                                            ? "#C6F6D5"
                                                            : d.type ===
                                                                "removed"
                                                              ? "#FED7D7"
                                                              : "transparent",
                                                    textDecoration:
                                                        d.type === "removed"
                                                            ? "line-through"
                                                            : "none",
                                                    fontWeight:
                                                        d.type !== "same"
                                                            ? "600"
                                                            : "400",
                                                    marginRight: "2px",
                                                }}
                                            >
                                                {d.text}{" "}
                                            </span>
                                        ))}
                                    </Text>
                                </Box>
                            </Group>

                            <Divider />
                        </Box>
                    )}

                    {!originalText && (
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
                    )}

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
