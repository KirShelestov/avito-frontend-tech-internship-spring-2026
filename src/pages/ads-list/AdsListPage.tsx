import {
    Container,
    Grid,
    Pagination,
    Group,
    Loader,
    Center,
} from "@mantine/core";
import { useEffect, useState } from "react";

import { AdsHeader } from "../../widgets/ads-list/AdsHeader";
import { AdsFilters } from "../../widgets/ads-list/AdsFilter";
import { AdsList } from "../../widgets/ads-list/AdsList";

import { useAdsListStore } from "../../entities/ad/adsListStore";

export default function AdsListPage() {
    const { ads, total, loading, filters, updateFilters, updatePage } =
        useAdsListStore();
    const [localSearch, setLocalSearch] = useState(filters.search);

    useEffect(() => {
        const timeout = setTimeout(() => {
            updateFilters({ search: localSearch, page: 1 });
        }, 400);

        return () => clearTimeout(timeout);
    }, [localSearch, updateFilters]);

    return (
        <Container fluid py="md">
            <AdsHeader
                search={localSearch}
                setSearch={setLocalSearch}
                gridView={filters.gridView}
                setGridView={(value) => updateFilters({ gridView: value })}
                totalItems={total}
                sortColumn={filters.sortColumn}
                sortDirection={filters.sortDirection}
                setSortColumn={(value) => updateFilters({ sortColumn: value })}
                setSortDirection={(value) =>
                    updateFilters({ sortDirection: value })
                }
            />

            <Grid>
                <Grid.Col span={3}>
                    <AdsFilters
                        onlyRevision={filters.onlyRevision}
                        setOnlyRevision={(value) =>
                            updateFilters({ onlyRevision: value })
                        }
                        categories={filters.categories}
                        setCategories={(value) =>
                            updateFilters({ categories: value })
                        }
                    />
                </Grid.Col>

                <Grid.Col span={9}>
                    {loading ? (
                        <Center h={300}>
                            <Loader />
                        </Center>
                    ) : (
                        <>
                            <AdsList ads={ads} gridView={filters.gridView} />

                            <Group justify="center" mt="md">
                                <Pagination.Root
                                    total={Math.ceil(total / 10)}
                                    value={filters.page}
                                    onChange={(page) => updatePage(page)}
                                    getItemProps={(pageNumber) => ({
                                        style: {
                                            borderRadius: "8px",
                                            backgroundColor:
                                                "var(--mantine-color-gray-0)",
                                            border: `1px solid ${pageNumber === filters.page ? "var(--mantine-color-blue-6)" : "var(--mantine-color-gray-2)"}`,
                                            color:
                                                pageNumber === filters.page
                                                    ? "var(--mantine-color-blue-6)"
                                                    : "var(--mantine-color-gray-7)",
                                            fontWeight:
                                                pageNumber === filters.page
                                                    ? 600
                                                    : 400,
                                        },
                                    })}
                                >
                                    <Group gap={5} justify="center">
                                        <Pagination.Previous
                                            style={{
                                                borderRadius: "8px",
                                                backgroundColor:
                                                    "var(--mantine-color-gray-0)",
                                                border: "1px solid var(--mantine-color-gray-2)",
                                                color:
                                                    filters.page === 1
                                                        ? "var(--mantine-color-gray-4)"
                                                        : "var(--mantine-color-gray-7)",
                                                opacity:
                                                    filters.page === 1
                                                        ? 0.5
                                                        : 1,
                                                cursor:
                                                    filters.page === 1
                                                        ? "not-allowed"
                                                        : "pointer",
                                            }}
                                        />

                                        <Pagination.Items />

                                        <Pagination.Next
                                            style={{
                                                borderRadius: "8px",
                                                backgroundColor:
                                                    "var(--mantine-color-gray-0)",
                                                border: "1px solid var(--mantine-color-gray-2)",
                                                color:
                                                    filters.page ===
                                                    Math.ceil(total / 10)
                                                        ? "var(--mantine-color-gray-4)"
                                                        : "var(--mantine-color-gray-7)",
                                                opacity:
                                                    filters.page ===
                                                    Math.ceil(total / 10)
                                                        ? 0.5
                                                        : 1,
                                                cursor:
                                                    filters.page ===
                                                    Math.ceil(total / 10)
                                                        ? "not-allowed"
                                                        : "pointer",
                                            }}
                                        />
                                    </Group>
                                </Pagination.Root>
                            </Group>
                        </>
                    )}
                </Grid.Col>
            </Grid>
        </Container>
    );
}
