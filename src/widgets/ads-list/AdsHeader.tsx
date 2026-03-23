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
}: any) {
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
                    backgroundColor: "#FFFFFF",
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
                            backgroundColor: "#f7f5f8",
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
                                        color={gridView ? "#1890FF" : "black"}
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
                                        color={!gridView ? "#1890FF" : "black"}
                                    />
                                </div>
                            ),
                        },
                    ]}
                />
                <Container
                    style={{
                        backgroundColor: "#f7f5f8",
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
            </Group>
        </Stack>
    );
}
