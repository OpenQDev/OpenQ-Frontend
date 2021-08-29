import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <div>
      <Navbar>
        {children}
      </Navbar>
      <Footer />
    </div>
  );
};

export default Layout;
