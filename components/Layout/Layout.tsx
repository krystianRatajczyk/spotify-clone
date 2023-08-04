import React, { ReactNode, useContext } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { InfoContext } from "@/context/InfoContext";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { dispatch } = useContext(InfoContext);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const element = event.currentTarget;
    const scrolled = element.scrollTop;
    dispatch({ type: "CHANGE_SCROLL_TOP", payload: scrolled });
  };

  return (
    <div className="p-2 flex h-screen">
      <Sidebar />
      <div className="w-full h-full flex flex-col rounded-xl ml-2 overflow-hidden relative">
        <TopBar />
        <div
          className="overflow-y-scroll no-scrollbar w-full h-full"
          onScroll={(e) => handleScroll(e)}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
