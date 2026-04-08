import AuthSidePanel from "@/components/auth-side-pannel/AuthSidePanel";
import ResetPassword from "@/features/auth/components/ResetPassword";

export function ResetPasswordPage() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Left Side: Hidden on mobile, 50% width on large screens */}
      <div className="hidden lg:block lg:w-1/2 h-full">
        <AuthSidePanel />
      </div>

      {/* Right Side: Full width on mobile, 50% width on large screens */}
      <ResetPassword />
    </div>
  );
}

export default ResetPasswordPage;
