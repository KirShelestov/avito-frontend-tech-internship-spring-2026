import {
    Card,
    Image,
    Text,
    Group,
    Box,
    AspectRatio,
    Stack,
} from "@mantine/core";
import { CATEGORY_NAMES } from "../../../shared/constants/constants";

export function AdCard({ ad, listView = false }: any) {
    if (listView) {
        return (
            <Card
                withBorder
                radius="lg"
                p="sm"
                style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    gap: 12,
                    alignItems: "flex-start",
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
                    <Box
                        style={{
                            display: "inline-block",
                            color: "#343a40",
                            fontSize: 11,
                            fontWeight: 500,
                            width: "fit-content",
                        }}
                    >
                        {CATEGORY_NAMES[ad.category] || ad.category}
                    </Box>

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
                                backgroundColor: "#fcf7d1",
                                padding: "2px 6px",
                                borderRadius: 8,
                            }}
                        >
                            <Box
                                style={{
                                    width: 6,
                                    height: 6,
                                    borderRadius: "50%",
                                    backgroundColor: "#f59f00",
                                }}
                            />
                            <Text size="xs" c="#f59f00">
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
            withBorder
            radius="lg"
            p="sm"
            style={{ height: "100%", width: "100%" }}
        >
            <AspectRatio ratio={1} mb="xs">
                <Image
                    src="https://placehold.co/400x400"
                    radius="md"
                    styles={{
                        root: { backgroundColor: "#e9ecef" },
                    }}
                />
            </AspectRatio>

            <Box
                component="span"
                style={{
                    display: "inline-block",
                    padding: "6px 14px",
                    borderRadius: 12,
                    border: "1px solid #ced4da",
                    color: "#343a40",
                    fontSize: 12,
                    fontWeight: 500,
                    backgroundColor: "transparent",
                    width: "fit-content",
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
                        backgroundColor: "#fcf7d1",
                        padding: "4px 8px",
                        borderRadius: 8,
                    }}
                >
                    <Box
                        style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            backgroundColor: "#f59f00",
                            flexShrink: 0,
                        }}
                    />
                    <Text size="xs" c="#f59f00">
                        Требует доработок
                    </Text>
                </Group>
            )}
        </Card>
    );
}
