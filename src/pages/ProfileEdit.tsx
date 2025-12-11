import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "@/hooks/useAuth";
import { Button, Loading, Layout } from "@/components/common";
import { FormField } from "@/components/common/FormField";
import { ErrorAlert } from "@/components/common/ErrorAlert";
import { useProfileEditForm } from "@/hooks/useProfileEditForm";
import { User } from "@/types";

export const ProfileEdit: React.FC = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [emailChanged, setEmailChanged] = useState(false);
  const [phoneChanged, setPhoneChanged] = useState(false);
  const [originalEmail] = useState(user?.email || "");
  const [originalPhone] = useState(user?.phone || "");

  const { formik, isSubmitting, error, dismissError } = useProfileEditForm({
    onSuccess: (updatedUser: User) => {
      // Use form values to check what actually changed
      const emailHasChanged = formik.values.email !== originalEmail;
      const phoneHasChanged = formik.values.phone !== originalPhone;

      console.log("Form values:", {
        email: formik.values.email,
        phone: formik.values.phone,
        originalEmail,
        originalPhone,
        emailHasChanged,
        phoneHasChanged,
      });

      // Build updated user object
      let userToUpdate: User = { ...updatedUser };

      // Reset email verification ONLY if email changed
      if (emailHasChanged) {
        userToUpdate = { ...userToUpdate, isVerified: false };
      }

      // Reset phone verification ONLY if phone changed
      if (phoneHasChanged) {
        userToUpdate = { ...userToUpdate, isPhoneVerified: false };
      }

      updateUser(userToUpdate);

      // Determine redirect based on what changed
      if (emailHasChanged && phoneHasChanged) {
        toast.warning("Email and phone changed! Please verify both.");
        navigate("/verify-phone"); // Verify phone first, then email
      } else if (emailHasChanged) {
        toast.warning("Email changed! Please verify your new email address");
        navigate("/verify-email");
      } else if (phoneHasChanged) {
        toast.warning("Phone changed! Please verify your new phone number");
        navigate("/verify-phone");
      } else {
        toast.success("Profile updated successfully!");
        navigate("/profile");
      }
    },
    onError: (errorMessage: string) => {
      toast.error(errorMessage);
    },
    onNoChanges: () => {
      toast.info("No changes made");
      navigate("/profile");
    },
  });

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    formik.handleChange(e);
    setEmailChanged(e.target.value !== originalEmail);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    formik.handleChange(e);
    setPhoneChanged(e.target.value !== originalPhone);
  };

  const handleCancel = () => {
    navigate("/profile");
  };

  if (!user) {
    return <Loading fullScreen text="Loading..." />;
  }

  return (
    <Layout>
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary-600 mb-2">
              Edit Profile
            </h1>
            <p className="text-gray-600">Update your account information</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
            {error && <ErrorAlert message={error} onDismiss={dismissError} />}

            {/* Email Change Warning */}
            {emailChanged && (
              <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-amber-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-amber-800">
                      Email Change Detected
                    </h3>
                    <p className="mt-1 text-sm text-amber-700">
                      Your email verification status will be reset. You'll need
                      to verify your new email address.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Phone Change Warning */}
            {phoneChanged && (
              <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-amber-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-amber-800">
                      Phone Number Change Detected
                    </h3>
                    <p className="mt-1 text-sm text-amber-700">
                      Your phone verification status will be reset. You'll need
                      to verify your new phone number.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <FormField
                name="name"
                label="Full Name"
                placeholder="Enter your full name"
                formik={formik}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formik.values.email}
                  onChange={handleEmailChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none ${
                    formik.touched.email && formik.errors.email
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {formik.errors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter 10-digit mobile number"
                  value={formik.values.phone}
                  onChange={handlePhoneChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none ${
                    formik.touched.phone && formik.errors.phone
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {formik.touched.phone && formik.errors.phone && (
                  <p className="mt-1 text-sm text-red-600">
                    {formik.errors.phone}
                  </p>
                )}
              </div>

              <FormField
                name="avatar"
                label="Profile Picture URL"
                type="url"
                placeholder="Enter image URL (optional)"
                formik={formik}
              />

              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={isSubmitting}
                >
                  {emailChanged || phoneChanged
                    ? "Save & Verify Changes"
                    : "Save Changes"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  fullWidth
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};
