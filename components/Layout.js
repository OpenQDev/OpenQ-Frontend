import Navbar from "./Navbar";
import Footer from "./Footer";
import BountySearch from "./BountySearch";
import ProfilePicture from "./ProfilePicture";
import ConnectButton from "./WalletConnect/ConnectButton.js";

const Layout = ({ children }) => {
    return (
        <div>
            <Navbar>
                <div className="flex flex-fill pl-12 pt-5 pr-12 pb-5 border-b items-center justify-between">
                    <BountySearch />
                    <ProfilePicture />
                    <ConnectButton />
                </div>
                {children}
            </Navbar >
            <Footer />
        </div >
    );
};

export default Layout;
