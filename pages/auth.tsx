import React, { useCallback, useState, useEffect, useContext } from "react";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import axios from "axios";
import { AiOutlineUser, AiFillLock, AiOutlineMail } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

import { SyncLoader } from "react-spinners";

import { requireAuthentication } from "@/lib/isAuthenticated";
import { GetServerSideProps } from "next";
import { isEmailValid, isPasswordValid, isUsernameValid } from "@/lib/isValid";
import { authErrorState } from "@/constants/initialStates";
import { Input } from "@/components";
import { UserContext } from "@/context/User/UserContext";

const Auth = ({}) => {
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [error, setError] = useState({
    email: { message: null },
    password: { message: null },
    username: { message: null },
  });
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  const [type, setType] = useState<string>("login");

  const toggleType = useCallback(() => {
    setType((currentType) => (currentType == "login" ? "register" : "login"));
    setError(authErrorState);
  }, []);

  const { dispatch } = useContext(UserContext);

  const login = useCallback(async () => {
    setError(authErrorState);
    try {
      if (isEmailValid(email) && isPasswordValid(password)) {
        setIsLoggingIn(true);
        signIn("credentials", {
          email,
          password,
          redirect: false,
        }).then(async ({ ok, error }: any) => {
          if (ok) {
            router.push("/");
          } else {
            let cause = "";
            switch (error) {
              case "Incorrect password": {
                cause = "password";
                break;
              }
              case "Email does not exist": {
                cause = "email";
                break;
              }
              default: {
                break;
              }
            }
            if (cause !== "") {
              setError((prevState) => {
                return {
                  ...prevState,
                  [cause]: {
                    message: error,
                  },
                };
              });
            }
            setIsLoggingIn(false);
          }
        });
      }
    } catch (error: any) {
      setIsLoggingIn(false);
      setError((prevState) => {
        return {
          ...prevState,
          [error.cause]: {
            message: error.message,
          },
        };
      });
    }
  }, [email, password, router]);

  const register = useCallback(async () => {
    setError(authErrorState);
    try {
      if (
        isUsernameValid(name) &&
        isEmailValid(email) &&
        isPasswordValid(password)
      ) {
        setIsLoggingIn(true);
        const user = await axios.post("/api/register", {
          email,
          name,
          password,
        });

        dispatch({
          type: "CHANGE_PROFILE",
          payload: {
            ...user.data,
            liked: { artists: [], songs: [], playlists: [] },
            playlists: [],
          },
        });

        login();
      }
    } catch (error: any) {
      setIsLoggingIn(false);
      setError((prevState) => {
        return {
          ...prevState,
          [error.code ? error.response.data.cause : error.cause]: {
            message: error.code ? error.response.data.error : error.message,
          },
        };
      });
    }
  }, [email, name, password, login]);

  const errorClasses = "border-1 border-red-400";

  return (
    <div className="relative h-screen w-screen bg-black bg-no-repeat bg-center bg-fixed bg-hover">
      <div className="w-full h-full lg:bg-opacity-50">
        <nav className="px-12 py-5">
          <img src="/images/logo.png" alt="logo" className="h-12" />
        </nav>
        <div className="flex justify-center items-center">
          <div
            className="
                bg-mediumGray 
                bg-opacity-70 
                px-16 py-16 
                self-center 
                lg:w-2/5 
                lg:max-w-md 
                rounded-md 
                w-full 
                transition
                drop-shadow-2xl"
          >
            <h2 className="text-white text-4xl mb-8 font-semibold text-center">
              {type == "login" ? "Login" : "Register"}
            </h2>
            <p className="font-bold text-gray-500">
              Please enter your credentials
            </p>
            {type !== "login" && (
              <div
                className={`w-full flex items-center mt-2 bg-black rounded-xl border ${
                  error.username.message ? errorClasses : "border-none"
                }`}
              >
                <AiOutlineUser size={30} className="ml-3" />
                <Input
                  type="text"
                  placeholder="Username"
                  setstate={setName}
                  state={name}
                />
              </div>
            )}
            {error.username.message && (
              <h3 className="font-semibold text-red-400">
                {error.username.message}
              </h3>
            )}
            <div
              className={`w-full flex items-center mt-2 bg-black rounded-xl border ${
                error.email.message ? errorClasses : "border-none"
              }`}
            >
              {type == "login" ? (
                <AiOutlineUser size={30} className="ml-3" />
              ) : (
                <AiOutlineMail size={30} className="ml-3" />
              )}
              <Input
                type="text"
                placeholder="Email"
                setstate={setEmail}
                state={email}
              />
            </div>
            {error.email.message && (
              <h3 className="font-semibold text-red-400">
                {error.email.message}
              </h3>
            )}
            <div
              className={`w-full flex items-center mt-2 bg-black rounded-xl border ${
                error.password.message ? errorClasses : "border-none"
              }`}
            >
              <AiFillLock size={30} className="ml-3" />
              <Input
                type="password"
                placeholder="Password"
                state={password}
                setstate={setPassword}
              />
            </div>
            {error.password.message && (
              <h3 className="font-semibold text-red-400">
                {error.password.message}
              </h3>
            )}
            <button
              disabled={isLoggingIn}
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
              {isLoggingIn ? (
                <SyncLoader size={8} color="white" />
              ) : type == "login" && !isLoggingIn ? (
                "Login"
              ) : (
                "Register"
              )}
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
              className="text-right mt-10  text-gray-500 cursor-pointer"
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
