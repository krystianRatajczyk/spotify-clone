import React, { useCallback, useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import axios from "axios";
import { AiOutlineUser, AiFillLock, AiOutlineMail } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

import Input from "@/components/Input";
import serverAuth from "@/lib/serverAuth";
import { requireAuthentication } from "@/lib/isAuthenticated";
import { GetServerSideProps } from "next";

const Auth = ({}) => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const [type, setType] = useState("login");

  const toggleType = useCallback(() => {
    setType((currentType) => (currentType == "login" ? "register" : "login"));
  }, []);

  const login = useCallback(async () => {
    try {
      await signIn("credentials", {
        email,
        password,
        callbackUrl: "/",
      });
    } catch (error: any) {
      setError(error);
    }
  }, [email, password, router]);

  const register = useCallback(async () => {
    try {
      await axios.post("/api/register", {
        email,
        name,
        password,
      });
      login();
    } catch (error) {
      console.log(error);
    }
  }, [email, name, password, login]);

  return (
    <div className="relative h-screen w-screen bg-black bg-no-repeat bg-center bg-fixed bg-hover">
      <div className="w-full h-full lg:bg-opacity-50">
        <nav className="px-12 py-5">
          <img src="/images/logo.png" alt="logo" className="h-12" />
        </nav>
        <div className="flex justify-center items-center">
          <div className="bg-lightGray bg-opacity-70 px-16 py-16 self-centerlg:w-2/5 lg:max-w-md rounded-md w-full transition">
            <h2 className="text-white text-4xl mb-8 font-semibold text-center">
              {type == "login" ? "Login" : "Register"}
            </h2>
            <p className="font-bold text-gray-500">
              Please enter your credentials
            </p>
            {type !== "login" && (
              <div className="w-full flex items-center mt-5 bg-black rounded-xl">
                <AiOutlineUser size={30} className="ml-3" />
                <Input
                  type="text"
                  placeholder="Username"
                  setState={setName}
                  state={name}
                />
              </div>
            )}
            <div className="w-full flex items-center mt-5 bg-black rounded-xl">
              {type == "login" ? (
                <AiOutlineUser size={30} className="ml-3" />
              ) : (
                <AiOutlineMail size={30} className="ml-3" />
              )}
              <Input
                type="text"
                placeholder="Email"
                setState={setEmail}
                state={email}
              />
            </div>
            <div className="w-full flex items-center mt-5 bg-black rounded-xl">
              <AiFillLock size={30} className="ml-3" />
              <Input
                type="password"
                placeholder="Password"
                state={password}
                setState={setPassword}
              />
            </div>
            <button
              onClick={() => {
                type == "login" ? login() : register();
              }}
              className="
                    w-full 
                    h-[45px] 
                    bg-primary 
                    mt-5 
                    rounded-xl 
                    transition
                    duration-300 
                    hover:bg-darkPrimary"
            >
              {type == "login" ? "Login" : "Register"}
            </button>
            {type == "login" && (
              <div>
                <h2 className="text-center mt-5 text-gray-500">OR</h2>
                <button
                  className="
                    w-full 
                    h-[60px]  
                    mt-5 
                    rounded-xl 
                    border-red-300
                    border
                    flex
                    items-center
                    justify-center
                    gap-2
                    transition
                    hover:shadow-md 
                    hover:shadow-gray-700"
                >
                  <FcGoogle size={30} />
                  <h3 className="font-semibold text-xl">Google</h3>
                </button>
                <button
                  className="
                    w-full 
                    h-[60px] 
                    mt-5 
                    rounded-xl
                    border-white
                    border
                    flex
                    items-center
                    justify-center
                    gap-2
                    transition
                    hover:shadow-md 
                    hover:shadow-gray-700"
                >
                  <FaGithub size={30} />
                  <h3 className="font-semibold text-xl">Github</h3>
                </button>
              </div>
            )}
            <p
              className="text-right mt-4  text-gray-500 cursor-pointer"
              onClick={() => {
                setName("");
                setEmail("");
                setPassword("");
                toggleType();
              }}
            >
              {type == "login"
                ? "Don't have account ?"
                : "Already have an account ? "}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;

export const getServerSideProps: GetServerSideProps = requireAuthentication(
  async (_ctx) => {
    return {
      props: {},
    };
  }
);
