import Navbar from "./Navbar";
import Footer from "./Footer";
import BountySearch from "./BountySearch";
import WalletConnect from "./WalletConnect/WalletConnect";
import NetworkConnect from "./NetworkConnect/NetworkConnect";
import AuthButton from "./Authentication/AuthButton";
import ProfilePicture from "./ProfilePicture";

const Layout = ({ children }) => {
    return (
        <div>
            <Navbar>
                <div className="flex flex-fill pl-12 pt-5 pr-12 pb-5 border-b items-center justify-between">
                    <BountySearch />
                    <WalletConnect />
                    <NetworkConnect deployEnv={process.env.DEPLOY_ENV} />
                    <ProfilePicture />
                    <AuthButton />
                </div>
                {children}
            </Navbar>
            <Footer />
        </div>
    );
};

export default Layout;
