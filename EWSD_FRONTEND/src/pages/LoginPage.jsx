import { Header } from "@/components/header/Header";
import { Login } from "../features/auth/components/Login";
import AuthSidePanel from "@/components/auth-side-pannel/AuthSidePanel";

export default function LoginPage() {
  return (
    <>
      {/* <Header /> */}
      <div className="flex h-screen w-full overflow-hidden bg-background">
        {/* Left Side: Hidden on mobile, 50% width on large screens */}
        <div className="hidden lg:block lg:w-1/2 h-full">
          <AuthSidePanel />
        </div>

        {/* Right Side: Full width on mobile, 50% width on large screens */}
        <div className="w-full lg:w-1/2 h-full flex items-center justify-center p-4 md:p-12">
          <Login />
        </div>
      </div>
    </>
  );
}
