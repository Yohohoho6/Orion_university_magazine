import React from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  Button,
  Drawer,
  DrawerContent,
  DrawerBody,
  useDisclosure,
  Badge,
} from "@heroui/react";
import { LuLogOut, LuMenu, LuBell, LuChevronRight, LuX } from "react-icons/lu";
import { useAuth } from "@/context/AuthContext";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { useGetUnreadCount } from "@/features/notification/hooks/useGetUnreadCount";
import { Link as RouterLink } from "react-router-dom";
import { resolveProfileImageUrl } from "@/utils/helpers";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Chatbot } from "@/components/Chatbot";
import { FaUniversity } from "react-icons/fa";
import { DashboardTour } from "@/components/tour/DashboardTour";

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Lora:wght@700&family=DM+Sans:wght@300;400;500&display=swap');

  .sb-root {
    font-family: 'DM Sans', sans-serif;
    display: flex;
    flex-direction: column;
    height: 100%;
    background: var(--sidebar-bg);
  }

  /* Logo */
  .sb-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 18px 20px 16px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
    text-decoration: none;
    transition: opacity 0.18s;
  }
  .sb-logo:hover { opacity: 0.85; }

  .sb-logo-icon {
    width: 32px;
    height: 32px;
    background: rgba(255,255,255,0.15);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .sb-logo-text { display: flex; flex-direction: column; }

  .sb-brand {
    font-family: 'Lora', serif;
    font-size: 1rem;
    font-weight: 700;
    line-height: 1;
    letter-spacing: -0.01em;
    color: var(--sidebar-text);
  }

  .sb-brand-mag { color: #f57c00; }

  .sb-tagline {
    font-size: 0.6rem;
    font-weight: 400;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.4);
    margin-top: 2px;
  }

  /* Nav */
  .sb-nav {
    flex: 1;
    padding: 10px 0;
    overflow-y: auto;
  }

  .sb-nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 12px;
    margin: 1px 10px;
    border-radius: 8px;
    text-decoration: none;
    font-size: 0.825rem;
    font-weight: 400;
    color: var(--sidebar-text-muted);
    transition: all 0.18s;
    position: relative;
  }

  .sb-nav-item:hover {
    background: var(--sidebar-hover);
    color: var(--sidebar-text);
  }

  .sb-nav-item.active {
    background: var(--sidebar-active);
    color: var(--sidebar-text);
    font-weight: 500;
  }

  /* Orange left accent on active */
  .sb-nav-item.active::before {
    content: '';
    position: absolute;
    left: -10px;
    top: 22%;
    bottom: 22%;
    width: 3px;
    background: #f57c00;
    border-radius: 0 3px 3px 0;
  }

  .sb-nav-icon {
    width: 30px;
    height: 30px;
    border-radius: 7px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: background 0.18s;
  }

  .sb-nav-item:hover .sb-nav-icon {
    background: rgba(255,255,255,0.1);
  }

  .sb-nav-item.active .sb-nav-icon {
    background: rgba(245,124,0,0.25);
    color: #f57c00;
  }

  .sb-nav-item svg { width: 15px; height: 15px; }

  .sb-nav-arrow {
    margin-left: auto;
    opacity: 0;
    transition: opacity 0.18s;
    color: rgba(255,255,255,0.4);
  }
  .sb-nav-item:hover .sb-nav-arrow,
  .sb-nav-item.active .sb-nav-arrow {
    opacity: 1;
  }

  /* Footer */
  .sb-footer {
    padding: 12px 10px;
    border-top: 1px solid rgba(255,255,255,0.08);
  }

  .sb-user-card {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 10px;
    border-radius: 8px;
    background: rgba(255,255,255,0.08);
    margin-bottom: 6px;
  }

  .sb-user-name {
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--sidebar-text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .sb-user-role {
    font-size: 0.7rem;
    color: rgba(255,255,255,0.45);
    text-transform: capitalize;
    margin-top: 1px;
  }

  .sb-logout {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 8px 10px;
    border-radius: 8px;
    border: none;
    background: none;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.8rem;
    color: rgba(255,255,255,0.5);
    transition: all 0.18s;
  }
  .sb-logout:hover {
    background: rgba(239,68,68,0.15);
    color: #fca5a5;
  }
  .sb-logout svg { width: 14px; height: 14px; flex-shrink: 0; }

  /* Topbar */
  .db-topbar {
    background: var(--topbar-bg) !important;
    border-bottom: 1px solid var(--topbar-border) !important;
    box-shadow: none !important;
  }

  .db-notif-btn {
    width: 34px;
    height: 34px;
    border-radius: 8px;
    border: 1px solid var(--notif-btn-border) !important;
    background: var(--notif-btn-bg) !important;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: border-color 0.18s;
    cursor: pointer;
  }
  .db-notif-btn:hover { border-color: var(--notif-btn-hover) !important; }

  .db-topbar-text {
    font-size: 0.875rem;
    color: var(--topbar-text);
  }
  .db-topbar-text-bold {
    color: var(--topbar-text-bold);
    font-weight: 500;
  }

  .db-brand-primary { color: var(--primary); }
  .db-brand-accent { color: #f57c00; }
  .db-menu-icon { color: var(--notif-icon); }
  .db-content-bg { background: var(--content-bg); }
`;

// ─── Sidebar Content ──────────────────────────────────────────────────────────
const SidebarContent = ({ menuItems, onClose }) => {
  const location = useLocation();
  const { user } = useAuth();
  const profileImage = resolveProfileImageUrl(user?.profile_path);
  const { mutate: logout } = useLogout();

  return (
    <div className="sb-root">
      {/* Logo */}
      <div className="sb-logo" style={{ justifyContent: "space-between", paddingRight: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/20 bg-white/10 shadow-sm backdrop-blur-md">
            <FaUniversity className="text-white/90" size={16} />
          </div>
          <div className="sb-logo-text">
            <span className="sb-brand">
              Orioin<span className="sb-brand-mag">University</span>
            </span>
            <span className="sb-tagline">Dashboard</span>
          </div>
        </div>
        
        {/* Mobile Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden p-1 text-white/50 hover:text-white transition-colors"
            aria-label="Close menu"
          >
            <LuX size={20} />
          </button>
        )}
      </div>

      {/* Nav items */}
      <nav className="sb-nav">
        {menuItems?.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`sb-nav-item${isActive ? " active" : ""}`}
            >
              <div className="sb-nav-icon">{item.icon}</div>
              <span>{item.name}</span>
              <LuChevronRight size={13} className="sb-nav-arrow" />
            </Link>
          );
        })}
      </nav>

      {/* Footer: user + logout */}
      <div className="sb-footer">
        <div className="sb-user-card">
          <Avatar
            src={profileImage}
            name={user?.name}
            size="sm"
            color="warning"
            isBordered
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="sb-user-name">{user?.name}</div>
            <div className="sb-user-role">
              {user?.role?.name?.replace(/_/g, " ")}
            </div>
          </div>
        </div>

        <button className="sb-logout" onClick={() => logout()}>
          <LuLogOut />
          <span>Sign out</span>
        </button>
      </div>
    </div>
  );
};

// ─── Dashboard Layout ─────────────────────────────────────────────────────────
export function DashboardLayout({ menuItems }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { user } = useAuth();
  const profileImage = resolveProfileImageUrl(user?.profile_path);
  const { mutate: logout } = useLogout();

  const shouldShowNotification =
    user?.role?.name === "student" ||
    user?.role?.name === "marketing_coordinator";

  const { data: unreadData } = useGetUnreadCount();
  const unreadCount = unreadData?.unread_count || 0;

  const getNotificationsPath = () => {
    if (user?.role?.name === "student") return "/student/notifications";
    if (user?.role?.name === "marketing_coordinator")
      return "/marketing-coordinator/notifications";
    return "/notifications";
  };

  return (
    <>
      <style>{styles}</style>
      <DashboardTour />
      <div className="flex h-screen w-full db-content-bg">
        {/* ── Desktop Sidebar ── */}
        <aside
          data-tour="sidebar-nav"
          className="hidden md:flex flex-col fixed h-full z-40"
          style={{ width: "220px" }}
        >
          <SidebarContent menuItems={menuItems} />
        </aside>

        {/* ── Main area ── */}
        <div className="flex-1 flex flex-col md:ml-55 min-h-screen">
          {/* Topbar */}
          <Navbar
            isBordered={false}
            className="db-topbar sticky top-0 z-40 w-full h-15"
            maxWidth="full"
          >
            {/* Mobile toggle */}
            <NavbarContent className="md:hidden" justify="start">
              <Button isIconOnly variant="light" onPress={() => isOpen ? onOpenChange(false) : onOpen()} size="sm">
                <LuMenu size={20} className="db-menu-icon" />
              </Button>
            </NavbarContent>

            {/* Mobile brand */}
            <NavbarContent className="md:hidden" justify="center">
              <NavbarBrand>
                <span
                  style={{
                    fontFamily: "'Lora', serif",
                    fontWeight: 700,
                    fontSize: "1rem",
                  }}
                >
                  <span className="db-brand-primary">Uni</span>
                  <span className="db-brand-accent">Magazine</span>
                </span>
              </NavbarBrand>
            </NavbarContent>

            {/* Desktop greeting */}
            {/* <NavbarContent className="hidden md:flex" justify="start">
              <span className="db-topbar-text">
                Welcome back,{" "}
                <span className="db-topbar-text-bold">
                  {user?.name?.split(" ")[0]}
                </span>
              </span>
            </NavbarContent> */}

            {/* Right: bell + avatar */}
            <NavbarContent justify="end" style={{ gap: "10px" }}>
              {shouldShowNotification && (
                <Link to={getNotificationsPath()}>
                  <Badge
                    content={unreadCount > 0 ? unreadCount : null}
                    color="danger"
                    size="sm"
                    isInvisible={unreadCount === 0}
                  >
                    <button data-tour="notification-button" className="db-notif-btn">
                      <LuBell size={16} className="db-menu-icon" />
                    </button>
                  </Badge>
                </Link>
              )}

              <div data-tour="theme-toggle">
                <ThemeToggle />
              </div>

              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <Avatar
                    data-tour="profile-menu"
                    isBordered
                    as="button"
                    className="transition-transform"
                    color="warning"
                    name={user?.name}
                    src={profileImage}
                    size="sm"
                  />
                </DropdownTrigger>
                <DropdownMenu aria-label="Profile Actions" variant="flat">
                  <DropdownItem key="profile" className="h-14 gap-1" isReadOnly>
                    <p className="text-[0.72rem] text-gray-400 dark:text-slate-500">
                      Signed in as
                    </p>
                    <p className="text-[0.875rem] font-medium text-gray-900 dark:text-white">
                      {user?.email}
                    </p>
                  </DropdownItem>
                  <DropdownItem
                    key="logout"
                    color="danger"
                    onClick={() => logout()}
                  >
                    Sign out
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </NavbarContent>
          </Navbar>

          {/* Page content */}
          <main style={{ flex: 1, padding: "24px", overflowY: "auto" }}>
            <Outlet />
          </main>
        </div>

        {/* ── Mobile Drawer ── */}
        <Drawer 
          isOpen={isOpen} 
          onOpenChange={onOpenChange} 
          placement="left"
          hideCloseButton
          shouldCloseOnBackdrop
          shouldCloseOnEscape
        >
          <DrawerContent>
            {(onClose) => (
              <DrawerBody className="p-0">
                <SidebarContent menuItems={menuItems} onClose={onClose} />
              </DrawerBody>
            )}
          </DrawerContent>
        </Drawer>
        <Chatbot />
      </div>
    </>
  );
}