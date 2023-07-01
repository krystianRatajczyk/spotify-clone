import React from "react";
import Button from "./Button";

const Library: React.FC = () => {
  return (
    <div className="bg-[#2b2a2a] rounded-lg py-3 px-4 flex flex-col ">
      <h2 className="font-bold text-lg">Create your first playlist</h2>
      <p className="mt-2">It's simple, we will help you</p>
      <Button
        className="bg-white text-black mt-5 text-[16px] w-[fit-content] hover:scale-[1.04]"
      >
        Create playlist
      </Button>
    </div>
  );
};

export default Library;
