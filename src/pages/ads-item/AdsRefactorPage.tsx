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
    Grid,
} from "@mantine/core";
import {
    IconBulb,
    IconCircleXFilled,
    IconAlertCircle,
    IconChevronUp,
    IconChevronDown,
    IconReload,
} from "@tabler/icons-react";
import { useState } from "react";
import { AiPopover } from "../../widgets/ads-item/AiPopeover";
import { ChatBox } from "../../widgets/ads-item/ChatBox";
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
        chatMessages,
        chatLoading,
        handleSave,
        handleCancel,
        handleImproveDescription,
        handleMarketPrice,
        handleApplyDescription,
        handleApplyPrice,
        handleSendChatMessage,
        updateField,
        updateParam,
    } = useAdsEdit();

    const [openedCondition, setOpenedCondition] = useState(false);
    const [openedType, setOpenedType] = useState(false);
    const [openedCategory, setOpenedCategory] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const onInputChange = (
        field: keyof FormData,
        value: string | number | Record<string, string | number | undefined>,
    ) => {
        updateField(field, value);
    };

    const onParamChange = (key: string, value: string | number) => {
        updateParam(key, value);
    };

    const handleClearField = (field: keyof FormData) => {
        onInputChange(field, "");
    };

    const handleClearParam = (key: string) => {
        onParamChange(key, "");
    };

    const getBorderColor = (fieldName: string, isEmpty: boolean): string => {
        if (focusedField === fieldName) {
            return "var(--mantine-color-blue-6)";
        }
        return isEmpty
            ? "var(--mantine-color-orange-6)"
            : "var(--mantine-color-gray-4)";
    };

    const getInputStyles = (fieldName: string, isEmpty: boolean) => ({
        input: {
            border: `2px solid ${getBorderColor(fieldName, isEmpty)}`,
            transition: "border-color 0.2s ease",
        },
    });

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
                        onFocus={() => setFocusedField("brand")}
                        onBlur={() => setFocusedField(null)}
                        w="100%"
                        rightSection={
                            <IconCircleXFilled
                                onClick={() => handleClearParam("brand")}
                                size={14}
                                color="#D9D9D9"
                            />
                        }
                        rightSectionPointerEvents="auto"
                        styles={() => {
                            const isEmpty =
                                !formData.params.brand ||
                                (typeof formData.params.brand === "string" &&
                                    formData.params.brand.trim() === "");
                            return getInputStyles("brand", isEmpty);
                        }}
                    />
                    <TextInput
                        radius={8}
                        label="Модель"
                        value={String(formData.params.model || "")}
                        onChange={(e) => onParamChange("model", e.target.value)}
                        onFocus={() => setFocusedField("model")}
                        onBlur={() => setFocusedField(null)}
                        w="100%"
                        rightSection={
                            <IconCircleXFilled
                                onClick={() => handleClearParam("model")}
                                size={14}
                                color="#D9D9D9"
                            />
                        }
                        rightSectionPointerEvents="auto"
                        styles={() => {
                            const isEmpty =
                                !formData.params.model ||
                                (typeof formData.params.model === "string" &&
                                    formData.params.model.trim() === "");
                            return getInputStyles("model", isEmpty);
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
                        onFocus={() => setFocusedField("yearOfManufacture")}
                        onBlur={() => setFocusedField(null)}
                        w="100%"
                        styles={() => {
                            const isEmpty = !formData.params.yearOfManufacture;
                            return getInputStyles("yearOfManufacture", isEmpty);
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
                        onFocus={() => setFocusedField("transmission")}
                        onBlur={() => setFocusedField(null)}
                        w="100%"
                        styles={() => {
                            const isEmpty =
                                !formData.params.transmission ||
                                (typeof formData.params.transmission ===
                                    "string" &&
                                    formData.params.transmission.trim() === "");
                            return getInputStyles("transmission", isEmpty);
                        }}
                    />
                    <NumberInput
                        radius={8}
                        label="Пробег"
                        value={formData.params.mileage || undefined}
                        onChange={(value) =>
                            value != null && onParamChange("mileage", value)
                        }
                        onFocus={() => setFocusedField("mileage")}
                        onBlur={() => setFocusedField(null)}
                        w="100%"
                        styles={() => {
                            const isEmpty = !formData.params.mileage;
                            return getInputStyles("mileage", isEmpty);
                        }}
                    />
                    <NumberInput
                        radius={8}
                        label="Мощность двигателя"
                        value={formData.params.enginePower || undefined}
                        onChange={(value) =>
                            value != null && onParamChange("enginePower", value)
                        }
                        onFocus={() => setFocusedField("enginePower")}
                        onBlur={() => setFocusedField(null)}
                        w="100%"
                        styles={() => {
                            const isEmpty = !formData.params.enginePower;
                            return getInputStyles("enginePower", isEmpty);
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
                        onFocus={() => setFocusedField("re_type")}
                        onBlur={() => setFocusedField(null)}
                        w="100%"
                        styles={() => {
                            const isEmpty =
                                !formData.params.type ||
                                (typeof formData.params.type === "string" &&
                                    formData.params.type.trim() === "");
                            return getInputStyles("re_type", isEmpty);
                        }}
                    />
                    <TextInput
                        radius={8}
                        label="Адрес"
                        value={String(formData.params.address || "")}
                        onChange={(e) =>
                            onParamChange("address", e.target.value)
                        }
                        onFocus={() => setFocusedField("address")}
                        onBlur={() => setFocusedField(null)}
                        w="100%"
                        rightSection={
                            <IconCircleXFilled
                                onClick={() => handleClearParam("address")}
                                size={14}
                                color="#D9D9D9"
                            />
                        }
                        rightSectionPointerEvents="auto"
                        styles={() => {
                            const isEmpty =
                                !formData.params.address ||
                                (typeof formData.params.address === "string" &&
                                    formData.params.address.trim() === "");
                            return getInputStyles("address", isEmpty);
                        }}
                    />
                    <NumberInput
                        radius={8}
                        label="Площадь"
                        value={formData.params.area || undefined}
                        onChange={(value) =>
                            value != null && onParamChange("area", value)
                        }
                        onFocus={() => setFocusedField("area")}
                        onBlur={() => setFocusedField(null)}
                        w="100%"
                        styles={() => {
                            const isEmpty = !formData.params.area;
                            return getInputStyles("area", isEmpty);
                        }}
                    />
                    <NumberInput
                        radius={8}
                        label="Этаж"
                        value={formData.params.floor || undefined}
                        onChange={(value) =>
                            value != null && onParamChange("floor", value)
                        }
                        onFocus={() => setFocusedField("floor")}
                        onBlur={() => setFocusedField(null)}
                        w="100%"
                        styles={() => {
                            const isEmpty = !formData.params.floor;
                            return getInputStyles("floor", isEmpty);
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
                        onFocus={() => setFocusedField("el_type")}
                        onBlur={() => setFocusedField(null)}
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
                        styles={() => {
                            const isEmpty =
                                !formData.params.type ||
                                (typeof formData.params.type === "string" &&
                                    formData.params.type.trim() === "");
                            return getInputStyles("el_type", isEmpty);
                        }}
                    />
                    <TextInput
                        radius={8}
                        label="Бренд"
                        value={String(formData.params.brand || "")}
                        onChange={(e) => onParamChange("brand", e.target.value)}
                        onFocus={() => setFocusedField("el_brand")}
                        onBlur={() => setFocusedField(null)}
                        w="100%"
                        rightSection={
                            <IconCircleXFilled
                                onClick={() => handleClearParam("brand")}
                                size={14}
                                color="#D9D9D9"
                            />
                        }
                        rightSectionPointerEvents="auto"
                        styles={() => {
                            const isEmpty =
                                !formData.params.brand ||
                                (typeof formData.params.brand === "string" &&
                                    formData.params.brand.trim() === "");
                            return getInputStyles("el_brand", isEmpty);
                        }}
                    />
                    <TextInput
                        radius={8}
                        label="Модель"
                        value={String(formData.params.model || "")}
                        onChange={(e) => onParamChange("model", e.target.value)}
                        onFocus={() => setFocusedField("el_model")}
                        onBlur={() => setFocusedField(null)}
                        w="100%"
                        rightSection={
                            <IconCircleXFilled
                                onClick={() => handleClearParam("model")}
                                size={14}
                                color="#D9D9D9"
                            />
                        }
                        rightSectionPointerEvents="auto"
                        styles={() => {
                            const isEmpty =
                                !formData.params.model ||
                                (typeof formData.params.model === "string" &&
                                    formData.params.model.trim() === "");
                            return getInputStyles("el_model", isEmpty);
                        }}
                    />
                    <TextInput
                        radius={8}
                        label="Цвет"
                        value={String(formData.params.color || "")}
                        onChange={(e) => onParamChange("color", e.target.value)}
                        onFocus={() => setFocusedField("color")}
                        onBlur={() => setFocusedField(null)}
                        w="100%"
                        rightSection={
                            <IconCircleXFilled
                                onClick={() => handleClearParam("color")}
                                size={14}
                                color="#D9D9D9"
                            />
                        }
                        rightSectionPointerEvents="auto"
                        styles={() => {
                            const isEmpty =
                                !formData.params.color ||
                                (typeof formData.params.color === "string" &&
                                    formData.params.color.trim() === "");
                            return getInputStyles("color", isEmpty);
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
                        onFocus={() => setFocusedField("condition")}
                        onBlur={() => setFocusedField(null)}
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
                        styles={() => {
                            const isEmpty =
                                !formData.params.condition ||
                                (typeof formData.params.condition ===
                                    "string" &&
                                    formData.params.condition.trim() === "");
                            return getInputStyles("condition", isEmpty);
                        }}
                    />
                </Stack>
            );
        }

        return null;
    };

    return (
        <Container size="lg" py="xl">
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

            <Grid gutter="lg">
                <Grid.Col span={{ base: 12, md: 8 }}>
                    <Stack>
                        <Select
                            radius={8}
                            styles={() => {
                                const isEmpty =
                                    !formData.category ||
                                    formData.category.trim() === "";
                                return getInputStyles("category", isEmpty);
                            }}
                            label="Категория"
                            placeholder="Выберите категорию"
                            data={CATEGORY_OPTIONS}
                            value={formData.category}
                            onChange={(value) =>
                                value != null &&
                                onInputChange("category", value)
                            }
                            onFocus={() => setFocusedField("category")}
                            onBlur={() => setFocusedField(null)}
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
                            onChange={(e) =>
                                onInputChange("title", e.target.value)
                            }
                            onFocus={() => setFocusedField("title")}
                            onBlur={() => setFocusedField(null)}
                            withAsterisk
                            rightSection={
                                <IconCircleXFilled
                                    onClick={() => handleClearField("title")}
                                    size={14}
                                    color="#D9D9D9"
                                />
                            }
                            rightSectionPointerEvents="auto"
                            w="100%"
                            styles={() => {
                                const isEmpty =
                                    !formData.title ||
                                    formData.title.trim() === "";
                                return getInputStyles("title", isEmpty);
                            }}
                        />
                    </Stack>

                    <Divider my="sm" labelPosition="center" variant="dotted" />

                    <Group
                        style={{
                            display: "flex",
                            alignItems: "flex-end",
                            gap: 12,
                        }}
                    >
                        <NumberInput
                            radius={8}
                            label="Цена"
                            placeholder="64000"
                            value={formData.price}
                            onChange={(value) =>
                                value != null && onInputChange("price", value)
                            }
                            onFocus={() => setFocusedField("price")}
                            onBlur={() => setFocusedField(null)}
                            withAsterisk
                            rightSection={
                                <IconCircleXFilled
                                    onClick={() => handleClearField("price")}
                                    size={14}
                                    color="#D9D9D9"
                                />
                            }
                            style={{ flex: 1, maxWidth: 400 }}
                            styles={() => {
                                const isEmpty = formData.price == null;
                                return {
                                    input: {
                                        width: "100%",
                                        border: `2px solid ${getBorderColor("price", isEmpty)}`,
                                        transition: "border-color 0.2s ease",
                                        "&:focus": {
                                            borderColor:
                                                "var(--mantine-color-blue-6)",
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
                            originalText={
                                formData.price
                                    ? `${formData.price}`
                                    : "Цена не указана"
                            }
                            onApply={handleApplyPrice}
                        >
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
                                {aiPriceLoading ? (
                                    <Loader size={14} color="#FD7E14" />
                                ) : aiPriceMessage ? (
                                    <IconReload size={14} color="#FD7E14" />
                                ) : (
                                    <IconBulb size={14} color="#FD7E14" />
                                )}
                                <Text size="xs" c="#FD7E14" fw={500}>
                                    {aiPriceMessage
                                        ? "Повторить запрос"
                                        : "Узнать рыночную цену"}
                                </Text>
                            </Box>
                        </AiPopover>
                    </Group>

                    <Divider my="sm" labelPosition="center" variant="dotted" />

                    <Title order={4} mt="md">
                        Характеристики
                    </Title>

                    {renderCharacteristics()}

                    <Divider my="sm" labelPosition="center" variant="dotted" />

                    <Stack gap={8}>
                        <Text size="sm" fw={500}>
                            Описание
                        </Text>
                        <Textarea
                            radius={12}
                            placeholder="Опишите ваш товар..."
                            minRows={4}
                            autosize
                            maxRows={15}
                            value={formData.description}
                            onChange={(e) =>
                                onInputChange("description", e.target.value)
                            }
                            onFocus={() => setFocusedField("description")}
                            onBlur={() => setFocusedField(null)}
                            styles={() => {
                                const isEmpty =
                                    !formData.description ||
                                    formData.description.trim() === "";
                                return {
                                    input: {
                                        border: `2px solid ${getBorderColor("description", isEmpty)}`,
                                        transition: "border-color 0.2s ease",
                                    },
                                };
                            }}
                        />
                        <Group justify="space-between">
                            <AiPopover
                                onRequest={handleImproveDescription}
                                loading={aiDescriptionLoading}
                                message={aiDescriptionMessage}
                                originalText={formData.description}
                                onApply={handleApplyDescription}
                            >
                                <Box
                                    style={{
                                        backgroundColor: "#FFF4E6",
                                        padding: "6px 10px",
                                        borderRadius: "6px",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "6px",
                                        width: "fit-content",
                                        cursor: "pointer",
                                    }}
                                >
                                    {aiDescriptionLoading ? (
                                        <Loader size={12} color="#FD7E14" />
                                    ) : aiDescriptionMessage ? (
                                        <IconReload size={14} color="#FD7E14" />
                                    ) : (
                                        <IconBulb size={14} color="#FD7E14" />
                                    )}
                                    <Text size="xs" c="#FD7E14" fw={500}>
                                        {aiDescriptionMessage
                                            ? "Повторить запрос"
                                            : "Улучшить описание"}
                                    </Text>
                                </Box>
                            </AiPopover>
                            <Text size="xs" c="dimmed">
                                {formData.description.length} / 1000
                            </Text>
                        </Group>

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
                </Grid.Col>

                {/* Чат с AI */}
                <Grid.Col span={{ base: 12, md: 4 }}>
                    <ChatBox
                        messages={chatMessages}
                        loading={chatLoading}
                        onSendMessage={handleSendChatMessage}
                    />
                </Grid.Col>
            </Grid>
        </Container>
    );
}
