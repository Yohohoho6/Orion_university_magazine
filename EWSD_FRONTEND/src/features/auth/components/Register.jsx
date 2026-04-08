import {
  Form,
  Input,
  Button,
  Select,
  SelectItem,
  Checkbox,
} from "@heroui/react";
import { useForm, Controller } from "react-hook-form";
import { useRegister } from "../hooks/useRegister";
import { useFaculties } from "../../faculty/hooks/useFaculty";
import {
  LuUser,
  LuMail,
  LuLock,
  LuSchool,
  LuEye,
  LuEyeOff,
  LuShieldCheck
} from "react-icons/lu";
import { LoginRegisterTabs } from "@/components/login-register/LoginRegisterTabs";
import { useState, useEffect } from "react";
import { LoginRegisterHeading } from "@/components/login-register/LoginRegisterHeading";
import { useRoles } from "@/features/admin/hooks/useRoles";

export function Register() {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  // React Hook Form setup
  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
    watch,
    trigger
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      faculty_id: "",
      role_id: "",
    },
  });

  const roleId = watch("role_id");
  const email = watch("email")
  const studentRoleId = "1";

  useEffect(() => {
    // Re-validate the email field whenever the roleId changes
   if (email)  trigger("email");
  }, [roleId, trigger, email]);

  // Fetch faculty data
  const { data: faculties } = useFaculties();

  // Fetch role data
  const { data: roles } = useRoles();
  const rolesNeedRegistration = roles?.filter((role) => role.name === "student" || role.name === "guest")

  // user registration mutation hook
  const { mutate, isPending, error } = useRegister();

  // Handle form submission
  const handleRegister = (payload) => {
    // ensure faculty id is sent as a number if present
    if (payload.faculty_id) payload.faculty_id = Number(payload.faculty_id);
    mutate(payload);
  };

  // Error Message from API
  const errMsg = error?.response?.data
    ? Object.values(error.response.data.errors).flat().join(" ")
    : "Internal Server Error";

  return (
    <div className="flex items-center justify-center h-full w-full">
      <div className="w-full max-w-lg p-6 bg-white dark:bg-slate-800 rounded-lg">
        <Form
          className="w-full flex flex-col gap-5"
          onSubmit={handleSubmit(handleRegister)}
        >
          <LoginRegisterHeading />

          {/* Login & Register Toggle */}
          <LoginRegisterTabs />

          <div className="text-left">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create Account</h2>
            <p className="text-default-500 text-sm">
              Join the university magazine community
            </p>
          </div>

          {/* Api Response Error */}
          {error && <p className="text-red-500 text-sm">{errMsg}</p>}

          {/* Username */}
          <div className="w-full">
            <Input
              label="Full Name"
              labelPlacement="outside"
              name="name"
              placeholder="Enter your full name"
              type="text"
              startContent={<LuUser size={18} className="text-gray-500 dark:text-slate-400" />}
              isInvalid={!!errors.name}
              errorMessage={errors.name?.message}
              {...register("name", {
                required: "Full name is required",
                minLength: {
                  value: 2,
                  message: "Full name must be at least 2 characters",
                },
              })}
            />
          </div>

          {/* Email */}
          <div className="w-full">
            <Input
              label="Email"
              labelPlacement="outside"
              name="email"
              placeholder="your.email@university.edu"
              type="email"
              startContent={<LuMail size={18} className="text-gray-500 dark:text-slate-400" />}
              isInvalid={!!errors.email}
              errorMessage={errors.email?.message}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: roleId === studentRoleId ?	/^[a-z0-9._%+-]+@[a-z0-9.-]+\.(edu|ac)(\.[a-z]{2,3})*$/i : /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i,
                  message: `Please enter a valid ${roleId === studentRoleId ? "student (edu)" : "guest"} email address`,
                },
              })}
            />
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Use your university email address for student</p>
          </div>

          {/* Faculty */}
          <div className="w-full">
            <Controller
              name="faculty_id"
              control={control}
              rules={{ required: "Faculty is required" }}
              render={({ field }) => (
                <Select
                  label="Faculty"
                  labelPlacement="outside-top"
                  placeholder="Select your faculty"
                  startContent={
                    <LuSchool size={18} className="text-gray-500 dark:text-slate-400" />
                  }
                  isInvalid={!!errors.faculty_id}
                  errorMessage={errors.faculty_id?.message}
                  value={field.value}
                  onChange={(val) => field.onChange(val)}
                >
                  {faculties?.map((faculty) => (
                    <SelectItem value={String(faculty.id)} key={faculty.id}>
                      {faculty.name}
                    </SelectItem>
                  ))}
                </Select>
              )}
            />
          </div>

          {/* Role */}
          <div className="w-full">
            <Controller
              name="role_id"
              control={control}
              rules={{ required: "Role is required" }}
              render={({ field }) => (
                <Select
                  label="Role"
                  labelPlacement="outside-top"
                  placeholder="Select your role"
                  startContent={
                    <LuShieldCheck size={18} className="text-gray-500 dark:text-slate-400" />
                  }
                  isInvalid={!!errors.role_id}
                  errorMessage={errors.role_id?.message}
                  value={field.value}
                  onChange={(val) => field.onChange(val)}
                >
                  {rolesNeedRegistration?.map((role) => (
                    <SelectItem value={String(role.id)} key={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </Select>
              )}
            />
          </div>

          {/* Password */}
          <div className="w-full">
            <Input
              label="Password"
              labelPlacement="outside"
              name="password"
              placeholder="Create a strong password"
              type={isVisible ? "text" : "password"}
              startContent={<LuLock size={18} className="text-gray-500 dark:text-slate-400" />}
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
              isInvalid={!!errors.password}
              errorMessage={errors.password?.message}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
            />
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">At least 8 characters</p>
          </div>

          {/* Confirm Password */}
          <div className="w-full">
            <Input
              label="Confirm Password"
              labelPlacement="outside"
              name="password_confirmation"
              placeholder="Re-enter your password"
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
              isInvalid={!!errors.password_confirmation}
              errorMessage={errors.password_confirmation?.message}
              {...register("password_confirmation", {
                required: "Password confirmation is required",
                validate: (value, formValues) => {
                  return (
                    value === formValues.password || "Passwords do not match"
                  );
                },
              })}
            />
          </div>

          {/* Checkbox */}
          <div className="border w-full border-gray-200 dark:border-slate-700 rounded-md p-4 bg-gray-50 dark:bg-slate-900">
            <Checkbox
              color="primary"
              {...register("terms", {
                required: "You must agree to the terms",
              })}
              isInvalid={!!errors.terms}
            >
              <span className="text-sm text-gray-600 dark:text-slate-300">
                I agree to the{" "}
                <a href="#" className="text-primary">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-primary">
                  Privacy Policy
                </a>
                .
              </span>
            </Checkbox>
            {errors.terms && (
              <p className="text-red-500 text-xs mt-1">
                {errors.terms.message}
              </p>
            )}
          </div>

          <Button
            disabled={isPending}
            className="w-full bg-linear-to-r from-[#1e3a8a] to-[#1e3a8a] text-white"
            type="submit"
            isLoading={isPending}
          >
            {isPending ? "Creating..." : "Create an account"}
          </Button>

          <p className="text-center text-xs text-gray-600 dark:text-slate-300 w-full">
            By registering, you'll be able to submit articles and contribute to
            the university magazine
          </p>

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
