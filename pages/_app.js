import "../styles/globals.css";
import "tailwindcss/tailwind.css";
import Navbar from "../components/Navbar";
import Head from "next/head";
import Store from "../components/stateManagement/Store";

function MyApp({ Component, pageProps }) {
  return (
    <Store>
      <Navbar>
        <Component {...pageProps} />
      </Navbar>
    </Store>
  );
}

export default MyApp;
