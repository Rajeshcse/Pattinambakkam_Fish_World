// Password Management Endpoints Swagger Documentation

export const passwordPaths = {
  "/api/auth/forgot-password": {
    post: {
      tags: ["Password Management"],
      summary: "Request password reset OTP",
      description:
        "Send password reset OTP to user phone number (user can provide email or phone to find account)",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                email: {
                  type: "string",
                  format: "email",
                  example: "john@example.com",
                },
                phone: {
                  type: "string",
                  pattern: "^[6-9]\\d{9}$",
                  example: "9876543210",
                },
              },
              description:
                "Provide either email or phone to find account. OTP will be sent to user phone number.",
            },
          },
        },
      },
      responses: {
        200: {
          description: "Password reset OTP sent to phone number",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: {
                    type: "string",
                    example: "Password reset OTP has been sent to your phone",
                  },
                  notificationMethod: { type: "string", example: "phone" },
                  phone: { type: "string", example: "9876543210" },
                  expiresIn: { type: "string", example: "10 minutes" },
                },
              },
            },
          },
        },
        400: {
          description: "Validation failed - email or phone required",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: false },
                  message: {
                    type: "string",
                    example: "Please provide either email or phone number",
                  },
                },
              },
            },
          },
        },
        404: {
          description: "User not found",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: false },
                  message: { type: "string", example: "User not found" },
                },
              },
            },
          },
        },
        500: { $ref: "#/components/responses/ServerError" },
      },
    },
  },

  "/api/auth/verify-password": {
    post: {
      tags: ["Password Management"],
      summary: "Verify OTP and reset password",
      description:
        "Verify OTP sent to phone and reset password. User can provide email or phone to identify account.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["otp", "newPassword"],
              properties: {
                email: {
                  type: "string",
                  format: "email",
                  example: "john@example.com",
                },
                phone: {
                  type: "string",
                  pattern: "^[6-9]\\d{9}$",
                  example: "9876543210",
                },
                otp: { type: "string", pattern: "^\\d{6}$", example: "123456" },
                newPassword: {
                  type: "string",
                  minLength: 6,
                  example: "NewPassword123",
                },
              },
              description:
                "Provide either email or phone. OTP is required. newPassword is optional for 2-step verification.",
            },
          },
        },
      },
      responses: {
        200: {
          description: "OTP verified and password reset successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: {
                    type: "string",
                    example: "Password reset successfully",
                  },
                  verificationToken: {
                    type: "string",
                    example: "token_hash_here",
                    description:
                      "Returned if newPassword not provided (2-step verification)",
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Validation failed or invalid OTP",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: false },
                  message: {
                    type: "string",
                    example: "Invalid or expired OTP",
                  },
                },
              },
            },
          },
        },
        404: {
          description: "User not found",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: false },
                  message: { type: "string", example: "User not found" },
                },
              },
            },
          },
        },
        500: { $ref: "#/components/responses/ServerError" },
      },
    },
  },

  "/api/auth/change-password": {
    post: {
      tags: ["Password Management"],
      summary: "Change password",
      description:
        "Change password for authenticated user (logs out other sessions)",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["currentPassword", "newPassword"],
              properties: {
                currentPassword: { type: "string", example: "OldPassword123" },
                newPassword: {
                  type: "string",
                  minLength: 6,
                  example: "NewPassword123",
                },
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
                  message: {
                    type: "string",
                    example:
                      "Password changed successfully. Other sessions have been logged out.",
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Validation failed or new password same as current",
          content: {
            "application/json": {
              schema: {
                oneOf: [
                  { $ref: "#/components/schemas/ValidationError" },
                  {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: false },
                      message: {
                        type: "string",
                        example:
                          "New password must be different from current password",
                      },
                    },
                  },
                ],
              },
            },
          },
        },
        401: {
          description: "Unauthorized or incorrect current password",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: false },
                  message: {
                    type: "string",
                    example: "Current password is incorrect",
                    description:
                      'Can be "Access denied. No token provided", "Invalid token", "Token expired", or "Current password is incorrect"',
                  },
                },
              },
            },
          },
        },
        404: {
          description: "User not found",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Error" },
            },
          },
        },
        500: { $ref: "#/components/responses/ServerError" },
      },
    },
  },
};
