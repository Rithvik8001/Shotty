import { api } from "./api";
import type {
  Url,
  CreateUrlRequest,
  CreateUrlResponse,
  EditUrlRequest,
} from "@/types";

export const urlService = {
  getAll: async () => {
    return api.get<Url[]>("/url/all");
  },

  create: async (data: CreateUrlRequest) => {
    return api.post<CreateUrlResponse>("/url/create", data);
  },

  update: async (id: string, data: EditUrlRequest) => {
    return api.put<Url>(`/url/${id}`, data);
  },

  delete: async (id: string) => {
    return api.delete<void>(`/url/${id}`);
  },
};
