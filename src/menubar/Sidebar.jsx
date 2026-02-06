import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getToken } from "../utils/constants";
import ProfileIcon from "../customicon/ProfileIcon";
import ConnectionsIcon from "../customicon/ConnectionsIcon";
import RequestsIcon from "../customicon/RequestsIcon";
import UploadIcon from "../customicon/UploadIcon";
import QuizIcon from "../customicon/QuizIcon";
import ResultsIcon from "../customicon/ResultsIcon";
import LogoutIcon from "../customicon/LogoutIcon";
import MenuIcon from "../customicon/MenuIcon";
import CloseIcon from "../customicon/CloseIcon";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const token = getToken();

  // Don't show sidebar on login page
  if (location.pathname === "/login" || !token) {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navigationItems = [
    {
      path: "/profile",
      label: "Profile",
      icon: ProfileIcon,
    },
    {
      path: "/connections",
      label: "Connections",
      icon: ConnectionsIcon,
    },
    {
      path: "/requests",
      label: "Requests",
      icon: RequestsIcon,
    },
    {
      path: "/uploadpdf",
      label: "Upload PDF",
      icon: UploadIcon,
    },
    {
      path: "/quiz",
      label: "Quiz",
      icon: QuizIcon,
    },
    {
      path: "/result",
      label: "Results",
      icon: ResultsIcon,
    },
  ];

  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-20 right-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="btn btn-circle btn-primary shadow-lg"
          aria-label="Toggle menu"
        >
          {isOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-base-100/95 backdrop-blur-md shadow-2xl border-r border-base-300 z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 w-64`}
      >
        <div className="flex flex-col h-full">
          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 pt-6">
            <ul className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        active
                          ? "bg-primary text-primary-content shadow-lg"
                          : "hover:bg-base-200 text-base-content"
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 ${
                          active ? "text-primary-content" : "text-base-content/70"
                        }`}
                      />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-base-300">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-error hover:bg-error/10 transition-all duration-200"
            >
              <LogoutIcon className="h-4 w-4" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Spacer for desktop sidebar - only show when sidebar is visible */}
      {token && location.pathname !== "/login" && (
        <div className="hidden lg:block w-64"></div>
      )}
    </>
  );
};

export default Sidebar;

