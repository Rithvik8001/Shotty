import type { ApiResponse } from "@/types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export class ApiError extends Error {
  code: string;
  details?: Array<{ field: string; message: string; code: string }>;

  constructor(
    message: string,
    code: string,
    details?: Array<{ field: string; message: string; code: string }>
  ) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.details = details;
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  const data: ApiResponse<T> = await response.json();

  if (!data.success) {
    throw new ApiError(data.error.message, data.error.code, data.error.details);
  }

  return data.data as T;
}

interface FetchOptions extends RequestInit {
  params?: Record<string, string>;
}

async function apiFetch<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { params, ...fetchOptions } = options;

  let url = `${API_BASE_URL}${endpoint}`;

  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }

  const defaultOptions: RequestInit = {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, { ...defaultOptions, ...fetchOptions });
    return await handleResponse<T>(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    // Network or other errors
    if (error instanceof Error) {
      throw new ApiError(error.message, "NETWORK_ERROR");
    }

    throw new ApiError("An unexpected error occurred", "UNKNOWN_ERROR");
  }
}

export const api = {
  get: <T>(endpoint: string, options?: FetchOptions) =>
    apiFetch<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(endpoint: string, data?: unknown, options?: FetchOptions) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T>(endpoint: string, data?: unknown, options?: FetchOptions) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T>(endpoint: string, options?: FetchOptions) =>
    apiFetch<T>(endpoint, { ...options, method: "DELETE" }),
};
