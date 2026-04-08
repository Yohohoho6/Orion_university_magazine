import { useLocation, useNavigate } from "react-router-dom"
import { Tabs, Tab } from "@heroui/react";

export const LoginRegisterTabs = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const activeKey = location.pathname.includes("register")
    ? "register"
    : "login";

    return (
        <div className="flex flex-col w-full items-center justify-center">
          <Tabs
            fullWidth
            size="lg"
            aria-label="Auth Options"
            selectedKey={activeKey}
            onSelectionChange={(key) => navigate(`/${key}`)}
            radius="full"
            variant="light"
            classNames={{
              tabList: "bg-default-100/80 dark:bg-slate-700/80 p-1 border-none relative",
              cursor: "bg-background dark:bg-slate-600 shadow-md border border-default-200 dark:border-slate-500",
              tab: "h-9",
              tabContent:
                "group-data-[selected=true]:text-default-900 dark:text-white font-medium text-default-500 dark:text-slate-400",
            }}
          >
            <Tab key="login" title="Login" />
            <Tab key="register" title="Register" />
          </Tabs>
        </div>
    )
}