import {
    Title,
    Text,
    TextInput,
    Group,
    Select,
    SegmentedControl,
    Stack,
    Container,
} from "@mantine/core";
import {
    IconChevronDown,
    IconChevronUp,
    IconSearch,
    IconLayoutGrid,
    IconLayoutList,
} from "@tabler/icons-react";
import { useState } from "react";
import { ThemeToggle } from "../theme/ThemeToggle";

type SortColumn = "createdAt" | "price" | "title";
type SortDirection = "asc" | "desc";

interface AdsHeaderProps {
    search: string;
    setSearch: (value: string) => void;

    gridView: boolean;
    setGridView: (value: boolean) => void;

    totalItems: number;

    sortColumn: SortColumn;
    sortDirection: SortDirection;

    setSortColumn: (value: SortColumn) => void;
    setSortDirection: (value: SortDirection) => void;
}

export function AdsHeader({
    search,
    setSearch,
    gridView,
    setGridView,
    totalItems,
    sortColumn,
    sortDirection,
    setSortColumn,
    setSortDirection,
}: AdsHeaderProps) {
    const [opened, setOpened] = useState(false);

    return (
        <Stack mb="md" gap="xs">
            <Title mb={-8} order={1}>
                Мои объявления
            </Title>

            <Text size="md" c="dimmed">
                {totalItems} объявления
            </Text>

            <Group
                justify="space-between"
                style={{
                    backgroundColor: "var(--mantine-color-gray-0)",
                    padding: 12,
                    borderRadius: 8,
                }}
            >
                <TextInput
                    placeholder="Найти объявление..."
                    value={search}
                    onChange={(e) => setSearch(e.currentTarget.value)}
                    rightSection={<IconSearch size={16} />}
                    rightSectionPointerEvents="none"
                    styles={{
                        root: {
                            flex: 1,
                        },
                        input: {
                            backgroundColor: "var(--mantine-color-gray-1)",
                            border: "none",
                            "&:focus": {
                                outline: "none",
                                border: "none",
                            },
                        },
                    }}
                    radius={8}
                />

                <SegmentedControl
                    value={gridView ? "grid" : "list"}
                    onChange={(value) => setGridView(value === "grid")}
                    radius={4}
                    styles={{
                        root: {
                            borderRadius: "8px",
                        },
                    }}
                    data={[
                        {
                            value: "grid",
                            label: (
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        height: "100%",
                                    }}
                                >
                                    <IconLayoutGrid
                                        size={16}
                                        color={
                                            gridView
                                                ? "var(--mantine-color-blue-6)"
                                                : "var(--mantine-color-gray-6)"
                                        }
                                    />
                                </div>
                            ),
                        },
                        {
                            value: "list",
                            label: (
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        height: "100%",
                                    }}
                                >
                                    <IconLayoutList
                                        size={16}
                                        color={
                                            !gridView
                                                ? "var(--mantine-color-blue-6)"
                                                : "var(--mantine-color-gray-6)"
                                        }
                                    />
                                </div>
                            ),
                        },
                    ]}
                />
                <Container
                    style={{
                        backgroundColor: "var(--mantine-color-gray-1)",
                        padding: 6,
                        borderRadius: 8,
                    }}
                >
                    <Select
                        placeholder="Сортировка"
                        value={`${sortColumn}-${sortDirection}`}
                        onChange={(val) => {
                            if (!val) return;
                            const [col, dir] = val.split("-");
                            setSortColumn(
                                col as "createdAt" | "price" | "title",
                            );
                            setSortDirection(dir as "asc" | "desc");
                        }}
                        data={[
                            {
                                value: "createdAt-desc",
                                label: "По новизне (сначала новые)",
                            },
                            {
                                value: "createdAt-asc",
                                label: "По новизне (начала старые)",
                            },
                            {
                                value: "price-asc",
                                label: "По цене (сначала дешёвые)",
                            },
                            {
                                value: "price-desc",
                                label: "По цене (сначала дорогие)",
                            },
                            {
                                value: "title-asc",
                                label: "По названию (А → Я)",
                            },
                            {
                                value: "title-desc",
                                label: "По названию (Я → А)",
                            },
                        ]}
                        styles={{
                            input: {
                                border: "none",
                                "&:focus": {
                                    outline: "none",
                                    border: "none",
                                },
                            },
                        }}
                        radius={8}
                        onDropdownOpen={() => setOpened(true)}
                        onDropdownClose={() => setOpened(false)}
                        rightSection={
                            opened ? (
                                <IconChevronUp size={16} />
                            ) : (
                                <IconChevronDown size={16} />
                            )
                        }
                        rightSectionPointerEvents="none"
                    />
                </Container>

                <ThemeToggle />
            </Group>
        </Stack>
    );
}
