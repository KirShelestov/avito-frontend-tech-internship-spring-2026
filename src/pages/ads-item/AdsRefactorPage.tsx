import {
    Container,
    Title,
    Text,
    Button,
    Group,
    Stack,
    TextInput,
    Select,
    Textarea,
    NumberInput,
    Box,
    Divider,
    Loader,
    Center,
    Alert,
} from "@mantine/core";
import { IconBulb, IconX, IconAlertCircle } from "@tabler/icons-react";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getItemById, updateItem } from "../../entities/ad/api/adApi";
import type { AdItem } from "../../entities/ad/types";

type FormData = {
    category: string;
    title: string;
    price: number;
    description: string;
    params: Record<string, any>;
};

const CATEGORY_OPTIONS = [
    { value: "electronics", label: "Электроника" },
    { value: "auto", label: "Авто" },
    { value: "real_estate", label: "Недвижимость" },
];

const ELECTRONICS_TYPE_OPTIONS = [
    { value: "phone", label: "Телефон" },
    { value: "laptop", label: "Ноутбук" },
    { value: "misc", label: "Прочее" },
];

const REAL_ESTATE_TYPE_OPTIONS = [
    { value: "flat", label: "Квартира" },
    { value: "house", label: "Дом" },
    { value: "room", label: "Комната" },
];

const TRANSMISSION_OPTIONS = [
    { value: "automatic", label: "Автоматическая" },
    { value: "manual", label: "Механическая" },
];

const CONDITION_OPTIONS = [
    { value: "new", label: "Новое" },
    { value: "used", label: "Б/У" },
];

