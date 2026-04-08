import { useState, useEffect } from "react";
import { Input, Button, Chip } from "@heroui/react";
import { useForm } from "react-hook-form";
import { useResetPassword } from "@/features/auth/hooks/useResetPassword";
import { useRensendOTP } from "@/features/auth/hooks/useResendOTP";
import {
  LuLock,
  LuArrowLeft,
  LuRefreshCw,
  LuKeyRound,
  LuMail,
} from "react-icons/lu";
import { Link, useLocation, useNavigate } from "react-router-dom";

export function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  
  const [otp, setOtp] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { mutate: resetPassword, isPending: isResetting } = useResetPassword();
  const { mutate: resendOTP, isPending: isResending } = useRensendOTP();

  // Handle cooldown for resend button
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleOtpChange = (value, index) => {
    const newOtp = otp.split("");
    newOtp[index] = value.slice(-1);
    const joined = newOtp.join("");
    setOtp(joined);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const onSubmit = (data) => {
    setError("");

    if (otp.length !== 6) {
      setError("Please enter the 6-digit verification code");
      return;
    }

    resetPassword(
      {
        email,
        code: otp,
        password: data.password,
        password_confirmation: data.password_confirmation,
      },
      {
        onSuccess: () => {
          setSuccess(true);
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        },
        onError: (err) => {
          setError(err?.response?.data?.message || "Failed to reset password. Please try again.");
        },
      }
    );
  };

  const handleResend = () => {
    if (resendCooldown > 0 || !email) return;

    resendOTP(
      { email },
      {
        onSuccess: () => {
          setResendCooldown(60);
          setOtp("");
          setError("");
        },
        onError: (err) => {
          setError(err?.response?.data?.message || "Failed to resend code. Please try again.");
        },
      }
    );
  };

  return (
    <div className="w-full lg:w-1/2 h-full flex items-center justify-center p-4 md:p-12 overflow-y-auto">
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
              Reset Password
            </h1>
            <p className="text-default-500 mt-2">
              Enter the code sent to your email and create a new password.
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
              Password reset successfully! Redirecting to login...
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

          {/* OTP and Password Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
            {/* Email Display */}
            <div className="flex items-center gap-2 p-3 bg-default-50 dark:bg-default-900/50 rounded-lg border border-default-200 dark:border-default-800">
              <LuMail size={18} className="text-default-400" />
              <span className="text-sm text-default-600 dark:text-default-300">{email}</span>
            </div>

            {/* OTP Inputs */}
            <div>
              <label className="text-sm font-medium text-default-700 dark:text-default-300 mb-2 block">
                Verification Code
              </label>
              <div className="flex justify-center gap-2">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <Input
                    key={index}
                    id={`otp-input-${index}`}
                    type="text"
                    maxLength={1}
                    className="w-12 h-14 text-center text-xl font-semibold"
                    classNames={{
                      input: "text-center",
                      inputWrapper: "h-14",
                    }}
                    value={otp[index] || ""}
                    onChange={(e) => handleOtpChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                  />
                ))}
              </div>
            </div>

            {/* Password Input */}
            <div className="w-full">
              <Input
                label="New Password"
                placeholder="Enter new password"
                labelPlacement="outside"
                type="password"
                startContent={<LuLock size={18} className="text-default-400" />}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                  maxLength: {
                    value: 16,
                    message: "Password must not exceed 16 characters",
                  },
                })}
                isInvalid={!!errors.password}
                errorMessage={errors.password?.message}
              />
            </div>

            {/* Confirm Password Input */}
            <div className="w-full">
              <Input
                label="Confirm New Password"
                placeholder="Confirm new password"
                labelPlacement="outside"
                type="password"
                startContent={<LuLock size={18} className="text-default-400" />}
                {...register("password_confirmation", {
                  required: "Please confirm your password",
                })}
                isInvalid={!!errors.password_confirmation}
                errorMessage={errors.password_confirmation?.message}
              />
            </div>

            <Button
              type="submit"
              color="primary"
              size="lg"
              className="w-full bg-linear-to-r from-[#1e3a8a] to-[#1e3a8a] text-white font-semibold py-6"
              isLoading={isResetting}
              isDisabled={otp.length !== 6}
            >
              {isResetting ? "Resetting..." : "Reset Password"}
            </Button>
          </form>

          {/* Resend OTP */}
          <div className="mt-8 text-center">
            <p className="text-default-500 text-sm mb-3">
              Didn't receive the code?
            </p>
            <Button
              variant="light"
              startContent={
                <LuRefreshCw
                  size={16}
                  className={isResending ? "animate-spin" : ""}
                />
              }
              onPress={handleResend}
              isDisabled={resendCooldown > 0 || isResending}
              className="text-blue-600 dark:text-blue-400 font-medium"
            >
              {resendCooldown > 0
                ? `Resend in ${resendCooldown}s`
                : "Resend Code"}
            </Button>
          </div>

          {/* Info Box */}
          <div className="mt-8 p-4 bg-default-50 dark:bg-default-900/50 rounded-lg border border-default-200 dark:border-default-800">
            <div className="flex items-start gap-3">
              <LuKeyRound size={20} className="text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium text-default-700 dark:text-default-300">
                  Password Requirements
                </p>
                <p className="text-xs text-default-500 mt-1">
                  Your password must be 8-16 characters long. Make sure to remember your new password.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

export default ResetPassword;
