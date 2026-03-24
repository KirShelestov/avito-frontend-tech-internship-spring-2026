import {
    Card,
    Image,
    Text,
    Group,
    Box,
    AspectRatio,
    Stack,
} from "@mantine/core";
import { Link } from "react-router-dom";
import { CATEGORY_NAMES } from "../../../shared/constants/constants";

export function AdCard({ ad, listView = false }: any) {
    if (listView) {
        return (
            <Card
                component={Link}
                to={`/ads/${ad.id}`}
                withBorder
                radius="lg"
                p="sm"
                style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    gap: 12,
                    alignItems: "flex-start",
                    textDecoration: "none",
                }}
            >
                <Box style={{ flexShrink: 0, width: 100, height: 100 }}>
                    <Image
                        src="https://placehold.co/400x400"
                        radius="md"
                        fit="cover"
                        width={100}
                        height={100}
                    />
                </Box>

                <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
                    <Text
                        c="gray.7"
                        size="xs"
                        fw={500}
                        style={{ display: "inline-block" }}
                    >
                        {CATEGORY_NAMES[ad.category] || ad.category}
                    </Text>

                    <Text size="sm" fw={500} lineClamp={1}>
                        {ad.title}
                    </Text>

                    <Text size="sm" fw={600} c="gray">
                        {ad.price.toLocaleString()} ₽
                    </Text>

                    {ad.needsRevision && (
                        <Group
                            gap={6}
                            style={{
                                width: "fit-content",
                                backgroundColor:
                                    "var(--mantine-color-yellow-1)",
                                padding: "2px 6px",
                                borderRadius: 8,
                            }}
                        >
                            <Box
                                style={{
                                    width: 6,
                                    height: 6,
                                    borderRadius: "50%",
                                    backgroundColor:
                                        "var(--mantine-color-yellow-6)",
                                }}
                            />
                            <Text size="xs" c="yellow.6">
                                Требует доработок
                            </Text>
                        </Group>
                    )}
                </Stack>
            </Card>
        );
    }

    return (
        <Card
            component={Link}
            to={`/ads/${ad.id}`}
            withBorder
            radius="lg"
            p="sm"
            style={{ height: "100%", width: "100%", textDecoration: "none" }}
        >
            <AspectRatio ratio={1} mb="xs">
                <Image
                    src="https://placehold.co/400x400"
                    radius="md"
                    styles={{
                        root: {
                            backgroundColor: "var(--mantine-color-gray-2)",
                        },
                    }}
                />
            </AspectRatio>

            <Box
                component="span"
                style={{
                    display: "inline-block",
                    padding: "6px 14px",
                    borderRadius: 12,
                    border: "1px solid var(--mantine-color-gray-4)",
                    fontSize: 12,
                    fontWeight: 500,
                    backgroundColor: "transparent",
                    width: "fit-content",
                    color: "var(--mantine-color-gray-7)",
                }}
            >
                {CATEGORY_NAMES[ad.category] || ad.category}
            </Box>

            <Text size="sm" fw={500} mt={4}>
                {ad.title}
            </Text>

            <Text size="sm" fw={600} mt={2} c="gray">
                {ad.price.toLocaleString()} ₽
            </Text>

            {ad.needsRevision && (
                <Group
                    gap={6}
                    mt={4}
                    style={{
                        width: "fit-content",
                        backgroundColor: "var(--mantine-color-yellow-1)",
                        padding: "4px 8px",
                        borderRadius: 8,
                    }}
                >
                    <Box
                        style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            backgroundColor: "var(--mantine-color-yellow-6)",
                            flexShrink: 0,
                        }}
                    />
                    <Text size="xs" c="yellow.6">
                        Требует доработок
                    </Text>
                </Group>
            )}
        </Card>
    );
}
