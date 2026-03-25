import type { AdItem } from "../types";


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




export const getMissingFields = (ad: AdItem): string[] => {
  const missingFields: string[] = [];

  if (!ad.description || !ad.description.trim()) {
    missingFields.push("Описание");
  }

  if (ad.category === "auto") {
    const { brand, model, yearOfManufacture, transmission, mileage, enginePower } = ad.params as AutoParams;
    if (!brand) missingFields.push("Бренд");
    if (!model) missingFields.push("Модель");
    if (!yearOfManufacture) missingFields.push("Год выпуска");
    if (!transmission) missingFields.push("Коробка передач");
    if (!mileage) missingFields.push("Пробег");
    if (!enginePower) missingFields.push("Мощность");
  } else if (ad.category === "real_estate") {
    const { type, address, area, floor } = ad.params as RealEstateParams;
    if (!type) missingFields.push("Тип объекта");
    if (!address) missingFields.push("Адрес");
    if (!area) missingFields.push("Площадь");
    if (!floor) missingFields.push("Этаж");
  } else if (ad.category === "electronics") {
    const { type, brand, model, condition, color } = ad.params as ElectronicsParams;
    if (!type) missingFields.push("Тип");
    if (!brand) missingFields.push("Бренд");
    if (!model) missingFields.push("Модель");
    if (!condition) missingFields.push("Состояние");
    if (!color) missingFields.push("Цвет");
  }

  return missingFields;
};

export const getCharacteristics = (ad: AdItem): { label: string; value: string }[] => {
  if (ad.category === "auto") {
    const { brand, model, yearOfManufacture, transmission, mileage, enginePower } = ad.params as AutoParams;
    return [
      { label: "Бренд", value: brand ?? "—" },
      { label: "Модель", value: model ?? "—" },
      { label: "Год выпуска", value: yearOfManufacture ?? "—" ? `${yearOfManufacture}` : "—" },
      { label: "Коробка передач", value: transmission ?? "—" },
      { label: "Пробег", value: mileage ? `${mileage} км` : "—" },
      { label: "Мощность", value: enginePower ? `${enginePower} л.с.` : "—" },
    ];
  }

  if (ad.category === "real_estate") {
    const { type, address, area, floor } = ad.params as RealEstateParams;
    return [
      { label: "Тип объекта", value: type ?? "—" },
      { label: "Адрес", value: address ?? "—" },
      { label: "Площадь", value: area ? `${area} м²` : "—" },
      { label: "Этаж", value: floor ?? "—" ? `${floor}` : "—" },
    ];
  }

  if (ad.category === "electronics") {
    const { type, brand, model, condition, color } = ad.params as ElectronicsParams;
    return [
      { label: "Тип", value: type ?? "—" },
      { label: "Бренд", value: brand ?? "—" },
      { label: "Модель", value: model ?? "—" },
      { label: "Состояние", value: condition ?? "—" },
      { label: "Цвет", value: color ?? "—" },
    ];
  }

  return [];
};
