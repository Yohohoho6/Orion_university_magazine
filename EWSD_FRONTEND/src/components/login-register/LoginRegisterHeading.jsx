import { LuGraduationCap } from "react-icons/lu";

export const LoginRegisterHeading = () => {
  return (
    <div className="flex items-center justify-center w-full lg:hidden">
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-linear-to-tr from-blue-600 to-purple-500 text-white shadow-xl shadow-indigo-500/30">
          <LuGraduationCap size={32} />
        </div>
        <h1 className="text-xl lg:text-2xl font-semibold tracking-tight text-default-900">
          University Magazine Portal
        </h1>
      </div>
    </div>
  );
};
