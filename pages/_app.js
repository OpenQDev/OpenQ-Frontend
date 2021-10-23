import "../styles/globals.css";
import "tailwindcss/tailwind.css";
import Navbar from "../components/Navbar";
import StoreProvider from "../store/Store/StoreProvider";
import AuthProvider from "../store/AuthStore/AuthProvider";
import Layout from "../components/Layout";

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <StoreProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </StoreProvider>
    </AuthProvider>
  );
}

export default MyApp;
