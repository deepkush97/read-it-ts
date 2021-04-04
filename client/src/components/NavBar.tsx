import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { FC, Fragment, useEffect, useState } from "react";
import { useAuthDispatch, useAuthState } from "../context/auth";
import ReadItLogo from "../images/logo.svg";
import { Sub } from "../types";
import { useRouter } from "next/router";

const NavBar: FC = () => {
  const { authenticated, loading } = useAuthState();
  const [name, setName] = useState("");
  const [timer, setTimer] = useState(null);
  const [subs, setSubs] = useState<Sub[]>([]);
  const dispatch = useAuthDispatch();
  const router = useRouter();
  const logout = () => {
    axios
      .get("/auth/logout")
      .then(() => {
        dispatch("LOGOUT");
        window.location.reload();
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    if (name.trim() === "") {
      setSubs([]);
      return;
    }
    searchSub();
  }, [name]);

  const searchSub = async () => {
    clearTimeout(timer);
    setTimer(
      setTimeout(async () => {
        try {
          const { data } = await axios.get(`/subs/search/${name}`);
          setSubs(data);
          console.log("data :>> ", data);
        } catch (error) {
          console.log(error);
        }
      }, 400)
    );
  };

  const goToSub = (subName: string) => {
    router.push(`/r/${subName}`);
    setName("");
  };

  return (
    <div className="fixed inset-x-0 top-0 z-10 flex items-center justify-center h-12 px-5 bg-white">
      {/* Logo and title */}
      <div className="flex items-center">
        <Link href="/">
          <a>
            <ReadItLogo className="w-8 h-8 mr-2" />
          </a>
        </Link>
        <span className="text-2xl font-semibold ">
          <Link href="/">Read-It</Link>
        </span>
      </div>
      {/* SearchBar */}
      <div className="relative flex items-center mx-auto bg-gray-100 border rounded hover:bg-white hover:border-blue-500">
        <i className="pl-4 pr-3 text-gray-500 fas fa-search"></i>
        <input
          type="text"
          placeholder="Search"
          className="py-1 pr-3 bg-transparent rounded w-160 focus:outline-none"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div
          className="absolute left-0 right-0 bg-white "
          style={{ top: "100%" }}
        >
          {subs.map((sub) => (
            <div
              key={sub.name}
              className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-200"
              onClick={() => goToSub(sub.name)}
            >
              <Image
                className="rounded-full"
                src={sub.imageUrl}
                alt="sub"
                height={(8 * 16) / 4}
                width={(8 * 16) / 4}
              />
              <div className="ml-4 text-sm">
                <p className="font-medium">{sub.name}</p>
                <p className="text-gray-600">{sub.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Auth Button */}
      <div className="flex">
        {!loading &&
          (authenticated ? (
            <button
              className="w-32 py-1 mr-4 leading-5 hollow blue button"
              onClick={logout}
            >
              Logout
            </button>
          ) : (
            <Fragment>
              <Link href="/login">
                <a className="w-32 py-1 mr-4 leading-5 hollow blue button">
                  Log In
                </a>
              </Link>
              <Link href="/register">
                <a className="w-32 py-1 leading-5 blue button">Register</a>
              </Link>
            </Fragment>
          ))}
      </div>
    </div>
  );
};
export default NavBar;
