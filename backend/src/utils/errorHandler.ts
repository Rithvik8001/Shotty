import { type Response } from "express";
import { ZodError } from "zod";

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

export const handleZodError = (zodError: ZodError): ApiError => {
  const fieldErrors = zodError.issues.map((issue) => ({
    field: issue.path.join(".") || "unknown",
    message: issue.message,
    code: issue.code,
  }));

  const mainError = fieldErrors[0];
  const errorMessage =
    fieldErrors.length === 1 && mainError
      ? mainError.message
      : `Validation failed for ${fieldErrors.length} field(s)`;

  return {
    success: false,
    error: {
      message: errorMessage,
      code: "VALIDATION_ERROR",
      details: fieldErrors,
    },
  };
};

export const handleDatabaseError = (error: unknown): ApiError => {
  if (error instanceof Error) {
    // Handle MongoDB duplicate key error
    if (
      error.message.includes("E11000") ||
      error.message.includes("duplicate key")
    ) {
      return {
        success: false,
        error: {
          message: "A record with this information already exists",
          code: "DUPLICATE_ERROR",
        },
      };
    }

    // Handle MongoDB validation errors
    if (error.message.includes("validation failed")) {
      return {
        success: false,
        error: {
          message: "Database validation failed. Please check your input data",
          code: "DATABASE_VALIDATION_ERROR",
        },
      };
    }

    // Handle MongoDB cast errors
    if (error.message.includes("Cast to ObjectId failed")) {
      return {
        success: false,
        error: {
          message: "Invalid ID format provided",
          code: "INVALID_ID_ERROR",
        },
      };
    }
  }

  return {
    success: false,
    error: {
      message: "An unexpected database error occurred",
      code: "DATABASE_ERROR",
    },
  };
};

export const handleGenericError = (error: unknown): ApiError => {
  if (error instanceof Error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: "INTERNAL_ERROR",
      },
    };
  }

  return {
    success: false,
    error: {
      message: "An unexpected error occurred",
      code: "UNKNOWN_ERROR",
    },
  };
};

export const sendErrorResponse = (
  res: Response,
  statusCode: number,
  apiError: ApiError
) => {
  return res.status(statusCode).json(apiError);
};

export const sendSuccessResponse = <T>(
  res: Response,
  statusCode: number,
  apiSuccess: ApiSuccess<T>
) => {
  return res.status(statusCode).json(apiSuccess);
};

export const createSuccessResponse = <T>(
  message: string,
  data?: T,
  count?: number
): ApiSuccess<T> => {
  const response: ApiSuccess<T> = {
    success: true,
    message,
  };

  if (data !== undefined) {
    response.data = data;
  }

  if (count !== undefined) {
    response.count = count;
  }

  return response;
};

export const createErrorResponse = (
  message: string,
  code: string,
  details?: Array<{ field: string; message: string; code: string }>
): ApiError => {
  const errorObj: ApiError["error"] = {
    message,
    code,
  };

  if (details) {
    errorObj.details = details;
  }

  return {
    success: false,
    error: errorObj,
  };
};
