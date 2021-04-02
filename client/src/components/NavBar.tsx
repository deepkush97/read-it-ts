import axios from "axios";
import Link from "next/link";
import { FC, Fragment } from "react";
import { useAuthDispatch, useAuthState } from "../context/auth";
import ReadItLogo from "../images/logo.svg";

const NavBar: FC = () => {
  const { authenticated, loading } = useAuthState();
  const dispatch = useAuthDispatch();
  const logout = () => {
    axios
      .get("/auth/logout")
      .then(() => {
        dispatch("LOGOUT");
        window.location.reload();
      })
      .catch((error) => console.log(error));
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
      <div className="flex items-center mx-auto bg-gray-100 border rounded hover:bg-white hover:border-blue-500">
        <i className="pl-4 pr-3 text-gray-500 fas fa-search"></i>
        <input
          type="text"
          placeholder="Search"
          className="py-1 pr-3 bg-transparent rounded w-160 focus:outline-none"
        />
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
