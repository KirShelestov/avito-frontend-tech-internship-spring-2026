import {
    Container,
    Title,
    Text,
    Button,
    Group,
    Grid,
    Image,
    Box,
    Stack,
    Loader,
    Center,
    Divider,
} from "@mantine/core";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { getItemById } from "../../entities/ad/api/adApi";
import { IconPencil, IconAlertCircle } from "@tabler/icons-react";
import {
    getMissingFields,
    getCharacteristics,
} from "../../entities/ad/utils/adViewUtils";
import type { AdItem } from "../../entities/ad/types";

const formatDate = (isoString: string): string => {
    const date = new Date(isoString);
    const now = new Date();

    const day = date.getDate();
    const month = new Intl.DateTimeFormat("ru-RU", { month: "long" }).format(
        date,
    );
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    const time = `${hours}:${minutes}`;

    if (year === now.getFullYear()) {
        return `${day} ${month} ${time}`;
    }

    return `${day} ${month} ${year} ${time}`;
};

export default function AdViewPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [ad, setAd] = useState<AdItem | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) {
            setLoading(false);
            return;
        }

        getItemById(Number(id))
            .then((res) => setAd(res.data))
            .finally(() => setLoading(false));
    }, [id]);

    const missingFields = useMemo(() => {
        if (!ad) return [];
        return getMissingFields(ad);
    }, [ad]);

    const characteristics = useMemo(() => {
        if (!ad) return [];
        return getCharacteristics(ad);
    }, [ad]);

    if (loading)
        return (
            <Center h="100vh">
                <Loader />
            </Center>
        );
    if (!ad)
        return (
            <Center h="100vh">
                <Text>Не найдено</Text>
            </Center>
        );

    return (
        <Container size="lg" py="xl">
            <Group justify="space-between" align="flex-start" mb="xl">
                <Stack gap="sm">
                    <Title
                        order={1}
                        style={{
                            fontSize: 28,
                            fontWeight: 500,
                            marginBottom: 0,
                        }}
                    >
                        {ad.title}
                    </Title>
                    <Button
                        rightSection={<IconPencil size={14} />}
                        radius="md"
                        onClick={() => navigate(`/ads/${ad.id}/edit`)}
                        w="fit-content"
                    >
                        Редактировать
                    </Button>
                </Stack>

                <Stack align="flex-end" gap={2}>
                    <Title
                        order={2}
                        style={{
                            fontSize: 28,
                            fontWeight: 600,
                            marginBottom: 0,
                        }}
                    >
                        {ad.price.toLocaleString()} ₽
                    </Title>
                    <Text size="xs" c="dimmed">
                        Опубликовано: {formatDate(ad.createdAt)}
                    </Text>
                    <Text size="xs" c="dimmed">
                        Отредактировано: {formatDate(ad.updatedAt)}
                    </Text>
                </Stack>
            </Group>

            <Divider my="lg" size="xs" />

            <Grid gutter={50}>
                <Grid.Col span={7}>
                    <Box
                        style={{
                            backgroundColor: "#f8f9fa",
                            borderRadius: 4,
                            height: 420,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Image
                            src={null}
                            fallbackSrc="https://placehold.co/600x400?text=🖼️"
                            h="100%"
                            fit="contain"
                        />
                    </Box>
                </Grid.Col>

                {/* Правая колонка */}
                <Grid.Col span={5}>
                    <Stack gap="xl">
                        {ad.needsRevision && missingFields.length > 0 && (
                            <Box
                                style={{
                                    backgroundColor: "#F9F3E9",
                                    padding: "20px",
                                    borderRadius: "12px",
                                    display: "flex",
                                    gap: "12px",
                                    boxShadow:
                                        "0 1px 2px rgba(0,0,0,0.06), 0 4px 8px rgba(0,0,0,0.08)",
                                }}
                            >
                                <IconAlertCircle
                                    size={20}
                                    color="#f59f00"
                                    style={{ flexShrink: 0, marginTop: 2 }}
                                />
                                <Stack gap={4}>
                                    <Text fw={700} size="sm">
                                        Требуются доработки
                                    </Text>
                                    <Text size="xs" c="#444">
                                        У объявления не заполнены поля:
                                    </Text>
                                    <ul
                                        style={{
                                            margin: 0,
                                            paddingLeft: 18,
                                            fontSize: "12px",
                                            color: "#444",
                                        }}
                                    >
                                        {missingFields.map((field) => (
                                            <li key={field}>{field}</li>
                                        ))}
                                    </ul>
                                </Stack>
                            </Box>
                        )}

                        <Box>
                            <Title
                                order={3}
                                mb="lg"
                                style={{ fontSize: 22, fontWeight: 600 }}
                            >
                                Характеристики
                            </Title>
                            <Stack gap="sm">
                                {characteristics
                                    .filter((item) => item.value !== "—")
                                    .map((item) => (
                                        <Group
                                            key={item.label}
                                            align="flex-start"
                                            gap={0}
                                            wrap="nowrap"
                                        >
                                            <Text
                                                c="gray.6"
                                                size="sm"
                                                style={{
                                                    width: 120,
                                                    flexShrink: 0,
                                                }}
                                            >
                                                {item.label}
                                            </Text>
                                            <Text size="sm" fw={500}>
                                                {item.value}
                                            </Text>
                                        </Group>
                                    ))}
                            </Stack>
                        </Box>
                    </Stack>
                </Grid.Col>
            </Grid>

            <Box mt={60}>
                <Title
                    order={3}
                    mb="md"
                    style={{ fontSize: 22, fontWeight: 600 }}
                >
                    Описание
                </Title>
                <Text
                    size="sm"
                    style={{ lineHeight: 1.7, maxWidth: 700, color: "#222" }}
                >
                    {ad.description || "Описание не указано"}
                </Text>
            </Box>
        </Container>
    );
}
