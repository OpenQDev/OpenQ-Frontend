import Navbar from "./Navbar";
import Footer from "./Footer";

const HeadNavigation = ({ children }) => {
    return (
        <div>
            <Navbar>
                {children}
            </Navbar>
            <Footer />
        </div>
    );
};

export default HeadNavigation;
