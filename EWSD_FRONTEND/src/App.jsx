import { Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import { ToastContainer, Slide } from "react-toastify";
import LoginPage from "./pages/LoginPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import NotFoundPage from "./pages/NotFoundPage";
import { ProtectedRoute } from "./components/protect-route/ProtectedRoute";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import {
  LuGauge,
  LuUsers,
  LuSchool,
  LuCalendarDays,
  LuBookPlus,
  LuFileText,
  LuInbox,
  LuFileCheck,
} from "react-icons/lu";
import { LiaUserClockSolid } from "react-icons/lia";
import { CgProfile } from "react-icons/cg";
import { TbCategory } from "react-icons/tb";
import { IoNotificationsOutline } from "react-icons/io5";
import { Users } from "./features/admin/components/Users";
import { Faculties } from "./features/admin/components/Faculties";
import { AcademicYears } from "./features/admin/components/AcademicYears";
import { Categories } from "./features/admin/components/Categories";
import { SubmitContribution } from "./features/student/submissions/components/SubmitContribution";
import { UpdateProfileForm } from "./features/student/profile/components/UpdateProfileForm";
import { ContributionsList } from "./features/coordinator/contributions/components/ContributionsList";
import { StudentList } from "./features/coordinator/userlists/components/StudentList";
import ContributionList from "./features/student/contributions/components/ContributionList";
import { SelectedContributionsList } from "./features/student/contributions/components/SelectedContributionsList";
import CoordinatorDashboard from "./features/coordinator/dashboard/components/CoordinatorDashboard";
import { EditContribution } from "./features/student/contributions/components/EditContribution";
import { Contributions } from "./features/admin/components/ContributionList";
import { NotificationList } from "./features/notification/components/NotificationList";
import Dashboard from "./features/admin/components/Dashboard";
import { Inbox } from "./features/admin/components/Inbox";
import { ManagerDashboard } from "./features/manager/components/Dashboard";
import { AboutPage } from "./pages/AboutPage";
import { TermsPage } from "./pages/TermsPage";
import { ContactPage } from "./pages/ContactPage";
import { StudentDashboard } from "@/features/student/dashboard/components/StudentDashboard";
import { GuestDashboard } from "@/features/guest/dashboard/components/GuestDashboard";
import { GuestList } from "./features/coordinator/guestlists/components/GuestList";
import { useTheme } from "@/context/ThemeContext";
import { TwoFactorAuthPage } from "./pages/TwoFactorAuthPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

const adminMenuItems = [
  { name: "Dashboard", path: "/admin/dashboard", icon: <LuGauge size={20} /> },
  { name: "Inbox", path: "/admin/inbox", icon: <LuInbox size={20} /> },
  { name: "Users", path: "/admin/users", icon: <LuUsers size={20} /> },
  { name: "Faculties", path: "/admin/faculties", icon: <LuSchool size={20} /> },
  {
    name: "Academic Years",
    path: "/admin/academic-years",
    icon: <LuCalendarDays size={20} />,
  },
  {
    name: "Categories",
    path: "/admin/categories",
    icon: <TbCategory size={20} />,
  },
  {
    name: "Contributions",
    path: "/admin/contributions",
    icon: <LuFileText size={20} />,
  },
];

const managerMenuItems = [
  {
    name: "Dashboard",
    path: "/marketing-manager/dashboard",
    icon: <LuGauge size={20} />,
  },
  {
    name: "Contributions",
    path: "/marketing-manager/contributions",
    icon: <LuFileText size={20} />,
  },
];

const studentMenuItems = [
  {
    name: "Dashboard",
    path: "/student/dashboard",
    icon: <LuGauge size={20} />,
  },
  {
    name: "Submit Contribution",
    path: "/student/submit-contribution",
    icon: <LuBookPlus size={20} />,
  },
  {
    name: "My Contributions",
    path: "/student/my-contributions",
    icon: <LuFileText size={20} />,
  },
  {
    name: "Selected Contributions",
    path: "/student/selected-contributions",
    icon: <LuFileCheck size={20} />,
  },
  { name: "Profile", path: "/student/profile", icon: <CgProfile size={20} /> },
  {
    name: "Notifications",
    path: "/student/notifications",
    icon: <IoNotificationsOutline size={20} />,
  },
];

const marketingCoordinatorMenuItems = [
  {
    name: "Dashboard",
    path: "/marketing-coordinator/dashboard",
    icon: <LuGauge size={20} />,
  },
  {
    name: "Students",
    path: "/marketing-coordinator/students",
    icon: <LuUsers size={20} />,
  },
  {
    name: "Contributions",
    path: "/marketing-coordinator/contributions",
    icon: <LuFileText size={20} />,
  },
  {
    name: "Guests",
    path: "/marketing-coordinator/guests",
    icon: <LiaUserClockSolid size={20} />,
  },
  {
    name: "Profile",
    path: "/marketing-coordinator/profile",
    icon: <CgProfile size={20} />,
  },
  {
    name: "Notifications",
    path: "/marketing-coordinator/notifications",
    icon: <IoNotificationsOutline size={20} />,
  },
];

const guestMenuItems = [
  {
    name: "Dashboard",
    path: "/guest/dashboard",
    icon: <LuGauge size={20} />,
  },
  {
    name: "Profile",
    path: "/guest/profile",
    icon: <CgProfile size={20} />,
  },
];

function App() {
  const { theme } = useTheme();
  
  return (
    <>
      {/* Routes */}
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/two-factor-auth" element={<TwoFactorAuthPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        // Admin Routes
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route
            path="/admin"
            element={<DashboardLayout menuItems={adminMenuItems} />}
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="inbox" element={<Inbox />} />
            <Route path="users" element={<Users />} />
            <Route path="faculties" element={<Faculties />} />
            <Route path="academic-years" element={<AcademicYears />} />
            <Route path="categories" element={<Categories />} />
            <Route path="contributions" element={<Contributions />} />
          </Route>
        </Route>

        // Marketing Manager Route
        <Route
          element={<ProtectedRoute allowedRoles={["marketing_manager"]} />}
        >
          <Route
            path="/marketing-manager"
            element={<DashboardLayout menuItems={managerMenuItems} />}
          >
            <Route path="dashboard" element={<ManagerDashboard />} />
            <Route path="contributions" element={<Contributions />} />
          </Route>
        </Route>

        // Student Routes
        <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
          <Route
            path="/student"
            element={<DashboardLayout menuItems={studentMenuItems} />}
          >
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route
              path="submit-contribution"
              element={<SubmitContribution />}
            />
            <Route path="my-contributions" element={<ContributionList />} />
            <Route
              path="my-contributions/:id/edit"
              element={<EditContribution />}
            />
            <Route path="selected-contributions" element={<SelectedContributionsList />} />
            <Route path="profile" element={<UpdateProfileForm />} />
            <Route path="notifications" element={<NotificationList />} />
          </Route>
        </Route>

        // Marketing Coordinator Routes
        <Route
          element={<ProtectedRoute allowedRoles={["marketing_coordinator"]} />}
        >
          <Route
            path="/marketing-coordinator"
            element={
              <DashboardLayout menuItems={marketingCoordinatorMenuItems} />
            }
          >
            <Route path="dashboard" element={<CoordinatorDashboard />} />
            <Route path="students" element={<StudentList />} />
            <Route path="contributions" element={<ContributionsList />} />
            <Route path="guests" element={<GuestList />} />
            <Route path="profile" element={<UpdateProfileForm />} />
            <Route path="notifications" element={<NotificationList />} />
          </Route>
        </Route>

        // Guest Routes
        <Route element={<ProtectedRoute allowedRoles={["guest"]} />}>
          <Route
            path="/guest"
            element={<DashboardLayout menuItems={guestMenuItems} />}
          >
            <Route path="dashboard" element={<GuestDashboard />} />
            <Route path="profile" element={<UpdateProfileForm />} />
          </Route>
        </Route>

        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {/* Toast */}
      <ToastContainer
        position="top-center"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme === "dark" ? "dark" : "light"}
        transition={Slide}
      />
    </>
  );
}

export default App;
