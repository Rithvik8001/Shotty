export interface ApiError {
  success: false;
  error: {
    message: string;
    code: string;
    details?: Array<{
      field: string;
      message: string;
      code: string;
    }>;
  };
}

export interface ApiSuccess<T> {
  success: true;
  message: string;
  data?: T;
  count?: number;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// User Types
export interface User {
  userId: string;
  name: string;
  emailId: string;
}

export interface SignupRequest {
  name: string;
  emailId: string;
  password: string;
}

export interface LoginRequest {
  emailId: string;
  password: string;
}

export interface AuthResponse {
  userId: string;
  name: string;
  emailId: string;
}

// URL Types
export interface Url {
  _id: string;
  originalUrl: string;
  shortUrl: string;
  clicks: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUrlRequest {
  originalUrl: string;
}

export interface CreateUrlResponse {
  shortUrl: string;
  originalUrl: string;
  clicks: number;
}

export interface EditUrlRequest {
  originalUrl: string;
}
