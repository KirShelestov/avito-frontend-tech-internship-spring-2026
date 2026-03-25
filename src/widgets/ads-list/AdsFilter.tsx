import {
    Card,
    Stack,
    Text,
    Checkbox,
    Switch,
    Button,
    Divider,
    Group,
    Collapse,
} from "@mantine/core";
import { useState } from "react";

type Category = "auto" | "electronics" | "real_estate";
interface AdsFiltersProps {
    onlyRevision: boolean;
    setOnlyRevision: (value: boolean) => void;

    categories: Category[];
    setCategories: (value: Category[]) => void;
}

export function AdsFilters({
    onlyRevision,
    setOnlyRevision,
    categories,
    setCategories,
}: AdsFiltersProps) {
    const [opened, setOpened] = useState(true);

    const handleCategoryChange = (category: Category, checked: boolean) => {
        if (checked) {
            setCategories([...categories, category]);
        } else {
            setCategories(categories.filter((c) => c !== category));
        }
    };

    const handleReset = () => {
        setOnlyRevision(false);
        setCategories([]);
    };

    return (
        <Stack gap="sm">
            <Card radius="lg" p="md" withBorder>
                <Stack gap="md">
                    <Text fw={600} size="sm">
                        Фильтры
                    </Text>

                    <Stack gap={6}>
                        <Group
                            justify="space-between"
                            style={{ cursor: "pointer" }}
                            onClick={() => setOpened((o) => !o)}
                        >
                            <Text size="sm" fw={500}>
                                Категория
                            </Text>

                            <Text
                                size="sm"
                                style={{
                                    transform: opened
                                        ? "rotate(180deg)"
                                        : "rotate(0deg)",
                                    transition: "0.2s",
                                }}
                            >
                                ⌃
                            </Text>
                        </Group>

                        <Collapse in={opened}>
                            <Stack gap={6} mt={4}>
                                <Checkbox
                                    label="Авто"
                                    checked={categories.includes("auto")}
                                    onChange={(e) =>
                                        handleCategoryChange(
                                            "auto",
                                            e.currentTarget.checked,
                                        )
                                    }
                                />

                                <Checkbox
                                    label="Электроника"
                                    checked={categories.includes("electronics")}
                                    onChange={(e) =>
                                        handleCategoryChange(
                                            "electronics",
                                            e.currentTarget.checked,
                                        )
                                    }
                                />

                                <Checkbox
                                    label="Недвижимость"
                                    checked={categories.includes("real_estate")}
                                    onChange={(e) =>
                                        handleCategoryChange(
                                            "real_estate",
                                            e.currentTarget.checked,
                                        )
                                    }
                                />
                            </Stack>
                        </Collapse>
                    </Stack>

                    <Divider />

                    <Group justify="space-between" align="center">
                        <Text size="sm" fw={500}>
                            Только требующие доработок
                        </Text>

                        <Switch
                            withThumbIndicator={false}
                            checked={onlyRevision}
                            onChange={(e) =>
                                setOnlyRevision(e.currentTarget.checked)
                            }
                        />
                    </Group>
                </Stack>
            </Card>

            <Button
                fullWidth
                radius="md"
                variant="subtle"
                color="gray"
                onClick={handleReset}
            >
                Сбросить фильтры
            </Button>
        </Stack>
    );
}
