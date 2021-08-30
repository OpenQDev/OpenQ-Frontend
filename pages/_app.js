import "../styles/globals.css";
import "tailwindcss/tailwind.css";
import Navbar from "../components/Navbar";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <div>
      {/*  <Navbar> */}
      <Component {...pageProps} />
      {/* </Navbar> */}
    </div>
  );
}

export default MyApp;
