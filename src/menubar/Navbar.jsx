import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getToken } from "../utils/constants";

const Navbar = () => {
  const navigate = useNavigate();

  const userData = useSelector((state) => state.user);

  return (
    <div className="navbar bg-base-100/80 backdrop-blur-md shadow-lg border-b border-base-300 sticky top-0 z-50">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl font-bold hover:scale-105 transition-transform">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Dev Tinder
        </Link>
      </div>
      <div className="flex gap-3 items-center">
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-base-200/50">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-sm font-medium text-base-content">
            Welcome, <span className="text-primary font-semibold">{userData?.firstName || "User"}</span>
          </span>
        </div>
        <div className="avatar">
          <div className="w-10 rounded-full ring-2 ring-primary ring-offset-2 ring-offset-base-100">
            <img
              alt="User avatar"
              src={
                userData?.photo
                  ? userData.photo
                  : "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
