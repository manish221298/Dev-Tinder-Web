import { Outlet } from "react-router-dom";
import Navbar from "./menubar/Navbar";
import Footer from "./menubar/Footer";

const Body = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Body;
