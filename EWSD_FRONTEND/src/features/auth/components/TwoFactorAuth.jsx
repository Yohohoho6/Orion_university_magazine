import React, { useState, useEffect } from "react";
import { useVerify2FA } from "@/features/auth/hooks/useVerify2FA";
import { useRensendOTP } from "@/features/auth/hooks/useResendOTP";
import AuthSidePanel from "@/components/auth-side-pannel/AuthSidePanel";
import {
  Input,
  Button,
  Chip,
} from "@heroui/react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LuShieldCheck,
  LuMail,
  LuArrowLeft,
  LuRefreshCw,
} from "react-icons/lu";

const TwoFactorAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  const [otp, setOtp] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [error, setError] = useState("");

  const { mutate: verify2FA, isPending: isVerifying } = useVerify2FA();
  const { mutate: resendOTP, isPending: isResending } = useRensendOTP();

  // Handle cooldown for resend button
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleVerify = (e) => {
    e.preventDefault();
    setError("");

    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    verify2FA(
      { email, code: otp },
      {
        onError: (err) => {
          setError(err?.response?.data?.message || "Invalid OTP. Please try again.");
        },
      }
    );
  };

  const handleResend = () => {
    if (resendCooldown > 0) return;

    resendOTP({ email },{
      onSuccess: () => {
        setResendCooldown(60);
        setOtp("");
        setError("");
      },
    });
  };

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

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Left Side: Hidden on mobile, 50% width on large screens */}
      <div className="hidden lg:block lg:w-1/2 h-full">
        <AuthSidePanel />
      </div>

      {/* Right Side: Full width on mobile, 50% width on large screens */}
      <div className="w-full lg:w-1/2 h-full flex items-center justify-center p-4 md:p-12">
        <div className="w-full max-w-md">
          {/* Back to Login */}
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 text-sm text-default-500 hover:text-default-700 dark:hover:text-default-300 mb-8 transition-colors"
          >
            <LuArrowLeft size={18} />
            Back to Login
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-linear-to-tr from-blue-600 to-purple-500 text-white shadow-xl shadow-indigo-500/30 mb-4">
              <LuShieldCheck size={32} />
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-default-900 dark:text-white">
              Two-Factor Authentication
            </h1>
            <p className="text-default-500 mt-2">
              Enter the 6-digit code sent to your email
              {email && <span className="font-medium text-default-700 dark:text-default-200"> ({email})</span>}
            </p>
          </div>

          {/* OTP Form */}
          <form onSubmit={handleVerify} className="space-y-6">
            {/* OTP Inputs */}
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

            {/* Error Message */}
            {error && (
              <Chip
                color="danger"
                variant="flat"
                className="w-full justify-center"
                classNames={{
                  root: "bg-danger-100 dark:bg-danger-900/30",
                  content: "text-danger",
                }}
              >
                {error}
              </Chip>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              color="primary"
              size="lg"
              className="w-full bg-linear-to-r from-[#1e3a8a] to-[#1e3a8a] text-white font-semibold py-6"
              isLoading={isVerifying}
              isDisabled={otp.length !== 6}
            >
              {isVerifying ? "Verifying..." : "Verify Code"}
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
              <LuMail size={20} className="text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium text-default-700 dark:text-default-300">
                  Check your email
                </p>
                <p className="text-xs text-default-500 mt-1">
                  The verification code has been sent to your registered email
                  address. It expires in 10 minutes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorAuth;