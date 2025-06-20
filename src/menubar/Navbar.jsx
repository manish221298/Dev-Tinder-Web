import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getToken } from "../utils/constants";

const Navbar = () => {
  const navigate = useNavigate();

  const userData = useSelector((state) => state.user);

  console.log("navbar", userData?.photo);

  return (
    <div className="navbar bg-base-300 shadow-sm sticky top-0 z-50">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">
          Dev Tinder
        </Link>
      </div>
      <div className="flex gap-2">
        {/* <input
          type="text"
          placeholder="Search"
          className="input input-bordered w-24 md:w-auto"
        /> */}
        <h1 className="flex items-center text-primary ">
          Welcome {userData?.firstName}
        </h1>
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <img
                alt="Tailwind CSS Navbar component"
                src={
                  userData?.photo
                    ? userData.photo
                    : "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                }
              />
            </div>
          </div>
          {getToken() && (
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link to="/profile" className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </Link>
              </li>
              <li>
                <Link to="connections">Connections</Link>
              </li>
              <li>
                <Link to="requests">Requests</Link>
              </li>
              <li>
                <Link to="/addquestions">Add Questions</Link>
              </li>
              <li>
                <Link to="/starttest">Quiz</Link>
              </li>
              <li>
                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    navigate("/login");
                  }}
                  to="requests"
                >
                  Logout
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
