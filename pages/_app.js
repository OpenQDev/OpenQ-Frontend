import "../styles/globals.css";
import "tailwindcss/tailwind.css";
import Navbar from "../components/Navbar";
import Head from "next/head";
import StoreProvider from "../store/StoreProvider";

function MyApp({ Component, pageProps }) {
  return (
    <StoreProvider>
      <Navbar>
        <Component {...pageProps} />
      </Navbar>
    </StoreProvider>
  );
}

export default MyApp;
