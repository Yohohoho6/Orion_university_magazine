import { Form, Input, Button, Checkbox } from "@heroui/react";
import { useForm } from "react-hook-form";
import { useLogin } from "@/features/auth/hooks/useLogin";
import { LoginRegisterTabs } from "@/components/login-register/LoginRegisterTabs";
import {
  LuMail,
  LuLock,
  LuEye,
  LuEyeOff,
} from "react-icons/lu";
import { Link } from "react-router-dom";
import { useState } from "react";
import { LoginRegisterHeading } from "@/components/login-register/LoginRegisterHeading";

export function Login() {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { mutate: login, isPending } = useLogin();

  const handleLogin = (data) => {
    login(data);
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <div className="w-full max-w-lg p-6 bg-white dark:bg-slate-800 rounded-lg space-y-6">

        <LoginRegisterHeading />

        <LoginRegisterTabs />

        <div className="text-left">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Welcome Back</h2>
          <p className="text-default-500 text-sm">
            Sign in to access your account
          </p>
        </div>

        <Form
          className="flex flex-col gap-5"
          onSubmit={handleSubmit(handleLogin)}
        >
          <div className="w-full">
            <Input
              type="email"
              label="Email"
              placeholder="Enter your email"
              labelPlacement="outside"
              startContent={<LuMail size={18} className="text-gray-500 dark:text-slate-400" />}
              {...register("email", {
                required: "Email is required",
              })}
              isInvalid={!!errors.email}
              errorMessage={errors.email?.message}
            />
          </div>

          <div className="w-full">
            <Input
              label="Password"
              placeholder="Enter your password"
              labelPlacement="outside"
              type={isVisible ? "text" : "password"}
              endContent={
                isVisible ? (
                  <LuEye
                    size={18}
                    className="text-gray-500 dark:text-slate-400 cursor-pointer"
                    onClick={toggleVisibility}
                  />
                ) : (
                  <LuEyeOff
                    size={18}
                    className="text-gray-500 dark:text-slate-400 cursor-pointer"
                    onClick={toggleVisibility}
                  />
                )
              }
              startContent={<LuLock size={18} className="text-gray-500 dark:text-slate-400" />}
              {...register("password", { required: "Password is required" })}
              isInvalid={!!errors.password}
              errorMessage={errors.password?.message}
            />
          </div>

          <div className="w-full flex items-center justify-between">
            <Checkbox color="primary">
              <span className="text-gray-600 dark:text-slate-300 text-sm">Remember me</span>
            </Checkbox>
            <Link
              to="/forgot-password"
              className="text-sm text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            color="primary"
            className="w-full bg-linear-to-r from-[#1e3a8a] to-[#1e3a8a] text-white"
            isLoading={isPending}
          >
            {isPending ? "Logging in..." : "Login"}
          </Button>

          <p className="text-center text-sm text-gray-600 dark:text-slate-300 w-full">
            Need help? Contact{" "}
            <span className="text-gray-900 dark:text-white cursor-pointer">
              support@university.edu
            </span>
          </p>
        </Form>
      </div>
    </div>
  );
}
