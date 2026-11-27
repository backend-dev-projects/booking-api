import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { HttpError } from "../errors/http-error.js";
import type { ErrorResponse } from "../errors/error-response.js";

export const errorHandler: ErrorRequestHandler = (
  error: unknown,
  _req,
  res,
  next,
) => {
  if (res.headersSent) {
    next(error);
    return;
  }

  // Zod validation errors
  if (error instanceof ZodError) {
    const response: ErrorResponse = {
      status: 400,
      issues: error.issues.map((issue) => ({
        code: issue.code,
        message: issue.message,
        path: issue.path.map(String),
      })),
    };

    res.status(response.status).json(response);
    return;
  }

  // Application errors
  if (error instanceof HttpError) {
    const response: ErrorResponse = {
      status: error.status,
      issues: [
        {
          message: error.message,
          path: error.path?.map(String) ?? [],
        },
      ],
    };

    res.status(response.status).json(response);
    return;
  }

  // Unexpected errors
  console.error(error);

  const response: ErrorResponse = {
    status: 500,
    issues: [
      {
        message: "An unexpected error occurred.",
      },
    ],
  };

  res.status(response.status).json(response);
};
