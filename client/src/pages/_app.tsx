import "../styles/tailwind.css";
import "../styles/icons.css";
import { AppProps } from "next/app";
import { useRouter } from "next/router";
import axios from "axios";
import { Fragment } from "react";
import NavBar from "../components/NavBar";

axios.defaults.baseURL = "http://localhost:5000/api";
axios.defaults.withCredentials = true;
function App({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();
  const authRoutes = ["/login", "/register"];
  const isAuthRoute = authRoutes.includes(pathname);
  return (
    <Fragment>
      {!isAuthRoute && <NavBar />}
      <Component {...pageProps} />
    </Fragment>
  );
}

export default App;
