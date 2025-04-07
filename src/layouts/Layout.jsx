import { Outlet } from "react-router";
import NavBar from "../components/NavBar";
import ScrollToTop from "../components/ScrollToTop";

const Layout = () => {
  
  return (
    <>
    <ScrollToTop />
      <NavBar />
      <div className=""> {/* Push content down to avoid overlap with fixed navbar */}
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
