import { SimpleGrid, Stack } from "@mantine/core";
import { AdCard } from "../../entities/ad/ui/AdCard";

export function AdsList({ ads, gridView }: any) {
    if (gridView) {
        return (
            <SimpleGrid cols={5}>
                {ads.map((ad: any) => (
                    <div style={{ width: "100%" }} key={ad.id}>
                        <AdCard ad={ad} />
                    </div>
                ))}
            </SimpleGrid>
        );
    }

    return (
        <Stack>
            {ads.map((ad: any) => (
                <AdCard key={ad.id} ad={ad} listView={true} />
            ))}
        </Stack>
    );
}
