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
import {
    IconBulb,
    IconCircleXFilled,
    IconAlertCircle,
    IconChevronUp,
    IconChevronDown,
} from "@tabler/icons-react";
import { useState } from "react";
import { AiPopover } from "../../widgets/ads-item/AiPopeover";
import { useAdsEdit } from "./useAdsEdit";
import type { FormData } from "./adsEditTypes";

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
    const {
        ad,
        loading,
        saving,
        error,
        formData,
        aiDescriptionLoading,
        aiPriceLoading,
        aiDescriptionMessage,
        aiPriceMessage,
        handleSave,
        handleCancel,
        handleImproveDescription,
        handleMarketPrice,
        handleApplyDescription,
        handleApplyPrice,
        updateField,
        updateParam,
    } = useAdsEdit();

    const [openedCondition, setOpenedCondition] = useState(false);
    const [openedType, setOpenedType] = useState(false);
    const [openedCategory, setOpenedCategory] = useState(false);

    const onInputChange = (
        field: keyof FormData,
        value: string | number | Record<string, string | number | undefined>,
    ) => {
        updateField(field, value);
    };

    const onParamChange = (key: string, value: string | number) => {
        updateParam(key, value);
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

    const renderCharacteristics = () => {
        if (formData.category === "auto") {
            return (
                <Stack gap="xs">
                    <TextInput
                        radius={8}
                        label="Бренд"
                        value={String(formData.params.brand || "")}
                        onChange={(e) => onParamChange("brand", e.target.value)}
                        w="100%"
                        rightSection={
                            <IconCircleXFilled size={14} color="#D9D9D9" />
                        }
                        styles={(theme, props) => {
                            const isEmpty =
                                !props.value ||
                                (typeof props.value === "string" &&
                                    props.value.trim() === "");
                            return {
                                input: {
                                    border: `2px solid ${isEmpty ? "var(--mantine-color-orange-6)" : "var(--mantine-color-gray-4)"}`,
                                    "&:focus": {
                                        borderColor:
                                            "var(--mantine-color-blue-6)",
                                    },
                                },
                            };
                        }}
                    />
                    <TextInput
                        radius={8}
                        label="Модель"
                        value={String(formData.params.model || "")}
                        onChange={(e) => onParamChange("model", e.target.value)}
                        w="100%"
                        rightSection={
                            <IconCircleXFilled size={14} color="#D9D9D9" />
                        }
                        styles={(theme, props) => {
                            const isEmpty =
                                !props.value ||
                                (typeof props.value === "string" &&
                                    props.value.trim() === "");
                            return {
                                input: {
                                    border: `2px solid ${isEmpty ? "var(--mantine-color-orange-6)" : "var(--mantine-color-gray-4)"}`,
                                    "&:focus": {
                                        borderColor:
                                            "var(--mantine-color-blue-6)",
                                    },
                                },
                            };
                        }}
                    />
                    <NumberInput
                        radius={8}
                        label="Год выпуска"
                        value={formData.params.yearOfManufacture || undefined}
                        onChange={(value) =>
                            value != null &&
                            onParamChange("yearOfManufacture", value)
                        }
                        w="100%"
                        styles={(theme, props) => {
                            const isEmpty =
                                !props.value ||
                                (typeof props.value === "string" &&
                                    props.value.trim() === "");
                            return {
                                input: {
                                    border: `2px solid ${isEmpty ? "var(--mantine-color-orange-6)" : "var(--mantine-color-gray-4)"}`,
                                    "&:focus": {
                                        borderColor:
                                            "var(--mantine-color-blue-6)",
                                    },
                                },
                            };
                        }}
                    />
                    <Select
                        radius={8}
                        label="Коробка передач"
                        data={TRANSMISSION_OPTIONS}
                        value={(formData.params.transmission as string) || ""}
                        onChange={(value) =>
                            value != null &&
                            onParamChange("transmission", value)
                        }
                        w="100%"
                        styles={(theme, props) => {
                            const isEmpty =
                                !props.value ||
                                (typeof props.value === "string" &&
                                    props.value.trim() === "");
                            return {
                                input: {
                                    border: `2px solid ${isEmpty ? "var(--mantine-color-orange-6)" : "var(--mantine-color-gray-4)"}`,
                                    "&:focus": {
                                        borderColor:
                                            "var(--mantine-color-blue-6)",
                                    },
                                },
                            };
                        }}
                    />
                    <NumberInput
                        radius={8}
                        label="Пробег"
                        value={formData.params.mileage || undefined}
                        onChange={(value) =>
                            value != null && onParamChange("mileage", value)
                        }
                        w="100%"
                        styles={(theme, props) => {
                            const isEmpty =
                                !props.value ||
                                (typeof props.value === "string" &&
                                    props.value.trim() === "");
                            return {
                                input: {
                                    border: `2px solid ${isEmpty ? "var(--mantine-color-orange-6)" : "var(--mantine-color-gray-4)"}`,
                                    "&:focus": {
                                        borderColor:
                                            "var(--mantine-color-blue-6)",
                                    },
                                },
                            };
                        }}
                    />
                    <NumberInput
                        radius={8}
                        label="Мощность двигателя"
                        value={formData.params.enginePower || undefined}
                        onChange={(value) =>
                            value != null && onParamChange("enginePower", value)
                        }
                        w="100%"
                        styles={(theme, props) => {
                            const isEmpty = props.value == null;
                            return {
                                input: {
                                    border: `2px solid ${isEmpty ? "var(--mantine-color-orange-6)" : "var(--mantine-color-gray-4)"}`,
                                    "&:focus": {
                                        borderColor:
                                            "var(--mantine-color-blue-6)",
                                    },
                                },
                            };
                        }}
                    />
                </Stack>
            );
        }

        if (formData.category === "real_estate") {
            return (
                <Stack gap="xs">
                    <Select
                        radius={8}
                        label="Тип"
                        data={REAL_ESTATE_TYPE_OPTIONS}
                        value={(formData.params.type as string) || ""}
                        onChange={(value) =>
                            value != null && onParamChange("type", value)
                        }
                        w="100%"
                        styles={(theme, props) => {
                            const isEmpty =
                                !props.value ||
                                (typeof props.value === "string" &&
                                    props.value.trim() === "");
                            return {
                                input: {
                                    border: `2px solid ${isEmpty ? "var(--mantine-color-orange-6)" : "var(--mantine-color-gray-4)"}`,
                                    "&:focus": {
                                        borderColor:
                                            "var(--mantine-color-blue-6)",
                                    },
                                },
                            };
                        }}
                    />
                    <TextInput
                        radius={8}
                        label="Адрес"
                        value={String(formData.params.address || "")}
                        onChange={(e) =>
                            onParamChange("address", e.target.value)
                        }
                        w="100%"
                        rightSection={
                            <IconCircleXFilled size={14} color="#D9D9D9" />
                        }
                        styles={(theme, props) => {
                            const isEmpty =
                                !props.value ||
                                (typeof props.value === "string" &&
                                    props.value.trim() === "");
                            return {
                                input: {
                                    border: `2px solid ${isEmpty ? "var(--mantine-color-orange-6)" : "var(--mantine-color-gray-4)"}`,
                                    "&:focus": {
                                        borderColor:
                                            "var(--mantine-color-blue-6)",
                                    },
                                },
                            };
                        }}
                    />
                    <NumberInput
                        radius={8}
                        label="Площадь"
                        value={formData.params.area || undefined}
                        onChange={(value) =>
                            value != null && onParamChange("area", value)
                        }
                        w="100%"
                        styles={(theme, props) => {
                            const isEmpty = props.value == null;
                            return {
                                input: {
                                    border: `2px solid ${isEmpty ? "var(--mantine-color-orange-6)" : "var(--mantine-color-gray-4)"}`,
                                    "&:focus": {
                                        borderColor:
                                            "var(--mantine-color-blue-6)",
                                    },
                                },
                            };
                        }}
                    />
                    <NumberInput
                        radius={8}
                        label="Этаж"
                        value={formData.params.floor || undefined}
                        onChange={(value) =>
                            value != null && onParamChange("floor", value)
                        }
                        w="100%"
                        styles={(theme, props) => {
                            const isEmpty = props.value == null;
                            return {
                                input: {
                                    border: `2px solid ${isEmpty ? "var(--mantine-color-orange-6)" : "var(--mantine-color-gray-4)"}`,
                                    "&:focus": {
                                        borderColor:
                                            "var(--mantine-color-blue-6)",
                                    },
                                },
                            };
                        }}
                    />
                </Stack>
            );
        }

        if (formData.category === "electronics") {
            return (
                <Stack gap="xs">
                    <Select
                        radius={8}
                        label="Тип"
                        data={ELECTRONICS_TYPE_OPTIONS}
                        value={(formData.params.type as string) || ""}
                        onChange={(value) =>
                            value != null && onParamChange("type", value)
                        }
                        w="100%"
                        onDropdownOpen={() => setOpenedType(true)}
                        onDropdownClose={() => setOpenedType(false)}
                        rightSection={
                            openedType ? (
                                <IconChevronUp size={16} />
                            ) : (
                                <IconChevronDown size={16} />
                            )
                        }
                        rightSectionPointerEvents="none"
                        styles={(theme, props) => {
                            const isEmpty =
                                !props.value ||
                                (typeof props.value === "string" &&
                                    props.value.trim() === "");
                            return {
                                input: {
                                    border: `2px solid ${isEmpty ? "var(--mantine-color-orange-6)" : "var(--mantine-color-gray-4)"}`,
                                    "&:focus": {
                                        borderColor:
                                            "var(--mantine-color-blue-6)",
                                    },
                                },
                            };
                        }}
                    />
                    <TextInput
                        radius={8}
                        label="Бренд"
                        value={String(formData.params.brand || "")}
                        onChange={(e) => onParamChange("brand", e.target.value)}
                        w="100%"
                        rightSection={
                            <IconCircleXFilled size={14} color="#D9D9D9" />
                        }
                        styles={(theme, props) => {
                            const isEmpty =
                                !props.value ||
                                (typeof props.value === "string" &&
                                    props.value.trim() === "");
                            return {
                                input: {
                                    border: `2px solid ${isEmpty ? "var(--mantine-color-orange-6)" : "var(--mantine-color-gray-4)"}`,
                                    "&:focus": {
                                        borderColor:
                                            "var(--mantine-color-blue-6)",
                                    },
                                },
                            };
                        }}
                    />
                    <TextInput
                        radius={8}
                        label="Модель"
                        value={String(formData.params.model || "")}
                        onChange={(e) => onParamChange("model", e.target.value)}
                        w="100%"
                        rightSection={
                            <IconCircleXFilled size={14} color="#D9D9D9" />
                        }
                        styles={(theme, props) => {
                            const isEmpty =
                                !props.value ||
                                (typeof props.value === "string" &&
                                    props.value.trim() === "");
                            return {
                                input: {
                                    border: `2px solid ${isEmpty ? "var(--mantine-color-orange-6)" : "var(--mantine-color-gray-4)"}`,
                                    "&:focus": {
                                        borderColor:
                                            "var(--mantine-color-blue-6)",
                                    },
                                },
                            };
                        }}
                    />
                    <TextInput
                        radius={8}
                        label="Цвет"
                        value={String(formData.params.color || "")}
                        onChange={(e) => onParamChange("color", e.target.value)}
                        w="100%"
                        rightSection={
                            <IconCircleXFilled size={14} color="#D9D9D9" />
                        }
                        styles={(theme, props) => {
                            const isEmpty =
                                !props.value ||
                                (typeof props.value === "string" &&
                                    props.value.trim() === "");
                            return {
                                input: {
                                    border: `2px solid ${isEmpty ? "var(--mantine-color-orange-6)" : "var(--mantine-color-gray-4)"}`,
                                    "&:focus": {
                                        borderColor:
                                            "var(--mantine-color-blue-6)",
                                    },
                                },
                            };
                        }}
                    />
                    <Select
                        radius={8}
                        label="Состояние"
                        data={CONDITION_OPTIONS}
                        value={String(formData.params.condition || "")}
                        onChange={(value) =>
                            value != null && onParamChange("condition", value)
                        }
                        w="100%"
                        onDropdownOpen={() => setOpenedCondition(true)}
                        onDropdownClose={() => setOpenedCondition(false)}
                        rightSection={
                            openedCondition ? (
                                <IconChevronUp size={16} />
                            ) : (
                                <IconChevronDown size={16} />
                            )
                        }
                        rightSectionPointerEvents="none"
                        styles={(theme, props) => {
                            const isEmpty =
                                !props.value ||
                                (typeof props.value === "string" &&
                                    props.value.trim() === "");
                            return {
                                input: {
                                    border: `2px solid ${isEmpty ? "var(--mantine-color-orange-6)" : "var(--mantine-color-gray-4)"}`,
                                    "&:focus": {
                                        borderColor:
                                            "var(--mantine-color-blue-6)",
                                    },
                                },
                            };
                        }}
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
                    radius={8}
                    styles={(theme, props) => {
                        const isEmpty =
                            !props.value ||
                            (typeof props.value === "string" &&
                                props.value.trim() === "");
                        return {
                            input: {
                                border: `2px solid ${isEmpty ? "var(--mantine-color-orange-6)" : "var(--mantine-color-gray-4)"}`,
                                "&:focus": {
                                    borderColor: "var(--mantine-color-blue-6)",
                                },
                            },
                        };
                    }}
                    label="Категория"
                    placeholder="Выберите категорию"
                    data={CATEGORY_OPTIONS}
                    value={formData.category}
                    onChange={(value) =>
                        value != null && onInputChange("category", value)
                    }
                    rightSectionPointerEvents="none"
                    w="100%"
                    onDropdownOpen={() => setOpenedCategory(true)}
                    onDropdownClose={() => setOpenedCategory(false)}
                    rightSection={
                        openedCategory ? (
                            <IconChevronUp size={16} />
                        ) : (
                            <IconChevronDown size={16} />
                        )
                    }
                />
                <TextInput
                    radius={8}
                    label="Название"
                    placeholder="Например, MacBook Pro 16"
                    value={formData.title}
                    onChange={(e) => onInputChange("title", e.target.value)}
                    withAsterisk
                    rightSection={
                        <IconCircleXFilled size={14} color="#D9D9D9" />
                    }
                    w="100%"
                    styles={(theme, props) => {
                        const isEmpty =
                            !props.value ||
                            (typeof props.value === "string" &&
                                props.value.trim() === "");
                        return {
                            input: {
                                border: `2px solid ${isEmpty ? "var(--mantine-color-orange-6)" : "var(--mantine-color-gray-4)"}`,
                                "&:focus": {
                                    borderColor: "var(--mantine-color-blue-6)",
                                },
                            },
                        };
                    }}
                />
            </Stack>

            <Divider my="sm" labelPosition="center" variant="dotted" />

            <Group style={{ display: "flex", alignItems: "flex-end", gap: 12 }}>
                <NumberInput
                    radius={8}
                    label="Цена"
                    placeholder="64000"
                    value={formData.price}
                    onChange={(value) =>
                        value != null && onInputChange("price", value)
                    }
                    withAsterisk
                    rightSection={
                        <IconCircleXFilled size={14} color="#D9D9D9" />
                    }
                    style={{ flex: 1, maxWidth: 400 }}
                    styles={(theme, props) => {
                        const isEmpty = props.value == null;
                        return {
                            input: {
                                width: "100%",
                                border: `2px solid ${isEmpty ? "var(--mantine-color-orange-6)" : "var(--mantine-color-gray-4)"}`,
                                "&:focus": {
                                    borderColor: "var(--mantine-color-blue-6)",
                                },
                            },
                            wrapper: { flex: 1 },
                        };
                    }}
                />
                <AiPopover
                    onRequest={handleMarketPrice}
                    loading={aiPriceLoading}
                    message={aiPriceMessage}
                    onApply={handleApplyPrice}
                >
                    <Box
                        style={{
                            backgroundColor: aiPriceLoading
                                ? "#EDF2FF"
                                : "#FFF4E6",
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
                            {aiPriceLoading
                                ? "Запрос цены..."
                                : "Узнать рыночную цену"}
                        </Text>
                    </Box>
                </AiPopover>
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
                <Stack gap={8}>
                    <Text size="sm" fw={500}>
                        Описание
                    </Text>
                    <Textarea
                        radius={12}
                        placeholder="Опишите ваш товар..."
                        minRows={4}
                        value={formData.description}
                        onChange={(e) =>
                            onInputChange("description", e.target.value)
                        }
                        styles={(theme, props) => {
                            const isEmpty =
                                !props.value ||
                                (typeof props.value === "string" &&
                                    props.value.trim() === "");
                            return {
                                input: {
                                    border: `2px solid ${isEmpty ? "var(--mantine-color-orange-6)" : "var(--mantine-color-gray-4)"}`,
                                    "&:focus": {
                                        borderColor:
                                            "var(--mantine-color-blue-6)",
                                    },
                                },
                            };
                        }}
                    />
                    <Group justify="space-between">
                        <AiPopover
                            onRequest={handleImproveDescription}
                            loading={aiDescriptionLoading}
                            message={aiDescriptionMessage}
                            onApply={handleApplyDescription}
                        >
                            <Box
                                style={{
                                    backgroundColor: aiDescriptionLoading
                                        ? "#EDF2FF"
                                        : "#FFF4E6",
                                    padding: "6px 10px",
                                    borderRadius: "6px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    width: "fit-content",
                                    cursor: "pointer",
                                }}
                            >
                                <IconBulb size={14} color="#FD7E14" />
                                <Text size="xs" c="#FD7E14" fw={500}>
                                    {aiDescriptionLoading
                                        ? "Генерация описания..."
                                        : "Улучшить описание"}
                                </Text>
                            </Box>
                        </AiPopover>
                        <Text size="xs" c="dimmed">
                            {formData.description.length} / 1000
                        </Text>
                    </Group>
                    {aiDescriptionMessage && (
                        <Text size="xs" c="teal" mt="xs">
                            {aiDescriptionMessage}
                        </Text>
                    )}
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
                        color="#D9D9D9"
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
