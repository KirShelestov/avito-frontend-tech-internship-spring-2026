import { api } from "../../../shared/api/axios";

export const getItems = (params: {
  q?: string;
  limit?: number;
  skip?: number;
  needsRevision?: boolean;
  categories?: string;
  sortColumn?: string;
  sortDirection?: string;
}) => {
  return api.get("/items", { params });
};

export const getItemById = (id: number) => {
  return api.get(`/items/${id}`);
};

export const updateItem = (id: number, data: any) => {
  return api.put(`/items/${id}`, data);
};