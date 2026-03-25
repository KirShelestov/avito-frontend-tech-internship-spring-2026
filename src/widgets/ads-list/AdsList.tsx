import { SimpleGrid, Stack } from "@mantine/core";
import { AdCard } from "../../entities/ad/ui/AdCard";
import type { AdItem } from "../../entities/ad/types";

interface AdListProps {
    ads: AdItem[];
    gridView?: boolean;
}

export function AdsList({ ads, gridView }: AdListProps) {
    if (gridView) {
        return (
            <SimpleGrid cols={5}>
                {ads.map((ad) => (
                    <div style={{ width: "100%" }} key={ad.id}>
                        <AdCard ad={ad} />
                    </div>
                ))}
            </SimpleGrid>
        );
    }

    return (
        <Stack>
            {ads.map((ad) => (
                <AdCard key={ad.id} ad={ad} listView />
            ))}
        </Stack>
    );
}
