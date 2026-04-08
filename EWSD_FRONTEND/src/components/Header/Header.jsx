import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Button,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
} from "@heroui/react";
import { NavLink, Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { HiMenu, HiX } from "react-icons/hi";
import { resolveProfileImageUrl } from "@/utils/helpers";
import { FaUniversity } from "react-icons/fa";

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Lora:wght@700&family=DM+Sans:wght@300;400;500&display=swap');

  .kmd-navbar {
    background: #0f172a !important;
    border-bottom: 1px solid rgba(255,255,255,0.06) !important;
    box-shadow: none !important;
  }

  .kmd-brand {
    font-family: 'Lora', serif;
    font-size: 1.15rem;
    font-weight: 700;
    letter-spacing: -0.01em;
    text-decoration: none;
    line-height: 1;
  }

  .kmd-brand-uni  { color: #fff; }
  .kmd-brand-mag  { color: #f57c00; }

  .kmd-nav-link {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.8rem;
    font-weight: 400;
    color: rgba(255,255,255,0.55);
    padding: 4px 2px;
    text-decoration: none !important;
    position: relative;
    transition: color 0.2s;
    letter-spacing: 0.01em;
  }

  .kmd-nav-link::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0; right: 0;
    height: 2px;
    background: #f57c00;
    border-radius: 1px;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.2s ease;
  }

  .kmd-nav-link:hover {
    color: rgba(255,255,255,0.9);
  }

  .kmd-nav-link:hover::after,
  .kmd-nav-link.active::after {
    transform: scaleX(1);
  }

  .kmd-nav-link.active {
    color: #fbbf24;
    font-weight: 500;
  }

  .kmd-divider-v {
    width: 1px;
    height: 16px;
    background: rgba(255,255,255,0.12);
  }

  .kmd-login-btn {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.8rem;
    font-weight: 400;
    color: rgba(255,255,255,0.55) !important;
    background: none !important;
    border: none !important;
    box-shadow: none !important;
    padding: 4px 8px !important;
    min-width: unset !important;
    transition: color 0.2s;
    text-decoration: none;
  }
  .kmd-login-btn:hover { color: rgba(255,255,255,0.9) !important; }

  .kmd-signup-btn {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.8rem !important;
    font-weight: 500 !important;
    background: #f57c00 !important;
    color: #fff !important;
    border: none !important;
    border-radius: 6px !important;
    padding: 0 18px !important;
    height: 34px !important;
    box-shadow: none !important;
    transition: background 0.2s !important;
  }
  .kmd-signup-btn:hover { background: #e65100 !important; }

  /* Mobile menu */
  .kmd-mobile-menu {
    background: #0f172a !important;
    border-top: 1px solid rgba(255,255,255,0.06) !important;
    padding-top: 16px !important;
    padding-bottom: 24px !important;
  }

  .kmd-mobile-link {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    font-weight: 400;
    color: rgba(255,255,255,0.6);
    padding: 12px 4px;
    display: block;
    text-decoration: none !important;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    transition: color 0.2s;
  }

  .kmd-mobile-link:hover,
  .kmd-mobile-link.active {
    color: #f57c00;
  }

  .kmd-mobile-signup {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.875rem !important;
    font-weight: 500 !important;
    background: #f57c00 !important;
    color: #fff !important;
    border: none !important;
    border-radius: 6px !important;
    transition: background 0.2s !important;
  }
  .kmd-mobile-signup:hover { background: #e65100 !important; }

  .kmd-mobile-login {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.875rem !important;
    background: rgba(255,255,255,0.06) !important;
    color: rgba(255,255,255,0.7) !important;
    border: 1px solid rgba(255,255,255,0.1) !important;
    border-radius: 6px !important;
  }

  .kmd-user-email {
    font-size: 0.72rem;
    color: rgba(255,255,255,0.4);
    letter-spacing: 0.02em;
    margin-bottom: 6px;
    font-family: 'DM Sans', sans-serif;
  }
`;

// ─── Logo ─────────────────────────────────────────────────────────────────────
export const AcmeLogo = () => (
  <RouterLink
    to="/"
    className="kmd-brand flex items-center gap-2.5 hover:opacity-90 transition-opacity"
  >
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/20 bg-white/10 shadow-sm backdrop-blur-md">
      <FaUniversity className="text-white/90" size={16} />
    </div>
    <span className="kmd-brand">
      <span className="kmd-brand-uni">Orion</span>
      <span className="kmd-brand-mag">University</span>
    </span>
  </RouterLink>
);

// ─── Header ───────────────────────────────────────────────────────────────────
export function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { user } = useAuth();
  const { mutate: logout } = useLogout();
  const profileImage = resolveProfileImageUrl(user?.profile_path);
  const navigate = useNavigate();

  const handleLogout = () => logout();

  const redirectToDashboard = () => {
    const routes = {
      admin: "/admin/dashboard",
      student: "/student/dashboard",
      marketing_coordinator: "/marketing-coordinator/dashboard",
      marketing_manager: "/marketing-manager/dashboard",
      guest: "/guest/dashboard"
    };
    const route = routes[user?.role?.name];
    if (route) navigate(route);
  };

  const menuItems = [
    { name: "Home", route: "/" },
    { name: "About", route: "/about" },
    { name: "Contact", route: "/contact" },
    { name: "Terms", route: "/terms" },
  ];

  return (
    <>
      <style>{styles}</style>
      <Navbar
        onMenuOpenChange={setIsMenuOpen}
        className="kmd-navbar sticky top-0 z-50"
        maxWidth="xl"
        height="60px"
      >
        {/* ── Mobile: Toggle + Logo ── */}
        <NavbarContent className="sm:hidden gap-2">
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            icon={
              isMenuOpen ? (
                <HiX size={20} style={{ color: "rgba(255,255,255,0.7)" }} />
              ) : (
                <HiMenu size={20} style={{ color: "rgba(255,255,255,0.7)" }} />
              )
            }
          />
          <NavbarBrand>
            <AcmeLogo />
          </NavbarBrand>
        </NavbarContent>

        {/* ── Desktop: Logo ── */}
        <NavbarContent className="hidden sm:flex">
          <NavbarBrand>
            <AcmeLogo />
          </NavbarBrand>
        </NavbarContent>

        {/* ── Desktop: Nav + Auth ── */}
        <NavbarContent
          className="hidden sm:flex items-center gap-6"
          justify="end"
        >
          {menuItems.map((item) => (
            <NavbarItem key={item.route}>
              <NavLink
                to={item.route}
                className={({ isActive }) =>
                  `kmd-nav-link${isActive ? " active" : ""}`
                }
              >
                {item.name}
              </NavLink>
            </NavbarItem>
          ))}

          <div className="kmd-divider-v" />

          {user ? (
            <NavbarItem>
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <Avatar
                    as="button"
                    name={user?.name}
                    src={profileImage}
                    color="warning"
                    isBordered
                    size="sm"
                    className="transition-transform"
                  />
                </DropdownTrigger>
                <DropdownMenu aria-label="Profile Actions" variant="flat">
                  <DropdownItem key="profile" className="h-14 gap-1" isReadOnly>
                    <p className="text-xs text-default-400">Signed in as</p>
                    <p className="text-sm font-medium text-default-700 truncate">
                      {user?.email}
                    </p>
                  </DropdownItem>
                  <DropdownItem key="dashboard" onPress={redirectToDashboard}>
                    Dashboard
                  </DropdownItem>
                  <DropdownItem
                    key="logout"
                    color="danger"
                    onPress={handleLogout}
                  >
                    Sign out
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </NavbarItem>
          ) : (
            <>
              <NavbarItem>
                <NavLink to="/login" className="kmd-login-btn">
                  Login
                </NavLink>
              </NavbarItem>
              <NavbarItem>
                <Button
                  as={NavLink}
                  to="/register"
                  className="kmd-signup-btn"
                  size="sm"
                >
                  Sign Up
                </Button>
              </NavbarItem>
            </>
          )}
        </NavbarContent>

        {/* ── Mobile Menu ── */}
        <NavbarMenu className="kmd-mobile-menu">
          <div className="flex flex-col">
            {menuItems.map((item) => (
              <NavbarMenuItem key={item.route}>
                <NavLink
                  to={item.route}
                  className={({ isActive }) =>
                    `kmd-mobile-link${isActive ? " active" : ""}`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </NavLink>
              </NavbarMenuItem>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3">
            {user ? (
              <>
                <p className="kmd-user-email">{user?.email}</p>
                <Button
                  fullWidth
                  onPress={() => {
                    redirectToDashboard();
                    setIsMenuOpen(false);
                  }}
                  className="kmd-mobile-login text-sm"
                >
                  Dashboard
                </Button>
                <Button
                  fullWidth
                  color="danger"
                  variant="flat"
                  onPress={handleLogout}
                  className="text-sm"
                >
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Button
                  as={NavLink}
                  to="/login"
                  fullWidth
                  className="kmd-mobile-login text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Button>
                <Button
                  as={NavLink}
                  to="/register"
                  fullWidth
                  className="kmd-mobile-signup"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </NavbarMenu>
      </Navbar>
    </>
  );
}
