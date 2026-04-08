import { Header } from "@/components/header/Header";
import { Register } from "../features/auth/components/Register";
import AuthSidePanel from "@/components/auth-side-pannel/AuthSidePanel";

export default function RegisterPage() {
  return (
    <>
      {/* <Header /> */}
      <div className="flex h-screen w-full overflow-hidden bg-background">
        {/* Left Side: Hidden on mobile, 50% width on large screens */}
        <div className="hidden lg:block lg:w-1/2 h-full">
          <AuthSidePanel />
        </div>

        {/* Right Side: Full width on mobile, 50% width on large screens */}
        <div className="w-full lg:w-1/2 h-full overflow-y-auto p-4 md:p-8 pt-4">
          <div className="flex items-start justify-center min-h-full">
            <Register />
          </div>
        </div>
      </div>
    </>
  );
}
