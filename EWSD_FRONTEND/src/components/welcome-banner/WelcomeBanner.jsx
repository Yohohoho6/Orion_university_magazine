import { useAuth } from "@/context/AuthContext"
import { LuClock, LuSparkles } from "react-icons/lu"

export const WelcomeBanner = () => {
  const { user, lastLogin, welcomeMessage } = useAuth()

  if (welcomeMessage) {
    return (
      <div className="mb-4 p-4 bg-success-50 dark:bg-success-950/30 rounded-lg border border-success-200 dark:border-success-900">
        <div className="flex items-center gap-2">
          <LuSparkles className="text-success-600" size={18} />
          <h2 className="text-lg font-semibold text-foreground">
            Welcome, {user?.name || "User"}!
          </h2>
        </div>
        <p className="text-sm text-default-600 mt-1 ml-7">
          {welcomeMessage}
        </p>
      </div>
    )
  }

  if (lastLogin) {
    return (
      <div className="mb-4 p-4 bg-primary-50 dark:bg-primary-950/30 rounded-lg border border-primary-100 dark:border-primary-900">
        <h2 className="text-lg font-semibold text-foreground">
          Welcome back, {user?.name || "User"}!
        </h2>
        <div className="flex items-center gap-1.5 text-sm text-default-500 mt-1">
          <LuClock size={14} />
          <span>Last login: {lastLogin}</span>
        </div>
      </div>
    )
  }

  return null
}