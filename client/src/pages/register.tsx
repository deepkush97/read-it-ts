import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import { FormEvent, useState } from "react";
import InputGroup from "../components/InputGroup";
import { useAuthState } from "../context/auth";
export default function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [agreement, setAgreement] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const router = useRouter();
  const { authenticated } = useAuthState();
  if (authenticated) router.push("/");

  const submitForm = async (e: FormEvent) => {
    e.preventDefault();
    if (!agreement) {
      setErrors({ ...errors, agreement: "You must agree to our T&Cs." });
      return;
    }
    try {
      await axios.post("/auth/register", {
        email,
        password,
        username,
      });
      router.push("/login");
    } catch (error) {
      setErrors(error.response.data);
    }
  };

  return (
    <div className="flex bg-white">
      <Head>
        <title>Register</title>
      </Head>
      <div
        className="h-screen bg-center bg-cover w-36"
        style={{ backgroundImage: "url('/images/bricks.jpg')" }}
      ></div>
      <div className="flex flex-col justify-center pl-6">
        <div className="w-70">
          <h1 className="mb-2 text-lg font-medium">Sign Up</h1>
          <p className="mb-10 text-xs">
            By continuing, you agree to our User Agreement and Privacy Policy
          </p>
          <form onSubmit={submitForm}>
            <div className="mb-6">
              <input
                type="checkbox"
                className="mr-1 cursor-pointer"
                name="agreement"
                id="agreement"
                checked={agreement}
                onChange={(e) => setAgreement(e.target.checked)}
              />
              <label htmlFor="agreement" className="text-xs cursor-pointer">
                I agree to get emails about cool stuff on Read-it
              </label>
              <small className="block font-medium text-red-600">
                {errors.agreement}
              </small>
            </div>
            <InputGroup
              className="mb-2"
              error={errors.email}
              placeholder="Email"
              setValue={setEmail}
              type="email"
              value={email}
            />
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
              Sign Up
            </button>
          </form>
          <small>
            Already a read-itor??
            <Link href="/login">
              <a className="ml-1 text-blue-500 uppercase">Log In</a>
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
}
