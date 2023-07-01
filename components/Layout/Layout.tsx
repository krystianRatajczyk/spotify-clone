import React, { ReactNode } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="p-2 flex h-screen">
      <Sidebar />
      <div className="w-full h-full flex flex-col rounded-xl ml-2 overflow-hidden relative">
        <TopBar />
        {children}
      </div>
    </div>
  );
};

export default Layout;
