export type FormData = {
    category: string;
    title: string;
    price: number;
    description: string;
    params: Record<string, string | number | undefined>;
};
