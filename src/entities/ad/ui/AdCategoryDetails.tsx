import { Stack, Text } from "@mantine/core";

type AutoParams = {
    brand?: string;
    model?: string;
    yearOfManufacture?: number;
    transmission?: string;
    mileage?: number;
    enginePower?: number;
};

type RealEstateParams = {
    type?: string;
    address?: string;
    area?: number;
    floor?: number;
};

type ElectronicsParams = {
    type?: string;
    brand?: string;
    model?: string;
    condition?: string;
    color?: string;
};

type AdCategoryDetailsProps = {
    ad: AdItem;
};
type AdItem =
    | {
          category: "auto";
          params: AutoParams;
      }
    | {
          category: "real_estate";
          params: RealEstateParams;
      }
    | {
          category: "electronics";
          params: ElectronicsParams;
      };

export function AdCategoryDetails({ ad }: AdCategoryDetailsProps) {
    if (ad.category === "auto") {
        const {
            brand,
            model,
            yearOfManufacture,
            transmission,
            mileage,
            enginePower,
        } = ad.params;

        return (
            <Stack gap={4}>
                <Text>
                    <b>Бренд:</b> {brand ?? "—"}
                </Text>
                <Text>
                    <b>Модель:</b> {model ?? "—"}
                </Text>
                <Text>
                    <b>Год выпуска:</b> {yearOfManufacture ?? "—"}
                </Text>
                <Text>
                    <b>Коробка передач:</b> {transmission ?? "—"}
                </Text>
                <Text>
                    <b>Пробег:</b> {mileage ? `${mileage} км` : "—"}
                </Text>
                <Text>
                    <b>Мощность:</b> {enginePower ? `${enginePower} л.с.` : "—"}
                </Text>
            </Stack>
        );
    }

    if (ad.category === "real_estate") {
        const { type, address, area, floor } = ad.params;

        return (
            <Stack gap={4}>
                <Text>
                    <b>Тип объекта:</b> {type ?? "—"}
                </Text>
                <Text>
                    <b>Адрес:</b> {address ?? "—"}
                </Text>
                <Text>
                    <b>Площадь:</b> {area ? `${area} м²` : "—"}
                </Text>
                <Text>
                    <b>Этаж:</b> {floor ?? "—"}
                </Text>
            </Stack>
        );
    }

    if (ad.category === "electronics") {
        const { type, brand, model, condition, color } = ad.params;

        return (
            <Stack gap={4}>
                <Text>
                    <b>Тип:</b> {type ?? "—"}
                </Text>
                <Text>
                    <b>Бренд:</b> {brand ?? "—"}
                </Text>
                <Text>
                    <b>Модель:</b> {model ?? "—"}
                </Text>
                <Text>
                    <b>Состояние:</b> {condition ?? "—"}
                </Text>
                <Text>
                    <b>Цвет:</b> {color ?? "—"}
                </Text>
            </Stack>
        );
    }

    return null;
}
