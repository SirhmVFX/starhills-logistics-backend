const { Prisma } = require("@prisma/client");

const errorHandler = (err, req, res, next) => {
  console.error(err); // Log the error for debugging

  // Default error response
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors = err.errors;

  // Handle specific error types
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Handle Prisma errors
    switch (err.code) {
      case "P2002":
        statusCode = 409;
        message = "A record with this data already exists";
        errors = { [err.meta.target[0]]: "This value is already in use" };
        break;
      case "P2025":
        statusCode = 404;
        message = "The requested record was not found";
        break;
      default:
        message = "Database error occurred";
    }
  } else if (err.name === "ValidationError") {
    // Handle Joi or other validation errors
    statusCode = 400;
    message = "Validation Error";
    errors = {};
    err.details.forEach((error) => {
      errors[error.context.key] = error.message;
    });
  } else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  } else if (err.name === "UnauthorizedError") {
    statusCode = 401;
    message = "Unauthorized";
  }

  // Development error response (includes stack trace)
  const response = {
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    ...(errors && { errors }),
  };

  // Remove stack trace in production
  if (process.env.NODE_ENV === "production") {
    delete response.stack;
  }

  res.status(statusCode).json(response);
};

// Success response handler middleware
const successResponse = (req, res, next) => {
  // Store the original json method
  const originalJson = res.json;

  // Override the json method
  res.json = function (data) {
    // Only format successful responses (2xx status codes)
    if (res.statusCode >= 200 && res.statusCode < 300) {
      // If data already has a success field, don't wrap it
      if (data && typeof data === "object" && "success" in data) {
        return originalJson.call(this, data);
      }

      // Wrap the response in a success object
      const response = {
        success: true,
        data,
      };

      // Handle pagination if present
      if (data && data.pagination) {
        response.pagination = data.pagination;
        delete data.pagination;
      }

      return originalJson.call(this, response);
    }

    // For non-2xx status codes, don't wrap the response
    return originalJson.call(this, data);
  };

  next();
};

module.exports = {
  errorHandler,
  successResponse,
  // Export common HTTP errors for easy throwing
  BadRequestError: (message = "Bad Request", errors) => {
    const error = new Error(message);
    error.statusCode = 400;
    if (errors) error.errors = errors;
    return error;
  },
  UnauthorizedError: (message = "Unauthorized") => {
    const error = new Error(message);
    error.statusCode = 401;
    return error;
  },
  ForbiddenError: (message = "Forbidden") => {
    const error = new Error(message);
    error.statusCode = 403;
    return error;
  },
  NotFoundError: (message = "Not Found") => {
    const error = new Error(message);
    error.statusCode = 404;
    return error;
  },
  ConflictError: (message = "Conflict") => {
    const error = new Error(message);
    error.statusCode = 409;
    return error;
  },
  ValidationError: (message = "Validation Error", errors) => {
    const error = new Error(message);
    error.statusCode = 422;
    error.errors = errors;
    return error;
  },
};
