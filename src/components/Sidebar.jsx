import {
  ChevronFirst,
  ChevronLast,
  LogOut,
  Calendar,
  Clock,
  Menu,
  X,
  LayoutDashboard,
  User,
} from "lucide-react";
import { useState } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

// ============================================================================
// CONSTANTS
// ============================================================================

const NAV_ITEMS = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    path: "/dashboard",
  },
  {
    icon: Clock,
    label: "Attendance",
    path: "/attendance",
  },
  {
    icon: Calendar,
    label: "Leave Requests",
    path: "/leave",
  },
  {
    icon: User,
    label: "Manage Intern",
    path: "/manageintern",
  },
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const getUserInitials = (firstName, lastName) => {
  return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`;
};

// const getActiveItemPath = (label) => {
//   return `/${label.toLowerCase().replace(" ", "")}`;
// };

// ============================================================================
// STYLED CLASSES (for better maintainability)
// ============================================================================

const STYLES = {
  sidebar: {
    base: "fixed md:relative h-screen flex flex-col p-4 md:p-6 backdrop-blur-xl bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] border-r border-white/10 shadow-2xl transition-all duration-300 z-40",
    collapsed: "md:w-20",
    expanded: "md:w-64",
    mobileOpen: "translate-x-0 w-64",
    mobileClosed: "-translate-x-full md:translate-x-0",
  },
  mobileMenuButton:
    "md:hidden fixed top-4 left-4 z-50 p-3 rounded-xl bg-slate-900/90 backdrop-blur-xl border border-white/10 text-white hover:bg-slate-800/90 transition-all",
  mobileOverlay: "md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30",
  collapseButton:
    "hidden md:flex p-2 rounded-lg hover:bg-white/10 transition-all active:scale-95",
  profile: {
    container:
      "relative flex flex-col items-center hover:bg-white/10 p-4 rounded-2xl transition-all cursor-pointer mb-6 group",
    collapsedContainer: "md:p-2",
    avatar:
      "rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-2 border-blue-400/50 flex items-center justify-center text-blue-300 font-bold transition-all duration-300 shadow-lg",
    avatarCollapsed: "md:w-12 md:h-12 md:text-lg w-14 h-14 text-xl",
    avatarExpanded: "w-16 h-16 text-2xl",
    info: "text-center mt-3",
    name: "text-base font-semibold text-white",
    role: "text-sm text-white/60 mt-0.5",
  },
  tooltip:
    "hidden md:block absolute left-full ml-2 px-3 py-2 bg-slate-900 rounded-lg text-sm text-white whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-xl border border-white/10",
  nav: "flex flex-col gap-2 flex-1",
  logoutSection: "mt-auto pt-4 border-t border-white/10",
  modal: {
    overlay:
      "fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4",
    container:
      "bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl",
    title: "text-xl font-bold text-white mb-2",
    description: "text-white/70 mb-6",
    buttonGroup: "flex gap-3",
    cancelButton:
      "flex-1 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-all active:scale-95",
    confirmButton:
      "flex-1 px-4 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 font-medium transition-all active:scale-95 border border-red-500/30",
  },
};

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

const MobileMenuButton = ({ isOpen, onClick }) => (
  <button onClick={onClick} className={STYLES.mobileMenuButton}>
    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
  </button>
);

const MobileOverlay = ({ isOpen, onClick }) =>
  isOpen ? <div className={STYLES.mobileOverlay} onClick={onClick} /> : null;

const CollapseButton = ({ collapsed, onClick }) => (
  <div className="flex items-center mb-6">
    <h1 className={collapsed ? "hidden" : "font-bold w-full text-2xl"}>
      Internship Attendance
    </h1>
    <div className="flex justify-end">
      <button onClick={onClick} className={STYLES.collapseButton}>
        {collapsed ? (
          <ChevronLast className="w-5 h-5 text-blue-300" />
        ) : (
          <ChevronFirst className="w-5 h-5 text-blue-300" />
        )}
      </button>
    </div>
  </div>
);

const ProfileSection = ({ user, collapsed, onClick }) => {
  const initials = getUserInitials(user?.firstName, user?.lastName);
  const fullName = `${user?.firstName} ${user?.lastName}`;

  return (
    <div
      className={`${STYLES.profile.container} ${
        collapsed ? STYLES.profile.collapsedContainer : ""
      }`}
      onClick={onClick}
    >
      <div
        className={`
          ${STYLES.profile.avatar}
          ${
            collapsed
              ? STYLES.profile.avatarCollapsed
              : STYLES.profile.avatarExpanded
          }
        `}
      >
        {initials}
      </div>

      <div className={`${collapsed ? "md:hidden" : ""} ${STYLES.profile.info}`}>
        <h2 className={STYLES.profile.name}>{fullName}</h2>
        <p className={STYLES.profile.role}>{user?.role}</p>
      </div>

      {collapsed && <div className={STYLES.tooltip}>{fullName}</div>}
    </div>
  );
};

const NavigationItems = ({ collapsed, activeItem, onNavigate }) => (
  <nav className={STYLES.nav}>
    {NAV_ITEMS.map((item) => (
      <SidebarItem
        key={item.path}
        collapsed={collapsed}
        icon={<item.icon className="w-5 h-5" />}
        label={item.label}
        onClick={() => onNavigate(item.path)}
        activeItem={activeItem}
        path={item.path}
      />
    ))}
  </nav>
);

const LogoutSection = ({ collapsed, onClick }) => (
  <div className={STYLES.logoutSection}>
    <SidebarItem
      collapsed={collapsed}
      icon={<LogOut className="w-5 h-5" />}
      label="Logout"
      onClick={onClick}
      danger
    />
  </div>
);

const LogoutConfirmModal = ({ isOpen, onCancel, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className={STYLES.modal.overlay}>
      <div className={STYLES.modal.container}>
        <h3 className={STYLES.modal.title}>Confirm Logout</h3>
        <p className={STYLES.modal.description}>
          Are you sure you want to logout?
        </p>

        <div className={STYLES.modal.buttonGroup}>
          <button onClick={onCancel} className={STYLES.modal.cancelButton}>
            Cancel
          </button>
          <button onClick={onConfirm} className={STYLES.modal.confirmButton}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

const SidebarItem = ({
  icon,
  label,
  onClick,
  collapsed,
  danger,
  activeItem,
  path,
}) => {
  const isActive = activeItem === path;

  const baseClasses =
    "relative p-3 flex items-center gap-3 rounded-xl transition-all w-full group active:scale-95 font-medium";
  const dangerClasses = danger
    ? "text-red-300 hover:bg-red-500/20 hover:text-red-200"
    : "hover:bg-white/10 text-white/80 hover:text-white";
  const collapsedClasses = collapsed ? "md:justify-center" : "";
  const activeClasses = isActive ? "bg-white/10 text-white" : "";

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${dangerClasses} ${collapsedClasses} ${activeClasses}`}
    >
      <span className={danger ? "text-red-300" : "text-blue-300"}>{icon}</span>
      <span className={`${collapsed ? "md:hidden" : ""} text-sm`}>{label}</span>

      {collapsed && <span className={STYLES.tooltip}>{label}</span>}
    </button>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(window.location.pathname);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Event Handlers
  const handleNavigate = (path) => {
    navigate(path);
    setActiveItem(path);
    setMobileOpen(false);
  };

  const handleToggleCollapse = () => setCollapsed(!collapsed);
  const handleToggleMobile = () => setMobileOpen(!mobileOpen);
  const handleCloseMobile = () => setMobileOpen(false);
  const handleShowLogout = () => setShowLogoutConfirm(true);
  const handleCancelLogout = () => setShowLogoutConfirm(false);

  // Sidebar Classes
  const sidebarClasses = `
    ${STYLES.sidebar.base}
    ${collapsed ? STYLES.sidebar.collapsed : STYLES.sidebar.expanded}
    ${mobileOpen ? STYLES.sidebar.mobileOpen : STYLES.sidebar.mobileClosed}
  `;

  return (
    <>
      <MobileMenuButton isOpen={mobileOpen} onClick={handleToggleMobile} />
      <MobileOverlay isOpen={mobileOpen} onClick={handleCloseMobile} />
      <aside className={sidebarClasses}>
        <CollapseButton collapsed={collapsed} onClick={handleToggleCollapse} />

        <ProfileSection
          user={user}
          collapsed={collapsed}
          onClick={() => handleNavigate("/profile")}
        />

        <NavigationItems
          collapsed={collapsed}
          activeItem={activeItem}
          onNavigate={handleNavigate}
        />

        <LogoutSection collapsed={collapsed} onClick={handleShowLogout} />
      </aside>

      <LogoutConfirmModal
        isOpen={showLogoutConfirm}
        onCancel={handleCancelLogout}
        onConfirm={logout}
      />
    </>
  );
}

export default Sidebar;
