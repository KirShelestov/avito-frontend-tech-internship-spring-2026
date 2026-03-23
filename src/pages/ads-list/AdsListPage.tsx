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

import { getItems } from "../../entities/ad/api/adApi";

export default function AdsListPage() {
    const [search, setSearch] = useState("");
    const [onlyRevision, setOnlyRevision] = useState(false);
    const [gridView, setGridView] = useState(true);

    const [ads, setAds] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<string[]>([]);

    const [page, setPage] = useState(1);

    const [sortColumn, setSortColumn] = useState<
        "createdAt" | "price" | "title"
    >("createdAt");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

    const fetchAds = async (
        searchValue = search,
        revision = onlyRevision,
        pageValue = page,
        selectedCategories = categories,
        sortCol = sortColumn,
        sortDir = sortDirection,
    ) => {
        try {
            setLoading(true);

            const res = await getItems({
                q: searchValue || undefined,
                skip: (pageValue - 1) * 10,
                needsRevision: revision || undefined,
                categories: selectedCategories.length
                    ? selectedCategories.join(",")
                    : undefined,
                sortColumn: sortCol === "price" ? undefined : sortCol,
                sortDirection: sortCol === "price" ? undefined : sortDir,
            });

            let items = res.data.items;

            if (sortCol === "price") {
                items = items.sort((a: any, b: any) =>
                    sortDir === "asc" ? a.price - b.price : b.price - a.price,
                );
            }

            setAds(items);
            setTotal(res.data.total);
        } catch (e) {
            console.error("Ошибка загрузки объявлений:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            setPage(1);
            fetchAds(
                search,
                onlyRevision,
                1,
                categories,
                sortColumn,
                sortDirection,
            );
        }, 400);

        return () => clearTimeout(timeout);
    }, [search, onlyRevision, categories, sortColumn, sortDirection]);

    useEffect(() => {
        fetchAds(
            search,
            onlyRevision,
            page,
            categories,
            sortColumn,
            sortDirection,
        );
    }, [page]);

    return (
        <Container fluid py="md">
            <AdsHeader
                search={search}
                setSearch={setSearch}
                gridView={gridView}
                setGridView={setGridView}
                totalItems={total}
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                setSortColumn={setSortColumn}
                setSortDirection={setSortDirection}
            />

            <Grid>
                <Grid.Col span={3}>
                    <AdsFilters
                        onlyRevision={onlyRevision}
                        setOnlyRevision={setOnlyRevision}
                        categories={categories}
                        setCategories={setCategories}
                    />
                </Grid.Col>

                <Grid.Col span={9}>
                    {loading ? (
                        <Center h={300}>
                            <Loader />
                        </Center>
                    ) : (
                        <>
                            <AdsList ads={ads} gridView={gridView} />

                            <Group justify="center" mt="md">
                                <Pagination.Root
                                    total={Math.ceil(total / 10)}
                                    value={page}
                                    onChange={setPage}
                                    getItemProps={(pageNumber) => ({
                                        style: {
                                            borderRadius: "8px",
                                            backgroundColor: "#fff",
                                            border: `1px solid ${pageNumber === page ? "#1890FF" : "#e9ecef"}`,
                                            color:
                                                pageNumber === page
                                                    ? "#1890FF"
                                                    : "#495057",
                                            fontWeight:
                                                pageNumber === page ? 600 : 400,
                                        },
                                    })}
                                >
                                    <Group gap={5} justify="center">
                                        <Pagination.Previous
                                            style={{
                                                borderRadius: "8px",
                                                backgroundColor: "#fff",
                                                border: "1px solid #e9ecef",
                                                color:
                                                    page === 1
                                                        ? "#ced4da"
                                                        : "#495057",
                                                opacity: page === 1 ? 0.5 : 1,
                                                cursor:
                                                    page === 1
                                                        ? "not-allowed"
                                                        : "pointer",
                                            }}
                                        />

                                        <Pagination.Items />

                                        <Pagination.Next
                                            style={{
                                                borderRadius: "8px",
                                                backgroundColor: "#fff",
                                                border: "1px solid #e9ecef",
                                                color:
                                                    page ===
                                                    Math.ceil(total / 10)
                                                        ? "#ced4da"
                                                        : "#495057",
                                                opacity:
                                                    page ===
                                                    Math.ceil(total / 10)
                                                        ? 0.5
                                                        : 1,
                                                cursor:
                                                    page ===
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
