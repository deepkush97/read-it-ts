import axios from "axios";
import { AppProps } from "next/app";
import { useRouter } from "next/router";
import NavBar from "../components/NavBar";
import { AuthProvider } from "../context/auth";
import "../styles/icons.css";
import "../styles/tailwind.css";

axios.defaults.baseURL = "http://localhost:5000/api";
axios.defaults.withCredentials = true;
function App({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();
  const authRoutes = ["/login", "/register"];
  const isAuthRoute = authRoutes.includes(pathname);
  return (
    <AuthProvider>
      {!isAuthRoute && <NavBar />}
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default App;
