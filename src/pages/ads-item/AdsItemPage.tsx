import {
    Container,
    Title,
    Text,
    Button,
    Group,
    Grid,
    Image,
    Card,
    Stack,
    Badge,
} from "@mantine/core";
import { useParams, useNavigate } from "react-router-dom";

const mockAd = {
    id: 1,
    title: "MacBook Pro 16”",
    price: 64000,
    createdAt: "10 марта 22:39",
    updatedAt: "10 марта 23:12",
    description:
        "Продаю свой MacBook Pro 16” (2021) на чипе M1 Pro. Состояние отличное, работал бережно. Мощности хватает на всё: от сложного монтажа до кода, при этом ноутбук почти не греется.",
    needsRevision: true,
    missingFields: ["Цвет", "Состояние"],
    params: {
        type: "Ноутбук",
        brand: "Apple",
        model: "M1 Pro",
    },
};

export default function AdViewPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const ad = mockAd;

    return (
        <Container size="lg" py="md">
            <Group justify="space-between" align="flex-start">
                <div>
                    <Title order={2}>{ad.title}</Title>

                    <Button mt="sm" onClick={() => navigate(`/ads/${id}/edit`)}>
                        Редактировать
                    </Button>
                </div>

                <div style={{ textAlign: "right" }}>
                    <Title order={3}>{ad.price.toLocaleString()} ₽</Title>

                    <Text size="sm" c="dimmed">
                        Опубликовано: {ad.createdAt}
                    </Text>
                    <Text size="sm" c="dimmed">
                        Отредактировано: {ad.updatedAt}
                    </Text>
                </div>
            </Group>

            <Grid mt="md">
                <Grid.Col span={6}>
                    <Image src="https://placehold.co/600x400" radius="md" />
                </Grid.Col>

                <Grid.Col span={6}>
                    <Stack>
                        {ad.needsRevision && (
                            <Card withBorder bg="yellow.0">
                                <Stack gap={5}>
                                    <Text fw={500}>Требуются доработки</Text>

                                    <Text size="sm">
                                        У объявления не заполнены поля:
                                    </Text>

                                    {ad.missingFields.map((field) => (
                                        <Badge
                                            key={field}
                                            color="yellow"
                                            variant="light"
                                        >
                                            {field}
                                        </Badge>
                                    ))}
                                </Stack>
                            </Card>
                        )}

                        <div>
                            <Title order={4} mb="sm">
                                Характеристики
                            </Title>

                            <Stack gap={4}>
                                <Text>
                                    <b>Тип:</b> {ad.params.type}
                                </Text>
                                <Text>
                                    <b>Бренд:</b> {ad.params.brand}
                                </Text>
                                <Text>
                                    <b>Модель:</b> {ad.params.model}
                                </Text>
                            </Stack>
                        </div>
                    </Stack>
                </Grid.Col>
            </Grid>

            <div style={{ marginTop: 30 }}>
                <Title order={4} mb="sm">
                    Описание
                </Title>

                <Text>{ad.description}</Text>
            </div>
        </Container>
    );
}
