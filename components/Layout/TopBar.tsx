import React, { useEffect, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { GoPerson } from "react-icons/go";

import Button from "./Button";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";

const TopBar = () => {
  const router = useRouter();

  const pathname = usePathname();
  const [history, setHistory] = useState<string[]>([pathname]);
  const [initialized, setInitialized] = useState<boolean>(false);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [isClicked, setIsClicked] = useState<boolean>(true);

  useEffect(() => {
    if (initialized && isClicked) {
      setHistoryIndex((prevIndex) => prevIndex + 1);
      setHistory((prevHistory) => {
        return [...prevHistory].slice(0,historyIndex + 1).concat(pathname);
      });
    } else if (!initialized) {
      setInitialized(true);
    }
    setIsClicked(true);
  }, [pathname]);

  return (
    <div className="rounded-xl px-6 py-4 flex justify-between w-full">
      <div className="flex gap-3">
        <div
          className="
                w-[30px] 
                h-[30px] 
                rounded-full 
                bg-[#090909] 
                flex 
                justify-center 
                items-center"
        >
          <IoIosArrowBack
            size={25}
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
        </div>

        <div
          className="
            w-[30px] 
            h-[30px] 
            rounded-full 
            bg-[#090909] 
            flex 
            justify-center 
            items-center"
        >
          <IoIosArrowForward
            size={25}
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
        </div>
      </div>
      <div className="flex gap-3 items-center justify-center">
        <Button className="bg-white text-black" onClick={signOut}>
          Logout
        </Button>
        <Link href="/profile">
          <div
            className="h-full 
                      bg-[#000000]
                      w-full 
                      aspect-[1/1] 
                      rounded-full 
                      flex 
                      justify-center 
                      items-center
                      "
          >
            <GoPerson />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default TopBar;
