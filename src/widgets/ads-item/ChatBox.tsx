import {
    Box,
    Stack,
    TextInput,
    Button,
    Group,
    Text,
    ScrollArea,
    Badge,
    Loader,
    Center,
} from "@mantine/core";
import { IconSend } from "@tabler/icons-react";
import { useState, useRef, useEffect } from "react";

export type ChatMessage = {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
};

type ChatBoxProps = {
    messages: ChatMessage[];
    loading: boolean;
    onSendMessage: (message: string) => Promise<void>;
};

export function ChatBox({ messages, loading, onSendMessage }: ChatBoxProps) {
    const [input, setInput] = useState("");
    const [isSending, setIsSending] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            const scrollElement = scrollRef.current.querySelector(
                "[data-radix-scroll-area-viewport]",
            );
            if (scrollElement) {
                scrollElement.scrollTop = scrollElement.scrollHeight;
            }
        }
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const messageText = input;
        setInput("");
        setIsSending(true);

        try {
            await onSendMessage(messageText);
        } catch (error) {
            console.error("Ошибка отправки сообщения", error);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <Box
            style={{
                border: "2px solid #E0E0E0",
                borderRadius: "12px",
                display: "flex",
                flexDirection: "column",
                height: "500px",
                backgroundColor: "#FAFAFA",
            }}
        >
            {/* Заголовок */}
            <Box
                style={{
                    padding: "12px 16px",
                    borderBottom: "1px solid #E0E0E0",
                    backgroundColor: "#F5F5F5",
                }}
            >
                <Text fw={600} size="sm" c="blue">
                    💬 Чат с AI
                </Text>
            </Box>

            <ScrollArea
                style={{ flex: 1, padding: "12px" }}
                ref={scrollRef}
                type="auto"
            >
                <Stack gap="xs">
                    {messages.length === 0 && (
                        <Center style={{ height: "200px" }}>
                            <Text size="sm" c="dimmed" ta="center">
                                Задайте вопрос о объявлении.
                                <br />
                                Контекст передаётся автоматически.
                            </Text>
                        </Center>
                    )}

                    {messages.map((msg) => (
                        <Box
                            key={msg.id}
                            style={{
                                display: "flex",
                                justifyContent:
                                    msg.role === "user"
                                        ? "flex-end"
                                        : "flex-start",
                            }}
                        >
                            <Box
                                style={{
                                    maxWidth: "80%",
                                    padding: "8px 12px",
                                    borderRadius: "8px",
                                    backgroundColor:
                                        msg.role === "user"
                                            ? "#1C75DB"
                                            : "#E8E8E8",
                                    color:
                                        msg.role === "user" ? "white" : "black",
                                    wordBreak: "break-word",
                                    lineHeight: 1.5,
                                }}
                            >
                                <Text
                                    size="sm"
                                    style={{ whiteSpace: "pre-wrap" }}
                                >
                                    {msg.content}
                                </Text>
                                <Text
                                    size="xs"
                                    c={
                                        msg.role === "user"
                                            ? "rgba(255,255,255,0.7)"
                                            : "dimmed"
                                    }
                                    mt="4px"
                                >
                                    {msg.timestamp.toLocaleTimeString("ru-RU", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </Text>
                            </Box>
                        </Box>
                    ))}

                    {loading && (
                        <Box
                            style={{
                                display: "flex",
                                justifyContent: "flex-start",
                            }}
                        >
                            <Box
                                style={{
                                    padding: "8px 12px",
                                    borderRadius: "8px",
                                    backgroundColor: "#E8E8E8",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                }}
                            >
                                <Loader size={14} />
                                <Text size="sm" c="dimmed">
                                    AI печатает...
                                </Text>
                            </Box>
                        </Box>
                    )}
                </Stack>
            </ScrollArea>

            <Box
                style={{
                    borderTop: "1px solid #E0E0E0",
                    padding: "12px",
                    backgroundColor: "white",
                }}
            >
                <form onSubmit={handleSendMessage}>
                    <Group gap="xs">
                        <TextInput
                            placeholder="Задайте вопрос о объявлении..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={isSending || loading}
                            style={{ flex: 1 }}
                            radius={8}
                        />
                        <Button
                            size="sm"
                            rightSection={<IconSend size={14} />}
                            onClick={handleSendMessage}
                            disabled={!input.trim() || isSending || loading}
                            color="blue"
                            type="submit"
                        >
                            Отправить
                        </Button>
                    </Group>
                </form>
            </Box>
        </Box>
    );
}
