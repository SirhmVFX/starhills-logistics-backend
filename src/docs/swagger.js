// src/docs/swagger.js
export default {
  openapi: "3.0.0",
  info: {
    title: "Starhills Logistics API",
    version: "1.0.0",
    description: "API documentation for Starhills Logistics",
  },
  servers: [
    {
      url: "http://localhost:3000/",
      description: "Development server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      // Common Schemas
      Error: {
        type: "object",
        properties: {
          message: { type: "string" },
          error: { type: "string" },
        },
      },

      // Auth Schemas
      User: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          email: { type: "string", format: "email" },
          phone: { type: "string" },
          fullName: { type: "string" },
          isEmailVerified: { type: "boolean" },
          role: { type: "string", enum: ["CUSTOMER", "ADMIN", "DRIVER"] },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      RegisterRequest: {
        type: "object",
        required: ["email", "phone", "password", "fullName"],
        properties: {
          email: { type: "string", format: "email" },
          phone: { type: "string" },
          password: { type: "string", format: "password", minLength: 8 },
          fullName: { type: "string" },
        },
      },
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string", format: "password" },
        },
      },
      VerifyOtpRequest: {
        type: "object",
        required: ["email", "otp"],
        properties: {
          email: { type: "string", format: "email" },
          otp: { type: "string" },
        },
      },
      ForgotPasswordRequest: {
        type: "object",
        required: ["email"],
        properties: {
          email: { type: "string", format: "email" },
        },
      },
      ResetPasswordRequest: {
        type: "object",
        required: ["email", "otp", "newPassword", "confirmPassword"],
        properties: {
          email: { type: "string", format: "email" },
          otp: { type: "string" },
          newPassword: { type: "string", format: "password" },
          confirmPassword: { type: "string", format: "password" },
        },
      },
      Promotion: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          title: { type: "string", example: "Summer Sale" },
          code: { type: "string", example: "SUMMER20" },
          discount: { type: "number", format: "float", example: 20.5 },
          expiryDate: { type: "string", format: "date-time" },
          isActive: { type: "boolean", example: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      CreatePromotionRequest: {
        type: "object",
        required: ["title", "code", "discount", "expiryDate"],
        properties: {
          title: { type: "string", example: "Summer Sale" },
          code: { type: "string", example: "SUMMER20" },
          discount: { type: "number", format: "float", example: 20.5 },
          expiryDate: {
            type: "string",
            format: "date-time",
            example: "2024-12-31T23:59:59.000Z",
          },
          isActive: { type: "boolean", example: true },
        },
      },
      UpdatePromotionRequest: {
        type: "object",
        properties: {
          title: { type: "string", example: "Summer Sale Updated" },
          code: { type: "string", example: "SUMMER25" },
          discount: { type: "number", format: "float", example: 25.0 },
          expiryDate: {
            type: "string",
            format: "date-time",
            example: "2024-12-31T23:59:59.000Z",
          },
          isActive: { type: "boolean", example: true },
        },
      },
      Delivery: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          email: { type: "string", format: "email" },
          phone: { type: "string" },
          address: { type: "string" },
          latitude: { type: "number", format: "float" },
          longitude: { type: "number", format: "float" },
          status: {
            type: "string",
            enum: [
              "address_validated",
              "shipment_created",
              "in_transit",
              "delivered",
              "cancelled",
            ],
          },
          trackingNumber: { type: "string" },
          shipbubbleId: { type: "string" },
          validationResponse: { type: "object" },
          metadata: { type: "object" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },

      Shipment: {
        type: "object",
        properties: {
          id: { type: "string" },
          trackingNumber: { type: "string" },
          status: { type: "string" },
          labelUrl: { type: "string", format: "uri" },
          createdAt: { type: "string", format: "date-time" },
        },
      },

      Rating: {
        type: "object",
        properties: {
          id: { type: "string" },
          deliveryId: { type: "string" },
          userId: { type: "string" },
          rating: { type: "number", minimum: 1, maximum: 5 },
          comment: { type: "string", nullable: true },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      Profile: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          profilePicture: {
            type: "string",
            description: "URL to the profile picture",
          },
          nin: { type: "string" },
          ninDocument: { type: "string" },
          selfie: { type: "string" },
          bvn: { type: "string" },
        },
      },
      Wallet: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          balance: { type: "number", format: "float" },
        },
      },
      BankAccount: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          accountNumber: { type: "string" },
          accountName: { type: "string" },
          bankName: { type: "string" },
          bvn: { type: "string" },
          verified: { type: "boolean" },
        },
      },
      AuthResponse: {
        type: "object",
        properties: {
          message: { type: "string" },
          user: { $ref: "#/components/schemas/User" },
          accessToken: { type: "string" },
          refreshToken: { type: "string" },
        },
      },
    },
  },
  tags: [
    {
      name: "Authentication",
      description: "User authentication and authorization",
    },
    {
      name: "Users",
      description: "User management",
    },
    {
      name: "User Profile",
      description: "User profile management",
    },
    {
      name: "Deliveries",
      description: "Delivery management endpoints",
    },
  ],
  paths: {
    // Auth Endpoints
    "/api/v1/auth/resend-otp": {
      post: {
        tags: ["Authentication"],
        summary: "Resend OTP to user's email",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email"],
                properties: {
                  email: {
                    type: "string",
                    format: "email",
                    description: "User's email address",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "OTP resent successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "OTP resent successfully. Check your email.",
                    },
                  },
                },
              },
            },
          },
          400: {
            $ref: "#/components/responses/BadRequest",
          },
          404: {
            description: "User not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
                example: {
                  message: "User not found for this email",
                },
              },
            },
          },
          500: {
            $ref: "#/components/responses/ServerError",
          },
        },
      },
    },
    "/api/v1/auth/dev-reset-user": {
      post: {
        tags: ["Authentication"],
        summary: "[Development Only] Reset user data (for testing purposes)",
        description:
          "⚠️ WARNING: This endpoint is for development use only and should be disabled in production. It will permanently delete the user and all associated data.",
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email"],
                properties: {
                  email: {
                    type: "string",
                    format: "email",
                    description: "Email of the user to reset",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "User data reset successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example:
                        "Data cleared successfully (user, wallet, OTP removed).",
                    },
                  },
                },
              },
            },
          },
          400: {
            $ref: "#/components/responses/BadRequest",
          },
          401: {
            $ref: "#/components/responses/Unauthorized",
          },
          403: {
            $ref: "#/components/responses/Forbidden",
          },
          404: {
            description: "User not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
                example: {
                  message: "No user found to delete",
                },
              },
            },
          },
          500: {
            $ref: "#/components/responses/ServerError",
          },
        },
      },
    },
    "/api/v1/auth/register": {
      post: {
        tags: ["Authentication"],
        summary: "Register a new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/RegisterRequest",
              },
            },
          },
        },
        responses: {
          201: {
            description: "User registered successfully. OTP sent to email.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/AuthResponse",
                },
              },
            },
          },
          400: {
            description: "Invalid input or user already exists",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/auth/verify-otp": {
      post: {
        tags: ["Authentication"],
        summary: "Verify OTP sent to user's email",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/VerifyOtpRequest",
              },
            },
          },
        },
        responses: {
          200: {
            description: "OTP verified successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/AuthResponse",
                },
              },
            },
          },
          400: {
            description: "Invalid OTP or OTP expired",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/auth/login": {
      post: {
        tags: ["Authentication"],
        summary: "User login",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/LoginRequest",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Login successful",
            headers: {
              "Set-Cookie": {
                schema: {
                  type: "string",
                  description:
                    "Contains access_token and refresh_token as HTTP-only cookies",
                },
              },
            },
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/AuthResponse",
                },
              },
            },
          },
          400: {
            description: "Invalid credentials",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/auth/logout": {
      post: {
        tags: ["Authentication"],
        summary: "Logout user (clear cookies)",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Logged out successfully",
          },
          401: {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/auth/forgot-password": {
      post: {
        tags: ["Authentication"],
        summary: "Request password reset OTP",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ForgotPasswordRequest",
              },
            },
          },
        },
        responses: {
          200: {
            description: "OTP sent to email",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                  },
                },
              },
            },
          },
          400: {
            description: "User not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/auth/verify-password-otp": {
      post: {
        tags: ["Authentication"],
        summary: "Verify password reset OTP",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/VerifyOtpRequest",
              },
            },
          },
        },
        responses: {
          200: {
            description: "OTP verified successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                  },
                },
              },
            },
          },
          400: {
            description: "Invalid OTP or OTP expired",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/auth/reset-password": {
      post: {
        tags: ["Authentication"],
        summary: "Reset password",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ResetPasswordRequest",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Password reset successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                  },
                },
              },
            },
          },
          400: {
            description: "Invalid input or OTP",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/auth/refresh-token": {
      post: {
        tags: ["Authentication"],
        summary: "Refresh access token",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["refreshToken"],
                properties: {
                  refreshToken: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Token refreshed successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    accessToken: { type: "string" },
                  },
                },
              },
            },
          },
          401: {
            description: "Invalid or expired refresh token",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/auth/me": {
      get: {
        tags: ["Authentication"],
        summary: "Get current user profile",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "User profile retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/User",
                },
              },
            },
          },
          401: {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/api/user/me": {
      get: {
        tags: ["User Profile"],
        summary: "Get current user's profile",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "User profile retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/User",
                  properties: {
                    profile: { $ref: "#/components/schemas/Profile" },
                    wallet: { $ref: "#/components/schemas/Wallet" },
                    bankAccount: { $ref: "#/components/schemas/BankAccount" },
                  },
                },
              },
            },
          },
          401: { $ref: "#/components/responses/Unauthorized" },
          500: { $ref: "#/components/responses/ServerError" },
        },
      },
    },
    "/api/user/me/update": {
      put: {
        tags: ["User Profile"],
        summary: "Update user profile",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  fullName: { type: "string" },
                  email: { type: "string", format: "email" },
                  phone: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Profile updated successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" },
              },
            },
          },
          400: { $ref: "#/components/responses/BadRequest" },
          401: { $ref: "#/components/responses/Unauthorized" },
          500: { $ref: "#/components/responses/ServerError" },
        },
      },
    },
    "/api/user/me/upload-picture": {
      post: {
        tags: ["User Profile"],
        summary: "Upload or update profile picture",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  profilePicture: {
                    type: "string",
                    format: "binary",
                    description: "Image file (JPG, PNG, JPEG) up to 5MB",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Profile picture updated successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" },
              },
            },
          },
          400: {
            description: "No file uploaded or invalid file type",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          401: { $ref: "#/components/responses/Unauthorized" },
          500: { $ref: "#/components/responses/ServerError" },
        },
      },
    },
    // In src/docs/swagger.js - Add to the paths object

    "/api/v1/delivery/deliveries": {
      post: {
        tags: ["Deliveries"],
        summary: "Create a new delivery",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: [
                  "name",
                  "email",
                  "phone",
                  "latitude",
                  "longitude",
                  "address",
                ],
                properties: {
                  name: { type: "string", example: "John Doe" },
                  email: {
                    type: "string",
                    format: "email",
                    example: "john@example.com",
                  },
                  phone: { type: "string", example: "+1234567890" },
                  latitude: {
                    type: "number",
                    format: "float",
                    example: 6.5244,
                  },
                  longitude: {
                    type: "number",
                    format: "float",
                    example: 3.3792,
                  },
                  address: { type: "string", example: "123 Main St, Lagos" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Delivery created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "number", example: 200 },
                    message: {
                      type: "string",
                      example: "Delivery created successfully",
                    },
                    data: {
                      type: "object",
                      properties: {
                        delivery: { $ref: "#/components/schemas/Delivery" },
                        validation: { type: "object" },
                      },
                    },
                  },
                },
              },
            },
          },
          400: { $ref: "#/components/responses/BadRequest" },
          401: { $ref: "#/components/responses/Unauthorized" },
          500: { $ref: "#/components/responses/ServerError" },
        },
      },
    },

    // Track Delivery
    "/api/v1/delivery/deliveries/track": {
      get: {
        tags: ["Deliveries"],
        summary: "Track a delivery",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "trackingNumber",
            in: "query",
            required: true,
            schema: { type: "string" },
            description: "Tracking number of the delivery",
          },
        ],
        responses: {
          200: {
            description: "Delivery tracked successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "number", example: 200 },
                    message: {
                      type: "string",
                      example: "Delivery tracked successfully",
                    },
                    data: { type: "object" }, // Adjust based on ShipBubble response
                  },
                },
              },
            },
          },
          400: { $ref: "#/components/responses/BadRequest" },
          401: { $ref: "#/components/responses/Unauthorized" },
          500: { $ref: "#/components/responses/ServerError" },
        },
      },
    },

    // Create Shipment
    "/api/v1/delivery/deliveries/{id}/shipments": {
      post: {
        tags: ["Deliveries"],
        summary: "Create a shipment for a delivery",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "ID of the delivery",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["parcel", "pickupAddressId"],
                properties: {
                  parcel: {
                    type: "object",
                    properties: {
                      weight: { type: "number", example: 1.5 },
                      length: { type: "number", example: 20 },
                      width: { type: "number", example: 15 },
                      height: { type: "number", example: 10 },
                      items: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            name: { type: "string", example: "Product" },
                            quantity: { type: "number", example: 1 },
                            value: { type: "number", example: 1000 },
                          },
                        },
                      },
                    },
                  },
                  pickupAddressId: { type: "string", example: "pickup_123" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Shipment created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "number", example: 200 },
                    message: {
                      type: "string",
                      example: "Shipment created successfully",
                    },
                    data: { $ref: "#/components/schemas/Shipment" },
                  },
                },
              },
            },
          },
          400: { $ref: "#/components/responses/BadRequest" },
          401: { $ref: "#/components/responses/Unauthorized" },
          404: { $ref: "#/components/responses/NotFound" },
          500: { $ref: "#/components/responses/ServerError" },
        },
      },
    },

    // Get Delivery Details
    "/api/v1/delivery/deliveries/{id}": {
      get: {
        tags: ["Deliveries"],
        summary: "Get delivery details",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "ID of the delivery",
          },
        ],
        responses: {
          200: {
            description: "Delivery details retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "number", example: 200 },
                    message: {
                      type: "string",
                      example: "Delivery details retrieved successfully",
                    },
                    data: { $ref: "#/components/schemas/Delivery" },
                  },
                },
              },
            },
          },
          401: { $ref: "#/components/responses/Unauthorized" },
          404: { $ref: "#/components/responses/NotFound" },
          500: { $ref: "#/components/responses/ServerError" },
        },
      },
    },

    // Cancel Delivery
    "/api/v1/delivery/deliveries/{id}": {
      delete: {
        tags: ["Deliveries"],
        summary: "Cancel a delivery",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "ID of the delivery to cancel",
          },
        ],
        responses: {
          200: {
            description: "Delivery cancelled successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "number", example: 200 },
                    message: {
                      type: "string",
                      example: "Delivery cancelled successfully",
                    },
                    data: { $ref: "#/components/schemas/Delivery" },
                  },
                },
              },
            },
          },
          400: { $ref: "#/components/responses/BadRequest" },
          401: { $ref: "#/components/responses/Unauthorized" },
          404: { $ref: "#/components/responses/NotFound" },
          500: { $ref: "#/components/responses/ServerError" },
        },
      },
    },

    // Rate Delivery
    "/api/v1/delivery/deliveries/{id}/rate": {
      post: {
        tags: ["Deliveries"],
        summary: "Rate a delivery",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "ID of the delivery to rate",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["rating"],
                properties: {
                  rating: {
                    type: "number",
                    minimum: 1,
                    maximum: 5,
                    example: 5,
                    description: "Rating from 1 to 5",
                  },
                  comment: {
                    type: "string",
                    example: "Great service!",
                    description: "Optional comment about the delivery",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Delivery rated successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "number", example: 200 },
                    message: {
                      type: "string",
                      example: "Delivery rated successfully",
                    },
                    data: { $ref: "#/components/schemas/Rating" },
                  },
                },
              },
            },
          },
          400: { $ref: "#/components/responses/BadRequest" },
          401: { $ref: "#/components/responses/Unauthorized" },
          404: { $ref: "#/components/responses/NotFound" },
          500: { $ref: "#/components/responses/ServerError" },
        },
      },
    },

    // In the paths section, add the promotion endpoints:

    "/api/v1/promotion": {
      post: {
        tags: ["Promotions"],
        summary: "Create a new promotion",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreatePromotionRequest" },
            },
          },
        },
        responses: {
          201: {
            description: "Promotion created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: {
                      type: "string",
                      example: "Promotion created successfully",
                    },
                    data: { $ref: "#/components/schemas/Promotion" },
                  },
                },
              },
            },
          },
          400: { $ref: "#/components/responses/BadRequest" },
          401: { $ref: "#/components/responses/Unauthorized" },
          500: { $ref: "#/components/responses/ServerError" },
        },
      },
    },

    // Get Promotion by Code
    "/api/v1/promotion/code/{code}": {
      get: {
        tags: ["Promotions"],
        summary: "Get promotion by code",
        parameters: [
          {
            name: "code",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Promotion code",
          },
        ],
        responses: {
          200: {
            description: "Promotion retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { $ref: "#/components/schemas/Promotion" },
                  },
                },
              },
            },
          },
          404: { $ref: "#/components/responses/NotFound" },
          400: { $ref: "#/components/responses/BadRequest" },
        },
      },
    },

    // Get All Promotions
    "/api/v1/promotion": {
      get: {
        tags: ["Promotions"],
        summary: "Get all promotions",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Promotions retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Promotion" },
                    },
                  },
                },
              },
            },
          },
          401: { $ref: "#/components/responses/Unauthorized" },
          500: { $ref: "#/components/responses/ServerError" },
        },
      },
    },

    // Update Promotion
    "/api/v1/promotion/{id}": {
      put: {
        tags: ["Promotions"],
        summary: "Update a promotion",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
            description: "Promotion ID",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdatePromotionRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Promotion updated successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: {
                      type: "string",
                      example: "Promotion updated successfully",
                    },
                    data: { $ref: "#/components/schemas/Promotion" },
                  },
                },
              },
            },
          },
          400: { $ref: "#/components/responses/BadRequest" },
          401: { $ref: "#/components/responses/Unauthorized" },
          404: { $ref: "#/components/responses/NotFound" },
          500: { $ref: "#/components/responses/ServerError" },
        },
      },

      // Delete Promotion
      delete: {
        tags: ["Promotions"],
        summary: "Delete a promotion",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
            description: "Promotion ID",
          },
        ],
        responses: {
          200: {
            description: "Promotion deleted successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: {
                      type: "string",
                      example: "Promotion deleted successfully",
                    },
                  },
                },
              },
            },
          },
          400: { $ref: "#/components/responses/BadRequest" },
          401: { $ref: "#/components/responses/Unauthorized" },
          404: { $ref: "#/components/responses/NotFound" },
          500: { $ref: "#/components/responses/ServerError" },
        },
      },
    },
  },
};
