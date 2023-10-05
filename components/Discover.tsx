import React, { useContext } from "react";
import { Button } from "@/components";
import { MusicContext } from "@/context/MusicContext";

interface DiscoverProps {
  play: () => void;
}

const Discover: React.FC<DiscoverProps> = ({ play }) => {
  const { state: music } = useContext(MusicContext);

  const dayOfWeek = new Date().getDay();
  const week = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return (
    <div className="w-full flex  justify-center">
      <div
        style={{
          backgroundImage: "linear-gradient(to top right, #000000,#1e1c1c 78%)",
        }}
        className="w-[75%] p-5 rounded-lg flex gap-5 items-center"
      >
        <img
          src="https://hips.hearstapps.com/hmg-prod/images/30th-anniversary-of-apollo-11-landing-on-the-moon-astronaut-news-photo-51098545-1547940625.jpg"
          alt=""
          className="w-[150px] aspect-square object-cover"
        />
        <div className="flex flex-col gap-1">
          <p className="font-bold text-[13px]">PLAYLIST</p>
          <h2 className="text-[35px] font-bold">DISCOVER TODAY</h2>
          <p className="font-medium">
            Top hits for today, go and listen to some bangers for{" "}
            <span className="font-bold">{week[dayOfWeek]} !</span>
          </p>
          <Button className="w-fit px-6 mt-1 bg-primary" onClick={play}>
            {music.playlistId == "discover" && music.isPlaying
              ? "Pause"
              : "Play"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Discover;
