import axios from "axios";
import { AppProps } from "next/app";
import { useRouter } from "next/router";
import { SWRConfig } from "swr";
import NavBar from "../components/NavBar";
import { AuthProvider } from "../context/auth";
import "../styles/icons.css";
import "../styles/tailwind.css";

const fetcher = async (url: string) => {
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
};

axios.defaults.baseURL = "http://localhost:5000/api";
axios.defaults.withCredentials = true;
function App({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();
  const authRoutes = ["/login", "/register"];
  const isAuthRoute = authRoutes.includes(pathname);
  return (
    <SWRConfig
      value={{
        fetcher,
      }}
    >
      <AuthProvider>
        {!isAuthRoute && <NavBar />}
        <div className={isAuthRoute ? "" : "pt-12"}>
          <Component {...pageProps} />
        </div>
      </AuthProvider>
    </SWRConfig>
  );
}

export default App;
