import "../styles/globals.css";
import "tailwindcss/tailwind.css";
import Navbar from "../components/Navbar";
import StoreProvider from "../store/Store/StoreProvider";
import AuthProvider from "../store/AuthStore/AuthProvider";
import Layout from "../components/Layout";
import ChainConnectionProvider from "../store/ChainConnectionStore/ChainConnectionProvider";

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <StoreProvider>
        <ChainConnectionProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ChainConnectionProvider>
      </StoreProvider>
    </AuthProvider>
  );
}

export default MyApp;
