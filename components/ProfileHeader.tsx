import React from "react";
import Picture from "./Picture";
import { GoPerson } from "react-icons/go";
import { getUpGradient } from "@/constants/styles";

interface ProfileHeaderProps {
  id: string;
  name: string;
  image: string;
  followers: { id: string; name: string; image: true }[];
  following: { id: string; name: string; image: true }[];
  dominantColor: string | undefined;
  darkerAmount: number;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  image,
  name,
  dominantColor,
  followers,
  following,
}) => {
  return (
    <div
      style={getUpGradient(dominantColor)}
      className={`p-5 pt-[100px] flex gap-5 items-center`}
    >
      <Picture
        className="
        min-w-[230px] h-[230px]
        max-w-[230px]"
      >
        {!image ? (
          <GoPerson size={60} color="B3B3B3" />
        ) : (
          <img src={image} className="object-cover w-full h-full" />
        )}
      </Picture>
      <div className="flex flex-col overflow-hidden">
        <h4 className="font-bold">Profile</h4>
        <h2 className="text-bold text-white text-[100px] font-bold ">{name}</h2>
        <p className="font-semibold">
          {followers.length} followers <span>•</span> {following.length} following
        </p>
      </div>
    </div>
  );
};

export default ProfileHeader;