export default function AdsRefactorPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [ad, setAd] = useState<AdItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<FormData>({
        category: "",
        title: "",
        price: 0,
        description: "",
        params: {},
    });

    useEffect(() => {
        if (!id) {
            setLoading(false);
            return;
        }

        getItemById(Number(id))
            .then((res) => {
                const item = res.data;
                setAd(item);
                setFormData({
                    category: item.category,
                    title: item.title,
                    price: item.price,
                    description: item.description || "",
                    params: item.params,
                });
            })
            .catch((err) => {
                console.error("Ошибка загрузки объявления", err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    useEffect(() => {
        if (id) {
            const draftKey = `ad-draft-${id}`;
            const draft = localStorage.getItem(draftKey);
            if (draft) {
                try {
                    const parsedDraft = JSON.parse(draft);
                    setFormData(parsedDraft);
                } catch (e) {
                    console.error("Ошибка загрузки черновика", e);
                }
            }
        }
    }, [id]);

    useEffect(() => {
        if (id && ad) {
            const draftKey = `ad-draft-${id}`;
            localStorage.setItem(draftKey, JSON.stringify(formData));
        }
    }, [formData, id, ad]);

    const handleSave = async () => {
        if (!id || !ad) return;

        if (!formData.title.trim()) {
            setError("Название обязательно для заполнения");
            return;
        }
        if (!formData.category) {
            setError("Категория обязательна для заполнения");
            return;
        }
        if (formData.price <= 0) {
            setError("Цена должна быть больше 0");
            return;
        }

        if (formData.category === "auto") {
            if (!formData.params.brand?.trim()) {
                setError("Бренд обязателен для авто");
                return;
            }
            if (!formData.params.model?.trim()) {
                setError("Модель обязательна для авто");
                return;
            }
        } else if (formData.category === "real_estate") {
            if (!formData.params.type) {
                setError("Тип недвижимости обязателен");
                return;
            }
            if (!formData.params.address?.trim()) {
                setError("Адрес обязателен для недвижимости");
                return;
            }
        } else if (formData.category === "electronics") {
            if (!formData.params.type) {
                setError("Тип электроники обязателен");
                return;
            }
            if (!formData.params.brand?.trim()) {
                setError("Бренд обязателен для электроники");
                return;
            }
        }

        setError(null);
        setSaving(true);
        try {
            const updateData = {
                category: formData.category,
                title: formData.title,
                price: formData.price,
                description: formData.description || undefined,
                params: formData.params,
            };

            await updateItem(Number(id), updateData);

            localStorage.removeItem(`ad-draft-${id}`);
            navigate(`/ads/${id}`);
        } catch (err) {
            console.error("Ошибка сохранения", err);
            setError("Ошибка сохранения объявления");
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        navigate(`/ads/${id}`);
    };

    const updateFormData = (field: keyof FormData, value: any) => {
        setFormData((prev) => {
            if (field === "category" && value !== prev.category) {
                return { ...prev, [field]: value, params: {} };
            }
            return { ...prev, [field]: value };
        });
    };

    const updateParams = (key: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            params: { ...prev.params, [key]: value },
        }));
    };

    if (loading) {
        return (
            <Center h="100vh">
                <Loader />
            </Center>
        );
    }

    if (!ad) {
        return (
            <Center h="100vh">
                <Text>Объявление не найдено</Text>
            </Center>
        );
    }

    const orangeInputStyles = {
        input: {
            borderColor: "#FFD8A8",
            "&:focus": { borderColor: "#FD7E14" },
        },
    };

    const renderCharacteristics = () => {
        if (formData.category === "auto") {
            return (
                <Stack gap="xs">
                    <TextInput
                        label="Бренд"
                        value={formData.params.brand || ""}
                        onChange={(e) => updateParams("brand", e.target.value)}
                        w="100%"
                        rightSection={<IconX size={14} color="gray" />}
                    />
                    <TextInput
                        label="Модель"
                        value={formData.params.model || ""}
                        onChange={(e) => updateParams("model", e.target.value)}
                        w="100%"
                        rightSection={<IconX size={14} color="gray" />}
                    />
                    <NumberInput
                        label="Год выпуска"
                        value={formData.params.yearOfManufacture || ""}
                        onChange={(value) =>
                            updateParams("yearOfManufacture", value)
                        }
                        w="100%"
                    />
                    <Select
                        label="Коробка передач"
                        data={TRANSMISSION_OPTIONS}
                        value={formData.params.transmission || ""}
                        onChange={(value) =>
                            updateParams("transmission", value)
                        }
                        w="100%"
                    />
                    <NumberInput
                        label="Пробег"
                        value={formData.params.mileage || ""}
                        onChange={(value) => updateParams("mileage", value)}
                        w="100%"
                    />
                    <NumberInput
                        label="Мощность двигателя"
                        value={formData.params.enginePower || ""}
                        onChange={(value) => updateParams("enginePower", value)}
                        w="100%"
                    />
                </Stack>
            );
        }

        if (formData.category === "real_estate") {
            return (
                <Stack gap="xs">
                    <Select
                        label="Тип"
                        data={REAL_ESTATE_TYPE_OPTIONS}
                        value={formData.params.type || ""}
                        onChange={(value) => updateParams("type", value)}
                        w="100%"
                    />
                    <TextInput
                        label="Адрес"
                        value={formData.params.address || ""}
                        onChange={(e) =>
                            updateParams("address", e.target.value)
                        }
                        w="100%"
                        rightSection={<IconX size={14} color="gray" />}
                    />
                    <NumberInput
                        label="Площадь"
                        value={formData.params.area || ""}
                        onChange={(value) => updateParams("area", value)}
                        w="100%"
                    />
                    <NumberInput
                        label="Этаж"
                        value={formData.params.floor || ""}
                        onChange={(value) => updateParams("floor", value)}
                        w="100%"
                    />
                </Stack>
            );
        }

        if (formData.category === "electronics") {
            return (
                <Stack gap="xs">
                    <Select
                        label="Тип"
                        data={ELECTRONICS_TYPE_OPTIONS}
                        value={formData.params.type || ""}
                        onChange={(value) => updateParams("type", value)}
                        w="100%"
                    />
                    <TextInput
                        label="Бренд"
                        value={formData.params.brand || ""}
                        onChange={(e) => updateParams("brand", e.target.value)}
                        w="100%"
                        rightSection={<IconX size={14} color="gray" />}
                    />
                    <TextInput
                        label="Модель"
                        value={formData.params.model || ""}
                        onChange={(e) => updateParams("model", e.target.value)}
                        w="100%"
                        rightSection={<IconX size={14} color="gray" />}
                    />
                    <Select
                        label="Состояние"
                        data={CONDITION_OPTIONS}
                        value={formData.params.condition || ""}
                        onChange={(value) => updateParams("condition", value)}
                        w="100%"
                        styles={orangeInputStyles}
                    />
                    <TextInput
                        label="Цвет"
                        value={formData.params.color || ""}
                        onChange={(e) => updateParams("color", e.target.value)}
                        w="100%"
                        styles={orangeInputStyles}
                        rightSection={<IconX size={14} color="gray" />}
                    />
                </Stack>
            );
        }

        return null;
    };

    return (
        <Container size="md" py="xl" ml={100}>
            <Title order={2} mb="lg" fw={600}>
                Редактирование объявления
            </Title>

            {error && (
                <Alert
                    icon={<IconAlertCircle size={16} />}
                    title="Ошибка"
                    color="red"
                    mb="md"
                >
                    {error}
                </Alert>
            )}

            <Stack maw={400} gap="md">
                <Select
                    label="Категория"
                    placeholder="Выберите категорию"
                    data={CATEGORY_OPTIONS}
                    value={formData.category}
                    onChange={(value) => updateFormData("category", value)}
                    rightSectionPointerEvents="none"
                    w="100%"
                />

                <TextInput
                    label="Название"
                    placeholder="Например, MacBook Pro 16"
                    value={formData.title}
                    onChange={(e) => updateFormData("title", e.target.value)}
                    withAsterisk
                    rightSection={<IconX size={14} color="gray" />}
                    styles={{ input: { borderColor: "#339AF0" } }}
                    w="100%"
                />
            </Stack>
            <Divider my="sm" labelPosition="center" variant="dotted" />

            <Group style={{ display: "flex", alignItems: "flex-end", gap: 12 }}>
                <NumberInput
                    label="Цена"
                    placeholder="64000"
                    value={formData.price}
                    onChange={(value) => updateFormData("price", value)}
                    withAsterisk
                    rightSection={<IconX size={14} color="gray" />}
                    style={{ flex: 1, maxWidth: 400 }}
                    styles={{
                        input: { width: "100%" },
                        wrapper: { flex: 1 },
                    }}
                />
                <Box
                    style={{
                        backgroundColor: "#FFF4E6",
                        padding: "8px 12px",
                        borderRadius: "6px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                    }}
                >
                    <IconBulb size={14} color="#FD7E14" />
                    <Text size="xs" c="#FD7E14" fw={500}>
                        Узнать рыночную цену
                    </Text>
                </Box>
            </Group>

            <Divider my="sm" labelPosition="center" variant="dotted" />
            <Stack maw={400} gap="md">
                <Title order={4} mt="md">
                    Характеристики
                </Title>

                {renderCharacteristics()}
            </Stack>

            <Divider my="sm" labelPosition="center" variant="dotted" />
            <Stack>
                <Stack gap={4}>
                    <Text size="sm" fw={500}>
                        Описание
                    </Text>
                    <Textarea
                        placeholder="Опишите ваш товар..."
                        minRows={4}
                        value={formData.description}
                        onChange={(e) =>
                            updateFormData("description", e.target.value)
                        }
                    />
                    <Group justify="space-between">
                        <Box
                            style={{
                                backgroundColor: "#FFF4E6",
                                padding: "6px 10px",
                                borderRadius: "6px",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                width: "fit-content",
                            }}
                        >
                            <IconBulb size={14} color="#FD7E14" />
                            <Text size="xs" c="#FD7E14" fw={500}>
                                Улучшить описание
                            </Text>
                        </Box>
                        <Text size="xs" c="dimmed">
                            {formData.description.length} / 1000
                        </Text>
                    </Group>
                </Stack>

                <Group mt="xl">
                    <Button
                        radius="md"
                        size="md"
                        px="xl"
                        color="blue"
                        onClick={handleSave}
                        loading={saving}
                    >
                        Сохранить
                    </Button>
                    <Button
                        radius="md"
                        size="md"
                        px="xl"
                        variant="filled"
                        color="gray.3"
                        c="black"
                        onClick={handleCancel}
                    >
                        Отменить
                    </Button>
                </Group>
            </Stack>
        </Container>
    );
}
