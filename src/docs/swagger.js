export default {
  openapi: "3.0.0",
  info: {
    title: "StarHills Logistics API",
    description:
      "Complete logistics management API with Shipbubble integration",
    version: "1.0.0",
    contact: {
      name: "API Support",
      email: "support@logistics.com",
    },
    license: {
      name: "MIT",
      url: "https://opensource.org/licenses/MIT",
    },
  },
  servers: [
    {
      url: "http://localhost:3000/api/v1",
      description: "Development server",
    },
    {
      url: "https://starhills-logistcis-be-avbmfugsewgbcvg7.canadacentral-01.azurewebsites.net/api/v1",
      description: "Production server",
    },
  ],
  tags: [
    {
      name: "Authentication",
      description: "User authentication endpoints",
    },
    {
      name: "User",
      description: "User profile management",
    },
    {
      name: "Wallet",
      description: "Wallet and payment operations",
    },
    {
      name: "Addresses",
      description: "Address management",
    },
    {
      name: "Rates",
      description: "Shipping rate calculations",
    },
    {
      name: "Couriers",
      description: "Courier information",
    },
    {
      name: "Packages",
      description: "Package categories and dimensions",
    },
    {
      name: "Insurance",
      description: "Insurance operations",
    },
    {
      name: "Cash on Delivery",
      description: "COD validation",
    },
    {
      name: "Shipments",
      description: "Shipment management",
    },
    {
      name: "Tracking",
      description: "Shipment tracking",
    },
    {
      name: "Returns",
      description: "Return shipments",
    },
    {
      name: "Webhooks",
      description: "Webhook handling",
    },
    {
      name: "Notifications",
      description: "User notifications",
    },
    {
      name: "Reports",
      description: "Analytics and reports",
    },
    {
      name: "Support",
      description: "Customer support",
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Enter your JWT token",
      },
    },
    schemas: {
      ShipbubbleConfig: {
        type: "object",
        description: "Shipbubble API configuration (system-level)",
        properties: {
          apiKey: {
            type: "string",
            description:
              "System-level Shipbubble API key configured in environment variables (SHIPBUBBLE_API_KEY)",
            readOnly: true,
          },
        },
      },
    },
    // schemas: {
    //   Error: {
    //     type: "object",
    //     properties: {
    //       success: {
    //         type: "boolean",
    //         example: false,
    //       },
    //       message: {
    //         type: "string",
    //         example: "Error message",
    //       },
    //       error: {
    //         type: "string",
    //         example: "Detailed error information",
    //       },
    //     },
    //   },
    //   User: {
    //     type: "object",
    //     properties: {
    //       id: {
    //         type: "string",
    //         example: "507f1f77bcf86cd799439011",
    //       },
    //       email: {
    //         type: "string",
    //         example: "user@example.com",
    //       },
    //       fullName: {
    //         type: "string",
    //         example: "John Doe",
    //       },
    //       phone: {
    //         type: "string",
    //         example: "+2348012345678",
    //       },
    //       businessName: {
    //         type: "string",
    //         example: "Doe Enterprises",
    //       },
    //       isVerified: {
    //         type: "boolean",
    //         example: true,
    //       },
    //       hasShipbubbleKey: {
    //         type: "boolean",
    //         example: true,
    //       },
    //     },
    //   },
    //   Shipment: {
    //     type: "object",
    //     properties: {
    //       id: {
    //         type: "string",
    //       },
    //       userId: {
    //         type: "string",
    //       },
    //       trackingNumber: {
    //         type: "string",
    //         example: "SB123456789",
    //       },
    //       shipbubbleId: {
    //         type: "string",
    //       },
    //       senderName: {
    //         type: "string",
    //         example: "John Doe",
    //       },
    //       senderPhone: {
    //         type: "string",
    //         example: "+2348012345678",
    //       },
    //       senderEmail: {
    //         type: "string",
    //         example: "sender@example.com",
    //       },
    //       senderAddress: {
    //         type: "string",
    //       },
    //       senderCity: {
    //         type: "string",
    //       },
    //       senderState: {
    //         type: "string",
    //       },
    //       senderCountry: {
    //         type: "string",
    //       },
    //       receiverName: {
    //         type: "string",
    //       },
    //       receiverPhone: {
    //         type: "string",
    //       },
    //       receiverEmail: {
    //         type: "string",
    //       },
    //       receiverAddress: {
    //         type: "string",
    //       },
    //       receiverCity: {
    //         type: "string",
    //       },
    //       receiverState: {
    //         type: "string",
    //       },
    //       receiverCountry: {
    //         type: "string",
    //       },
    //       status: {
    //         type: "string",
    //         enum: [
    //           "created",
    //           "picked_up",
    //           "in_transit",
    //           "delivered",
    //           "cancelled",
    //           "failed",
    //         ],
    //       },
    //       amount: {
    //         type: "number",
    //         example: 5000,
    //       },
    //       waybillUrl: {
    //         type: "string",
    //       },
    //       createdAt: {
    //         type: "string",
    //         format: "date-time",
    //       },
    //       deliveredAt: {
    //         type: "string",
    //         format: "date-time",
    //       },
    //     },
    //   },
    //   Address: {
    //     type: "object",
    //     properties: {
    //       id: {
    //         type: "string",
    //       },
    //       userId: {
    //         type: "string",
    //       },
    //       name: {
    //         type: "string",
    //         example: "Home Address",
    //       },
    //       address: {
    //         type: "string",
    //         example: "123 Main Street",
    //       },
    //       city: {
    //         type: "string",
    //         example: "Lagos",
    //       },
    //       state: {
    //         type: "string",
    //         example: "Lagos",
    //       },
    //       country: {
    //         type: "string",
    //         example: "Nigeria",
    //       },
    //       postalCode: {
    //         type: "string",
    //         example: "100001",
    //       },
    //       isDefault: {
    //         type: "boolean",
    //         example: false,
    //       },
    //     },
    //   },
    //   Notification: {
    //     type: "object",
    //     properties: {
    //       id: {
    //         type: "string",
    //       },
    //       userId: {
    //         type: "string",
    //       },
    //       type: {
    //         type: "string",
    //         example: "shipment_delivered",
    //       },
    //       title: {
    //         type: "string",
    //         example: "Shipment Delivered",
    //       },
    //       message: {
    //         type: "string",
    //         example: "Your shipment has been delivered",
    //       },
    //       isRead: {
    //         type: "boolean",
    //         example: false,
    //       },
    //       createdAt: {
    //         type: "string",
    //         format: "date-time",
    //       },
    //     },
    //   },
    // },
  },
  paths: {
    "/auth/register": {
      post: {
        tags: ["Authentication"],
        summary: "Register a new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "phone", "password", "fullName"],
                properties: {
                  email: { type: "string", format: "email" },
                  phone: { type: "string" },
                  password: { type: "string", minLength: 8 },
                  fullName: { type: "string" },
                  businessName: { type: "string" },
                  address: { type: "string" },
                },
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
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/auth/verify-otp": {
      post: {
        tags: ["Authentication"],
        summary: "Verify OTP",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "otp"],
                properties: {
                  email: { type: "string", format: "email" },
                  otp: { type: "string", minLength: 6, maxLength: 6 },
                },
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
                    success: { type: "boolean", example: true },
                    user: { $ref: "#/components/schemas/User" },
                    token: { type: "string" },
                    refreshToken: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/auth/resend-otp": {
      post: {
        tags: ["Authentication"],
        summary: "Resend OTP",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email"],
                properties: {
                  email: { type: "string", format: "email" },
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
                    success: { type: "boolean", example: true },
                    message: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/auth/login": {
      post: {
        tags: ["Authentication"],
        summary: "User login",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Login successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    user: { $ref: "#/components/schemas/User" },
                    token: { type: "string" },
                    refreshToken: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/auth/logout": {
      post: {
        tags: ["Authentication"],
        summary: "Logout user",
        security: [
          {
            BearerAuth: [],
          },
        ],
        responses: {
          200: {
            description: "Logout successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: true,
                    },
                    message: {
                      type: "string",
                      example: "Logged out successfully",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/auth/refresh-token": {
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
                    success: { type: "boolean", example: true },
                    token: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/auth/forgot-password": {
      post: {
        tags: ["Authentication"],
        summary: "Request password reset OTP",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email"],
                properties: {
                  email: { type: "string", format: "email" },
                },
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
                    success: { type: "boolean", example: true },
                    message: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/auth/verify-password-otp": {
      post: {
        tags: ["Authentication"],
        summary: "Verify password reset OTP",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "otp"],
                properties: {
                  email: { type: "string", format: "email" },
                  otp: { type: "string", minLength: 6, maxLength: 6 },
                },
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
                    success: { type: "boolean", example: true },
                    message: { type: "string" },
                    resetToken: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/auth/reset-password": {
      post: {
        tags: ["Authentication"],
        summary: "Reset password with OTP",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "otp", "newPassword"],
                properties: {
                  email: { type: "string", format: "email" },
                  otp: { type: "string" },
                  newPassword: { type: "string", minLength: 8 },
                },
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
                    success: { type: "boolean", example: true },
                    message: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/auth/verify-email": {
      post: {
        tags: ["Authentication"],
        summary: "Verify email address",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["token"],
                properties: {
                  token: {
                    type: "string",
                    example: "verification-token-here",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Email verified successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: true,
                    },
                    message: {
                      type: "string",
                      example: "Email verified successfully",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/auth/resend-verification": {
      post: {
        tags: ["Authentication"],
        summary: "Resend verification email",
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
                    example: "user@example.com",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Verification email sent",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: true,
                    },
                    message: {
                      type: "string",
                      example: "Verification email sent",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/auth/change-password": {
      put: {
        // Change from POST to PUT
        tags: ["Authentication"],
        summary: "Update user password",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["currentPassword", "newPassword"],
                properties: {
                  currentPassword: { type: "string" },
                  newPassword: { type: "string", minLength: 8 },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Password updated successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/users/me": {
      get: {
        tags: ["Users"],
        summary: "Get current user profile",
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: "User profile retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    user: { $ref: "#/components/schemas/User" },
                  },
                },
              },
            },
          },
        },
      },
      put: {
        tags: ["Users"],
        summary: "Update user profile",
        security: [{ BearerAuth: [] }],
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
                  profile: {
                    type: "object",
                    properties: {
                      address: { type: "string" },
                      city: { type: "string" },
                      state: { type: "string" },
                      country: { type: "string" },
                      postalCode: { type: "string" },
                    },
                  },
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
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    user: { $ref: "#/components/schemas/User" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/users/change-password": {
      put: {
        tags: ["Users"],
        summary: "Change user password",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["currentPassword", "newPassword"],
                properties: {
                  currentPassword: { type: "string" },
                  newPassword: { type: "string", minLength: 8 },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Password changed successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/users/account": {
      delete: {
        tags: ["Users"],
        summary: "Delete user account",
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: "Account deleted successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
    // Shipbubble API key is now managed at the system level via SHIPBUBBLE_API_KEY environment variable
    "/wallet/balance": {
      get: {
        tags: ["Wallet"],
        summary: "Get wallet balance",
        security: [
          {
            BearerAuth: [],
          },
        ],
        responses: {
          200: {
            description: "Balance retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: true,
                    },
                    balance: {
                      type: "number",
                      example: 50000,
                    },
                    currency: {
                      type: "string",
                      example: "NGN",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/wallet/fund-request": {
      post: {
        tags: ["Wallet"],
        summary: "Request wallet funding",
        security: [
          {
            BearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["amount"],
                properties: {
                  amount: {
                    type: "number",
                    example: 10000,
                  },
                  currency: {
                    type: "string",
                    example: "NGN",
                    default: "NGN",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Funding request created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: true,
                    },
                    message: {
                      type: "string",
                      example: "Funding request created",
                    },
                    data: {
                      type: "object",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/wallet/webhook/funding": {
      post: {
        tags: ["Wallet"],
        summary: "Handle funding webhook notifications",
        description:
          "This endpoint processes payment webhook notifications from the payment provider. It updates the wallet balance and transaction status based on the payment status.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["reference", "status", "amount"],
                properties: {
                  reference: {
                    type: "string",
                    description: "Unique reference for the transaction",
                    example: "FUND-1703262000000-abc12345",
                  },
                  status: {
                    type: "string",
                    enum: ["successful", "failed"],
                    description: "Status of the payment",
                  },
                  amount: {
                    type: "number",
                    description: "Amount that was funded",
                    example: 10000,
                  },
                  metadata: {
                    type: "object",
                    description: "Additional payment metadata",
                    properties: {
                      payment_method: {
                        type: "string",
                        example: "card",
                      },
                      payment_reference: {
                        type: "string",
                        example: "PAY-xyz789",
                      },
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Webhook processed successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: true,
                    },
                    message: {
                      type: "string",
                      example: "Wallet funded successfully",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Invalid request or transaction not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: false,
                    },
                    message: {
                      type: "string",
                      example: "Transaction not found",
                    },
                  },
                },
              },
            },
          },
          500: {
            description: "Server error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: false,
                    },
                    message: {
                      type: "string",
                      example: "Error processing webhook",
                    },
                    error: {
                      type: "string",
                      example: "Detailed error message",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/wallet/transactions": {
      get: {
        tags: ["Wallet"],
        summary: "Get wallet transactions",
        security: [
          {
            BearerAuth: [],
          },
        ],
        parameters: [
          {
            in: "query",
            name: "page",
            schema: {
              type: "integer",
              default: 1,
            },
            description: "Page number",
          },
          {
            in: "query",
            name: "limit",
            schema: {
              type: "integer",
              default: 20,
            },
            description: "Items per page",
          },
        ],
        responses: {
          200: {
            description: "Transactions retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: true,
                    },
                    transactions: {
                      type: "array",
                      items: {
                        type: "object",
                      },
                    },
                    pagination: {
                      type: "object",
                      properties: {
                        page: {
                          type: "integer",
                        },
                        limit: {
                          type: "integer",
                        },
                        total: {
                          type: "integer",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/addresses/validate": {
      post: {
        tags: ["Addresses"],
        summary: "Validate an address",
        security: [
          {
            BearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["address", "city", "state", "country"],
                properties: {
                  address: {
                    type: "string",
                    example: "123 Main Street",
                  },
                  city: {
                    type: "string",
                    example: "Lagos",
                  },
                  state: {
                    type: "string",
                    example: "Lagos",
                  },
                  country: {
                    type: "string",
                    example: "Nigeria",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Address validated",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: true,
                    },
                    valid: {
                      type: "boolean",
                      example: true,
                    },
                    validatedAddress: {
                      type: "string",
                    },
                    coordinates: {
                      type: "object",
                      properties: {
                        latitude: {
                          type: "number",
                        },
                        longitude: {
                          type: "number",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/addresses": {
      get: {
        tags: ["Addresses"],
        summary: "Get all addresses",
        security: [
          {
            BearerAuth: [],
          },
        ],
        responses: {
          200: {
            description: "Addresses retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: true,
                    },
                    addresses: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/Address",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Addresses"],
        summary: "Create new address",
        security: [
          {
            BearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "address", "city", "state", "country"],
                properties: {
                  name: {
                    type: "string",
                    example: "Home Address",
                  },
                  address: {
                    type: "string",
                    example: "123 Main Street",
                  },
                  city: {
                    type: "string",
                    example: "Lagos",
                  },
                  state: {
                    type: "string",
                    example: "Lagos",
                  },
                  country: {
                    type: "string",
                    example: "Nigeria",
                  },
                  postalCode: {
                    type: "string",
                    example: "100001",
                  },
                  isDefault: {
                    type: "boolean",
                    example: false,
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Address created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: true,
                    },
                    message: {
                      type: "string",
                      example: "Address created successfully",
                    },
                    address: {
                      $ref: "#/components/schemas/Address",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/addresses/{addressId}": {
      get: {
        tags: ["Addresses"],
        summary: "Get address by ID",
        security: [
          {
            BearerAuth: [],
          },
        ],
        parameters: [
          {
            in: "path",
            name: "addressId",
            required: true,
            schema: {
              type: "string",
            },
            description: "Address ID",
          },
        ],
        responses: {
          200: {
            description: "Address retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: true,
                    },
                    address: {
                      $ref: "#/components/schemas/Address",
                    },
                  },
                },
              },
            },
          },
          404: {
            description: "Address not found",
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
      put: {
        tags: ["Addresses"],
        summary: "Update address",
        security: [
          {
            BearerAuth: [],
          },
        ],
        parameters: [
          {
            in: "path",
            name: "addressId",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                  },
                  address: {
                    type: "string",
                  },
                  city: {
                    type: "string",
                  },
                  state: {
                    type: "string",
                  },
                  country: {
                    type: "string",
                  },
                  postalCode: {
                    type: "string",
                  },
                  isDefault: {
                    type: "boolean",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Address updated successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: true,
                    },
                    message: {
                      type: "string",
                      example: "Address updated successfully",
                    },
                    address: {
                      $ref: "#/components/schemas/Address",
                    },
                  },
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Addresses"],
        summary: "Delete address",
        security: [
          {
            BearerAuth: [],
          },
        ],
        parameters: [
          {
            in: "path",
            name: "addressId",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "Address deleted successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: true,
                    },
                    message: {
                      type: "string",
                      example: "Address deleted successfully",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/rates/calculate": {
      post: {
        tags: ["Rates"],
        summary: "Calculate shipping rates",
        security: [
          {
            BearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: [
                  "sender_address",
                  "sender_city",
                  "sender_state",
                  "sender_country",
                  "receiver_address",
                  "receiver_city",
                  "receiver_state",
                  "receiver_country",
                  "weight",
                  "dimension",
                  "category",
                ],
                properties: {
                  sender_address: {
                    type: "string",
                    example: "123 Sender Street",
                  },
                  sender_city: {
                    type: "string",
                    example: "Lagos",
                  },
                  sender_state: {
                    type: "string",
                    example: "Lagos",
                  },
                  sender_country: {
                    type: "string",
                    example: "Nigeria",
                  },
                  receiver_address: {
                    type: "string",
                    example: "456 Receiver Avenue",
                  },
                  receiver_city: {
                    type: "string",
                    example: "Abuja",
                  },
                  receiver_state: {
                    type: "string",
                    example: "FCT",
                  },
                  receiver_country: {
                    type: "string",
                    example: "Nigeria",
                  },
                  weight: {
                    type: "number",
                    example: 2.5,
                    description: "Weight in kg",
                  },
                  dimension: {
                    type: "string",
                    example: "small",
                  },
                  category: {
                    type: "string",
                    example: "electronics",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Rates calculated successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: true,
                    },
                    rates: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          courier: {
                            type: "string",
                            example: "DHL",
                          },
                          price: {
                            type: "number",
                            example: 5000,
                          },
                          estimatedDays: {
                            type: "integer",
                            example: 3,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/rates/calculate-selected": {
      post: {
        tags: ["Rates"],
        summary: "Calculate rates for selected couriers",
        security: [
          {
            BearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["courierIds"],
                properties: {
                  courierIds: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    example: ["courier_123", "courier_456"],
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Rates calculated successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: true,
                    },
                    rates: {
                      type: "array",
                      items: {
                        type: "object",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/rates/request/{requestToken}": {
      put: {
        tags: ["Rates"],
        summary: "Update rate request",
        security: [
          {
            BearerAuth: [],
          },
        ],
        parameters: [
          {
            in: "path",
            name: "requestToken",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Rate request updated",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: true,
                    },
                    data: {
                      type: "object",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/couriers": {
      get: {
        tags: ["Couriers"],
        summary: "Get all available couriers",
        security: [
          {
            BearerAuth: [],
          },
        ],
        responses: {
          200: {
            description: "Couriers retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: true,
                    },
                    couriers: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: {
                            type: "string",
                          },
                          name: {
                            type: "string",
                            example: "DHL",
                          },
                          logo: {
                            type: "string",
                          },
                          services: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/couriers/{courierId}": {
      get: {
        tags: ["Couriers"],
        summary: "Get courier by ID",
        security: [
          {
            BearerAuth: [],
          },
        ],
        parameters: [
          {
            in: "path",
            name: "courierId",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "Courier retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: true,
                    },
                    courier: {
                      type: "object",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/packages/categories": {
      get: {
        tags: ["Packages"],
        summary: "Get package categories",
        security: [
          {
            BearerAuth: [],
          },
        ],
        responses: {
          200: {
            description: "Categories retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: true,
                    },
                    categories: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: {
                            type: "string",
                          },
                          name: {
                            type: "string",
                            example: "Electronics",
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/packages/dimensions": {
      get: {
        tags: ["Packages"],
        summary: "Get package dimensions",
        security: [
          {
            BearerAuth: [],
          },
        ],
        responses: {
          200: {
            description: "Dimensions retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: true,
                    },
                    dimensions: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: {
                            type: "string",
                          },
                          name: {
                            type: "string",
                            example: "Small",
                          },
                          description: {
                            type: "string",
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/insurance/rates": {
      post: {
        tags: ["Insurance"],
        summary: "Get insurance rates",
        security: [
          {
            BearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["itemValue", "courierCode"],
                properties: {
                  itemValue: {
                    type: "number",
                    example: 50000,
                  },
                  courierCode: {
                    type: "string",
                    example: "dhl",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Insurance rates retrieved",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: true,
                    },
                    insuranceCode: {
                      type: "string",
                    },
                    premium: {
                      type: "number",
                      example: 500,
                    },
                    coverage: {
                      type: "number",
                      example: 50000,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/cod/validate": {
      post: {
        tags: ["Cash on Delivery"],
        summary: "Validate COD availability",
        security: [
          {
            BearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["amount", "courierCode"],
                properties: {
                  amount: {
                    type: "number",
                    example: 10000,
                  },
                  courierCode: {
                    type: "string",
                    example: "dhl",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "COD validation result",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: true,
                    },
                    available: {
                      type: "boolean",
                      example: true,
                    },
                    fee: {
                      type: "number",
                      example: 500,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/shipments/create": {
      post: {
        tags: ["Shipments"],
        summary: "Create a new shipment",
        security: [
          {
            BearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: [
                  "sender_name",
                  "sender_phone",
                  "sender_email",
                  "sender_address",
                  "sender_city",
                  "sender_state",
                  "sender_country",
                  "receiver_name",
                  "receiver_phone",
                  "receiver_email",
                  "receiver_address",
                  "receiver_city",
                  "receiver_state",
                  "receiver_country",
                  "courier_id",
                  "weight",
                  "dimension",
                  "category",
                ],
                properties: {
                  sender_name: {
                    type: "string",
                    example: "John Doe",
                  },
                  sender_phone: {
                    type: "string",
                    example: "+2348012345678",
                  },
                  sender_email: {
                    type: "string",
                    example: "sender@example.com",
                  },
                  sender_address: {
                    type: "string",
                    example: "123 Sender Street",
                  },
                  sender_city: {
                    type: "string",
                    example: "Lagos",
                  },
                  sender_state: {
                    type: "string",
                    example: "Lagos",
                  },
                  sender_country: {
                    type: "string",
                    example: "Nigeria",
                  },
                  receiver_name: {
                    type: "string",
                    example: "Jane Smith",
                  },
                  receiver_phone: {
                    type: "string",
                    example: "+2348087654321",
                  },
                  receiver_email: {
                    type: "string",
                    example: "receiver@example.com",
                  },
                  receiver_address: {
                    type: "string",
                    example: "456 Receiver Avenue",
                  },
                  receiver_city: {
                    type: "string",
                    example: "Abuja",
                  },
                  receiver_state: {
                    type: "string",
                    example: "FCT",
                  },
                  receiver_country: {
                    type: "string",
                    example: "Nigeria",
                  },
                  courier_id: {
                    type: "string",
                    example: "courier_123",
                  },
                  weight: {
                    type: "number",
                    example: 2.5,
                  },
                  dimension: {
                    type: "string",
                    example: "small",
                  },
                  category: {
                    type: "string",
                    example: "electronics",
                  },
                  description: {
                    type: "string",
                    example: "Laptop computer",
                  },
                  items: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: {
                          type: "string",
                        },
                        quantity: {
                          type: "integer",
                        },
                        price: {
                          type: "number",
                        },
                      },
                    },
                  },
                  cod_amount: {
                    type: "number",
                    example: 50000,
                  },
                  insurance_code: {
                    type: "string",
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Shipment created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: true,
                    },
                    message: {
                      type: "string",
                      example: "Shipment created successfully",
                    },
                    shipment: {
                      $ref: "#/components/schemas/Shipment",
                    },
                    trackingNumber: {
                      type: "string",
                      example: "SB123456789",
                    },
                    waybillUrl: {
                      type: "string",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/shipments": {
      get: {
        tags: ["Shipments"],
        summary: "Get all shipments",
        security: [
          {
            BearerAuth: [],
          },
        ],
        parameters: [
          {
            in: "query",
            name: "page",
            schema: {
              type: "integer",
              default: 1,
            },
          },
          {
            in: "query",
            name: "limit",
            schema: {
              type: "integer",
              default: 20,
            },
          },
          {
            in: "query",
            name: "status",
            schema: {
              type: "string",
              enum: [
                "created",
                "picked_up",
                "in_transit",
                "delivered",
                "cancelled",
                "failed",
              ],
            },
            description: "Filter by status",
          },
        ],
        responses: {
          200: {
            description: "Shipments retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: true,
                    },
                    shipments: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/Shipment",
                      },
                    },
                    pagination: {
                      type: "object",
                      properties: {
                        page: {
                          type: "integer",
                        },
                        limit: {
                          type: "integer",
                        },
                        total: {
                          type: "integer",
                        },
                        pages: {
                          type: "integer",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/shipments/{shipmentId}": {
      get: {
        tags: ["Shipments"],
        summary: "Get shipment by ID",
        security: [
          {
            BearerAuth: [],
          },
        ],
        parameters: [
          {
            in: "path",
            name: "shipmentId",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "Shipment retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: true,
                    },
                    shipment: {
                      $ref: "#/components/schemas/Shipment",
                    },
                  },
                },
              },
            },
          },
          404: {
            description: "Shipment not found",
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
    "/shipments/{shipmentId}/cancel": {
      post: {
        tags: ["Shipments"],
        summary: "Cancel a shipment",
        security: [
          {
            BearerAuth: [],
          },
        ],
        parameters: [
          {
            in: "path",
            name: "shipmentId",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["reason"],
                properties: {
                  reason: {
                    type: "string",
                    example: "Customer requested cancellation",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Shipment cancelled successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: true,
                    },
                    message: {
                      type: "string",
                      example: "Shipment cancelled successfully",
                    },
                    shipment: {
                      $ref: "#/components/schemas/Shipment",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/shipments/{shipmentId}/waybill": {
      get: {
        tags: ["Shipments"],
        summary: "Get shipment waybill",
        security: [
          {
            BearerAuth: [],
          },
        ],
        parameters: [
          {
            in: "path",
            name: "shipmentId",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "Waybill URL retrieved",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: true,
                    },
                    waybillUrl: {
                      type: "string",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/shipments/statistics": {
      get: {
        tags: ["Shipments"],
        summary: "Get shipment statistics",
        security: [
          {
            BearerAuth: [],
          },
        ],
        parameters: [
          {
            in: "query",
            name: "startDate",
            schema: {
              type: "string",
              format: "date",
            },
            description: "Start date (YYYY-MM-DD)",
          },
          {
            in: "query",
            name: "endDate",
            schema: {
              type: "string",
              format: "date",
            },
            description: "End date (YYYY-MM-DD)",
          },
        ],
        responses: {
          200: {
            description: "Statistics retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: true,
                    },
                    statistics: {
                      type: "object",
                      properties: {
                        total: {
                          type: "integer",
                          example: 150,
                        },
                        delivered: {
                          type: "integer",
                          example: 120,
                        },
                        inTransit: {
                          type: "integer",
                          example: 25,
                        },
                        cancelled: {
                          type: "integer",
                          example: 5,
                        },
                        revenue: {
                          type: "number",
                          example: 750000,
                        },
                        deliveryRate: {
                          type: "string",
                          example: "80.00",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/tracking/{trackingNumber}": {
      get: {
        tags: ["Tracking"],
        summary: "Track a shipment",
        security: [
          {
            BearerAuth: [],
          },
        ],
        parameters: [
          {
            in: "path",
            name: "trackingNumber",
            required: true,
            schema: {
              type: "string",
            },
            example: "SB123456789",
          },
        ],
        responses: {
          200: {
            description: "Tracking information retrieved",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: true,
                    },
                    status: {
                      type: "string",
                      example: "in_transit",
                    },
                    events: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          timestamp: {
                            type: "string",
                            format: "date-time",
                          },
                          status: {
                            type: "string",
                          },
                          location: {
                            type: "string",
                          },
                          description: {
                            type: "string",
                          },
                        },
                      },
                    },
                    currentLocation: {
                      type: "string",
                      example: "Lagos Distribution Center",
                    },
                    estimatedDelivery: {
                      type: "string",
                      format: "date-time",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/tracking/multiple": {
      post: {
        tags: ["Tracking"],
        summary: "Track multiple shipments",
        security: [
          {
            BearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["trackingNumbers"],
                properties: {
                  trackingNumbers: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    example: ["SB123456789", "SB987654321"],
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Tracking information retrieved",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: true,
                    },
                    shipments: {
                      type: "array",
                      items: {
                        type: "object",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/tracking/{trackingNumber}/events": {
      get: {
        tags: ["Tracking"],
        summary: "Get tracking events for a shipment",
        security: [
          {
            BearerAuth: [],
          },
        ],
        parameters: [
          {
            in: "path",
            name: "trackingNumber",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "Tracking events retrieved",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: true,
                    },
                    events: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          timestamp: {
                            type: "string",
                            format: "date-time",
                          },
                          status: {
                            type: "string",
                          },
                          location: {
                            type: "string",
                          },
                          description: {
                            type: "string",
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/returns/rates": {
      post: {
        tags: ["Returns"],
        summary: "Get return shipping rates",
        security: [
          {
            BearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Return rates retrieved",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: true,
                    },
                    rates: {
                      type: "array",
                      items: {
                        type: "object",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/returns/create": {
      post: {
        tags: ["Returns"],
        summary: "Create a return shipment",
        security: [
          {
            BearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["originalShipmentId", "reason"],
                properties: {
                  originalShipmentId: {
                    type: "string",
                    example: "507f1f77bcf86cd799439011",
                  },
                  reason: {
                    type: "string",
                    example: "Product damaged",
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Return shipment created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: true,
                    },
                    message: {
                      type: "string",
                      example: "Return shipment created successfully",
                    },
                    returnShipment: {
                      type: "object",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/returns": {
      get: {
        tags: ["Returns"],
        summary: "Get all return shipments",
        security: [
          {
            BearerAuth: [],
          },
        ],
        parameters: [
          {
            in: "query",
            name: "page",
            schema: {
              type: "integer",
              default: 1,
            },
          },
          {
            in: "query",
            name: "limit",
            schema: {
              type: "integer",
              default: 20,
            },
          },
        ],
        responses: {
          200: {
            description: "Returns retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: true,
                    },
                    returns: {
                      type: "array",
                      items: {
                        type: "object",
                      },
                    },
                    pagination: {
                      type: "object",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/returns/{returnId}": {
      get: {
        tags: ["Returns"],
        summary: "Get return shipment by ID",
        security: [
          {
            BearerAuth: [],
          },
        ],
        parameters: [
          {
            in: "path",
            name: "returnId",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "Return retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: true,
                    },
                    return: {
                      type: "object",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/webhooks/shipbubble": {
      post: {
        tags: ["Webhooks"],
        summary: "Handle Shipbubble webhooks",
        description: "Endpoint for receiving webhook events from Shipbubble",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  event_type: {
                    type: "string",
                    example: "shipment.delivered",
                  },
                  data: {
                    type: "object",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Webhook processed successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    received: {
                      type: "boolean",
                      example: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/webhooks/test": {
      post: {
        tags: ["Webhooks"],
        summary: "Test webhook (Sandbox only)",
        security: [
          {
            BearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["eventType"],
                properties: {
                  eventType: {
                    type: "string",
                    example: "shipment.delivered",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Test webhook sent",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: true,
                    },
                    message: {
                      type: "string",
                      example: "Test webhook sent successfully",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/webhooks/logs": {
      get: {
        tags: ["Webhooks"],
        summary: "Get webhook logs",
        security: [
          {
            BearerAuth: [],
          },
        ],
        parameters: [
          {
            in: "query",
            name: "page",
            schema: {
              type: "integer",
              default: 1,
            },
          },
          {
            in: "query",
            name: "limit",
            schema: {
              type: "integer",
              default: 20,
            },
          },
        ],
        responses: {
          200: {
            description: "Webhook logs retrieved",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: true,
                    },
                    logs: {
                      type: "array",
                      items: {
                        type: "object",
                      },
                    },
                    pagination: {
                      type: "object",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/notifications": {
      get: {
        tags: ["Notifications"],
        summary: "Get all notifications",
        security: [
          {
            BearerAuth: [],
          },
        ],
        parameters: [
          {
            in: "query",
            name: "page",
            schema: {
              type: "integer",
              default: 1,
            },
          },
          {
            in: "query",
            name: "limit",
            schema: {
              type: "integer",
              default: 20,
            },
          },
          {
            in: "query",
            name: "unreadOnly",
            schema: {
              type: "boolean",
            },
            description: "Filter for unread notifications only",
          },
        ],
        responses: {
          200: {
            description: "Notifications retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: true,
                    },
                    notifications: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/Notification",
                      },
                    },
                    unreadCount: {
                      type: "integer",
                      example: 5,
                    },
                    pagination: {
                      type: "object",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/notifications/{notificationId}/read": {
      put: {
        tags: ["Notifications"],
        summary: "Mark notification as read",
        security: [
          {
            BearerAuth: [],
          },
        ],
        parameters: [
          {
            in: "path",
            name: "notificationId",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "Notification marked as read",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: true,
                    },
                    notification: {
                      $ref: "#/components/schemas/Notification",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/notifications/read-all": {
      put: {
        tags: ["Notifications"],
        summary: "Mark all notifications as read",
        security: [
          {
            BearerAuth: [],
          },
        ],
        responses: {
          200: {
            description: "All notifications marked as read",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: true,
                    },
                    message: {
                      type: "string",
                      example: "All notifications marked as read",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/notifications/{notificationId}": {
      delete: {
        tags: ["Notifications"],
        summary: "Delete notification",
        security: [
          {
            BearerAuth: [],
          },
        ],
        parameters: [
          {
            in: "path",
            name: "notificationId",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "Notification deleted",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: true,
                    },
                    message: {
                      type: "string",
                      example: "Notification deleted successfully",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/reports/shipments": {
      get: {
        tags: ["Reports"],
        summary: "Generate shipment report",
        security: [
          {
            BearerAuth: [],
          },
        ],
        parameters: [
          {
            in: "query",
            name: "startDate",
            schema: {
              type: "string",
              format: "date",
            },
          },
          {
            in: "query",
            name: "endDate",
            schema: {
              type: "string",
              format: "date",
            },
          },
          {
            in: "query",
            name: "format",
            schema: {
              type: "string",
              enum: ["json", "csv"],
              default: "json",
            },
          },
        ],
        responses: {
          200: {
            description: "Report generated successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: true,
                    },
                    shipments: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/Shipment",
                      },
                    },
                  },
                },
              },
            },
            "text/csv": {
              schema: {
                type: "string",
              },
            },
          },
        },
      },
    },
    "/reports/revenue": {
      get: {
        tags: ["Reports"],
        summary: "Generate revenue report",
        security: [
          {
            BearerAuth: [],
          },
        ],
        parameters: [
          {
            in: "query",
            name: "startDate",
            schema: {
              type: "string",
              format: "date",
            },
          },
          {
            in: "query",
            name: "endDate",
            schema: {
              type: "string",
              format: "date",
            },
          },
        ],
        responses: {
          200: {
            description: "Revenue report generated",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: true,
                    },
                    totalRevenue: {
                      type: "number",
                      example: 1500000,
                    },
                    breakdown: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          _id: {
                            type: "string",
                            example: "2024-01-15",
                          },
                          revenue: {
                            type: "number",
                          },
                          count: {
                            type: "integer",
                          },
                        },
                      },
                    },
                    chart: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          date: {
                            type: "string",
                          },
                          revenue: {
                            type: "number",
                          },
                          shipments: {
                            type: "integer",
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/reports/performance": {
      get: {
        tags: ["Reports"],
        summary: "Generate performance report",
        security: [
          {
            BearerAuth: [],
          },
        ],
        responses: {
          200: {
            description: "Performance report generated",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: true,
                    },
                    onTimeRate: {
                      type: "string",
                      example: "85.50%",
                    },
                    averageDeliveryTime: {
                      type: "string",
                      example: "3.2 days",
                    },
                    totalShipments: {
                      type: "integer",
                      example: 200,
                    },
                    successfulDeliveries: {
                      type: "integer",
                      example: 171,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/support/tickets": {
      post: {
        tags: ["Support"],
        summary: "Create support ticket",
        security: [
          {
            BearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["subject", "message"],
                properties: {
                  subject: {
                    type: "string",
                    example: "Issue with shipment tracking",
                  },
                  message: {
                    type: "string",
                    example:
                      "I cannot track my shipment with tracking number SB123456789",
                  },
                  priority: {
                    type: "string",
                    enum: ["low", "medium", "high"],
                    default: "medium",
                  },
                  attachments: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Ticket created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: true,
                    },
                    message: {
                      type: "string",
                      example: "Support ticket created successfully",
                    },
                    ticket: {
                      type: "object",
                    },
                  },
                },
              },
            },
          },
        },
      },
      get: {
        tags: ["Support"],
        summary: "Get all support tickets",
        security: [
          {
            BearerAuth: [],
          },
        ],
        parameters: [
          {
            in: "query",
            name: "page",
            schema: {
              type: "integer",
              default: 1,
            },
          },
          {
            in: "query",
            name: "limit",
            schema: {
              type: "integer",
              default: 20,
            },
          },
          {
            in: "query",
            name: "status",
            schema: {
              type: "string",
              enum: ["open", "in_progress", "resolved", "closed"],
            },
          },
        ],
        responses: {
          200: {
            description: "Tickets retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: true,
                    },
                    tickets: {
                      type: "array",
                      items: {
                        type: "object",
                      },
                    },
                    pagination: {
                      type: "object",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/support/tickets/{ticketId}": {
      get: {
        tags: ["Support"],
        summary: "Get ticket by ID",
        security: [
          {
            BearerAuth: [],
          },
        ],
        parameters: [
          {
            in: "path",
            name: "ticketId",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "Ticket retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: true,
                    },
                    ticket: {
                      type: "object",
                    },
                    messages: {
                      type: "array",
                      items: {
                        type: "object",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/support/tickets/{ticketId}/messages": {
      post: {
        tags: ["Support"],
        summary: "Add message to ticket",
        security: [
          {
            BearerAuth: [],
          },
        ],
        parameters: [
          {
            in: "path",
            name: "ticketId",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["message"],
                properties: {
                  message: {
                    type: "string",
                    example:
                      "I have checked the tracking page but still no updates",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Message added successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: true,
                    },
                    message: {
                      type: "string",
                      example: "Message added successfully",
                    },
                    ticket: {
                      type: "object",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/support/faq": {
      get: {
        tags: ["Support"],
        summary: "Get FAQs",
        parameters: [
          {
            in: "query",
            name: "category",
            schema: {
              type: "string",
              enum: ["shipping", "tracking", "billing"],
            },
            description: "Filter FAQs by category",
          },
        ],
        responses: {
          200: {
            description: "FAQs retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: true,
                    },
                    faqs: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          category: {
                            type: "string",
                          },
                          question: {
                            type: "string",
                          },
                          answer: {
                            type: "string",
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
