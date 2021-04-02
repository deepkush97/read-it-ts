import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import { FormEvent, useState } from "react";
import InputGroup from "../components/InputGroup";
import { useAuthDispatch } from "../context/auth";
export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<any>({});
  const router = useRouter();
  const dispatch = useAuthDispatch();
  const submitForm = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/login", {
        password,
        username,
      });
      dispatch({ type: "LOGIN", payload: res.data });
      router.push("/");
    } catch (error) {
      setErrors(error.response.data);
    }
  };

  return (
    <div className="flex bg-white">
      <Head>
        <title>Login</title>
      </Head>
      <div
        className="h-screen bg-center bg-cover w-36"
        style={{ backgroundImage: "url('/images/bricks.jpg')" }}
      ></div>
      <div className="flex flex-col justify-center pl-6">
        <div className="w-70">
          <h1 className="mb-2 text-lg font-medium">Sign In</h1>
          <p className="mb-10 text-xs">
            By continuing, you agree to our User Agreement and Privacy Policy
          </p>
          <form onSubmit={submitForm}>
            <InputGroup
              className="mb-2"
              error={errors.username}
              placeholder="Username"
              setValue={setUsername}
              type="text"
              value={username}
            />
            <InputGroup
              className="mb-4"
              error={errors.password}
              placeholder="Password"
              setValue={setPassword}
              type="password"
              value={password}
            />
            <button className="w-full py-2 mb-4 text-xs font-bold text-white uppercase bg-blue-500 border border-blue-500 rounded">
              Login
            </button>
          </form>
          <small>
            New to read-it??
            <Link href="/register">
              <a className="ml-1 text-blue-500 uppercase">Sign Up</a>
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
}
