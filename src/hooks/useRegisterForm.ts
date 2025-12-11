// src/hooks/useRegisterForm.ts
import { useState } from "react";
import { useFormik } from "formik";
import { useAuth } from "./useAuth";
import { RegisterRequest } from "@/types";
import { registerSchema, registerInitialValues } from "@/validation/schemas";

interface RegisterFormCallbacks {
  onSuccess?: (values: RegisterRequest) => void;
  onError?: (message: string) => void;
}

export const useRegisterForm = (callbacks?: RegisterFormCallbacks) => {
  const { register } = useAuth();
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const formik = useFormik({
    initialValues: registerInitialValues,
    validationSchema: registerSchema,
    onSubmit: async (values) => {
      setError("");
      setIsSubmitting(true);

      try {
        // Remove confirmPassword before sending
        const { confirmPassword, ...registerData } = values;

        // Register to backend
        await register(registerData as RegisterRequest);

        // Call success callback & pass values
        callbacks?.onSuccess?.(values as RegisterRequest);
      } catch (error: any) {
        const message =
          error instanceof Error
            ? error.message
            : "Registration failed. Please try again.";
        setError(message);
        callbacks?.onError?.(message);
        console.error("Registration error:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const dismissError = () => setError("");

  return {
    formik,
    error,
    isSubmitting,
    dismissError,
  };
};
