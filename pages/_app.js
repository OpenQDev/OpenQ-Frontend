import "../styles/globals.css";
import "tailwindcss/tailwind.css";
import Navbar from "../components/Navbar";
import StoreProvider from "../store/Store/StoreProvider";
import AuthProvider from "../store/AuthStore/AuthProvider";

function MyApp({ Component, pageProps }) {
  console.log("FAKE_TOKEN", process.env.FAKE_TOKEN);
  return (
    <AuthProvider>
      <StoreProvider>
        <Navbar>
          <Component {...pageProps} />
        </Navbar>
      </StoreProvider>
    </AuthProvider>
  );
}

export default MyApp;
