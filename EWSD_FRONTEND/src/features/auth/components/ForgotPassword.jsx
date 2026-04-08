import { useState } from "react";
import { Input, Button, Chip } from "@heroui/react";
import { useForm } from "react-hook-form";
import { useForgotPassword } from "@/features/auth/hooks/useForgotPassword";
import { LuMail, LuArrowLeft, LuKeyRound } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";

export function ForgotPassword() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { mutate: forgotPassword, isPending } = useForgotPassword();

  const onSubmit = (data) => {
    setError("");

    forgotPassword(data.email, {
      onSuccess: () => {
        setSuccess(true);
        // Navigate to reset password page after a short delay
        setTimeout(() => {
          navigate("/reset-password", { state: { email: data.email } });
        }, 1500);
      },
      onError: (err) => {
        setError(
          err?.response?.data?.message ||
            "Failed to send reset code. Please try again.",
        );
      },
    });
  };

  return (
    <div className="w-full lg:w-1/2 h-full flex items-center justify-center p-4 md:p-12">
      <div className="w-full max-w-md">
        {/* Back to Login */}
        <Link
          to="/login"
          className="flex items-center gap-2 text-sm text-default-500 hover:text-default-700 dark:hover:text-default-300 mb-8 transition-colors"
        >
          <LuArrowLeft size={18} />
          Back to Login
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-linear-to-tr from-blue-600 to-purple-500 text-white shadow-xl shadow-indigo-500/30 mb-4">
            <LuKeyRound size={32} />
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-default-900 dark:text-white">
            Forgot Password
          </h1>
          <p className="text-default-500 mt-2">
            Enter your email address and we'll send you a code to reset your
            password.
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <Chip
            color="success"
            variant="flat"
            className="w-full justify-center mb-4"
            classNames={{
              root: "bg-success-100 dark:bg-success-900/30",
              content: "text-success",
            }}
          >
            Password reset code sent! Redirecting...
          </Chip>
        )}

        {/* Error Message */}
        {error && (
          <Chip
            color="danger"
            variant="flat"
            className="w-full justify-center mb-4"
            classNames={{
              root: "bg-danger-100 dark:bg-danger-900/30",
              content: "text-danger",
            }}
          >
            {error}
          </Chip>
        )}

        {/* Email Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="w-full">
            <Input
              type="email"
              label="Email Address"
              placeholder="Enter your email"
              labelPlacement="outside"
              startContent={<LuMail size={18} className="text-default-400" />}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              isInvalid={!!errors.email}
              errorMessage={errors.email?.message}
            />
          </div>

          <Button
            type="submit"
            color="primary"
            size="lg"
            className="w-full bg-linear-to-r from-[#1e3a8a] to-[#1e3a8a] text-white font-semibold py-6"
            isLoading={isPending}
          >
            {isPending ? "Sending..." : "Send Reset Code"}
          </Button>
        </form>

        {/* Info Box */}
        <div className="mt-8 p-4 bg-default-50 dark:bg-default-900/50 rounded-lg border border-default-200 dark:border-default-800">
          <div className="flex items-start gap-3">
            <LuMail size={20} className="text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium text-default-700 dark:text-default-300">
                Check your email
              </p>
              <p className="text-xs text-default-500 mt-1">
                We'll send a 6-digit verification code to your registered email
                address. The code expires in 10 minutes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
