import React, { use, useEffect, useRef, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { GoPerson } from "react-icons/go";

import Button from "./Button";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";
import CircularButton from "./CircularButton";
import { RiSearchLine } from "react-icons/ri";
import Input from "../Input";

const TopBar = () => {
  const router = useRouter();

  const pathname = usePathname();

  const inputRef = useRef<HTMLInputElement>(null);

  const [history, setHistory] = useState<string[]>([pathname]);
  const [initialized, setInitialized] = useState<boolean>(false);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [isClicked, setIsClicked] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [isHover, setIsHover] = useState<boolean>(false);
  const [border, setBorder] = useState<string>("");

  useEffect(() => {
    if (initialized && isClicked) {
      setHistoryIndex((prevIndex) => prevIndex + 1);
      setHistory((prevHistory) => {
        return [...prevHistory].slice(0, historyIndex + 1).concat(pathname);
      });
    } else if (!initialized) {
      setInitialized(true);
    }
    setIsClicked(true);
    if (pathname == "/search") {
      inputRef.current && inputRef.current.focus();
      setBorder("border border-1");
    }
    console.log(inputRef)
  }, [pathname]);

  return (
    <div className="rounded-xl px-6 py-4 flex justify-between w-full ">
      <div className="flex gap-3 items-center justify-center relative">
        <CircularButton
          className={`
                w-[30px] 
                h-[30px] 
                bg-[#090909] 
                flex 
                justify-center 
                items-center
                ${historyIndex != 0 && "cursor-pointer"}`}
        >
          <IoIosArrowBack
            size={30}
            color={historyIndex == 0 ? "#8D8D8D" : "#fff"}
            onClick={() => {
              setIsClicked(false);
              if (historyIndex > 0) {
                setHistoryIndex((prevIndex) => {
                  router.push(history[prevIndex - 1]);
                  return prevIndex - 1;
                });
              }
            }}
          />
        </CircularButton>

        <CircularButton
          className={`
            w-[30px] 
            h-[30px] 
            rounded-full 
            bg-[#090909] 
            flex 
            justify-center 
            items-center
            ${historyIndex != history.length - 1 && "cursor-pointer"}`}
        >
          <IoIosArrowForward
            size={30}
            color={historyIndex == history.length - 1 ? "#8D8D8D" : "#fff"}
            onClick={() => {
              setIsClicked(false);
              if (historyIndex < history.length - 1) {
                setHistoryIndex((prevIndex) => {
                  router.push(history[prevIndex + 1]);
                  return prevIndex + 1;
                });
              }
            }}
          />
        </CircularButton>

        {pathname == "/search" && (
          <div
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            className={`
                  w-[360px] 
                  flex 
                  gap-1
                  items-center 
                  justify-center 
                  bg-[#2b2a2a] 
                  absolute 
                  left-[85px] 
                  py-3 px-3
                  hover:outline
                  hover:outline-gray-500
                  outline-1
                  rounded-full ${border}`}
          >
            <Input
              type="text"
              placeholder="What would you like to listen?"
              state={search}
              setState={setSearch}
              icon={RiSearchLine}
              isHover={isHover}
              ref={inputRef}
              onBlur={() => {
                setBorder("");
              }}
              iconObject={{ size: 22, color: "#B3B3B3", hoverColor: "#fff" }}
              className="bg-transparent px-0 py-0 w-full text-sm rounded-none"
            />
          </div>
        )}
      </div>
      <div className="flex gap-3 items-center justify-center">
        <Button
          className="bg-white text-black text-lg"
          hoverClassName="scale-[1.05]"
          onClick={signOut}
        >
          Logout
        </Button>
        <Link
          href="/profile"
          className="h-full flex items-center justify-center"
        >
          <CircularButton
            className="
                      w-[32px]
                      h-[32px]
                      bg-[#000000]
                      flex 
                      justify-center 
                      items-center
                      "
            hoverClassName="scale-[1.1]"
          >
            <GoPerson size={20} />
          </CircularButton>
        </Link>
      </div>
    </div>
  );
};

export default TopBar;
