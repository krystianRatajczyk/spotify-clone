import {
  Button,
  Header,
  HorizontalSongCard,
  Modal,
  PlayPause,
} from "@/components";
import { UserContext } from "@/context/User/UserContext";
import { timeReducer } from "@/lib/track";
import { Playlist } from "@prisma/client";
import axios from "axios";
import Color from "color-thief-react";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { BsMusicNoteBeamed } from "react-icons/bs";

const PlaylistDetail = () => {
  const [playlist, setPlaylist] = useState<
    Playlist & { tracks: []; user: { name: string } }
  >();
  const [newName, setNewName] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { state: user, dispatch } = useContext(UserContext);

  const router = useRouter();

  useEffect(() => {
    const getPlaylist = async () => {
      const playlist: Playlist & { user: { name: string }; tracks: [] } =
        user.playlists.find((p) => p.id === router.query.playlistId);
      if (!playlist) {
        const res = await axios.post("/api/actions/playlist/getPlaylistById", {
          id: router.query.playlistId,
        });
        setPlaylist(res?.data);
      } else {
        setPlaylist(playlist);
      }
      setNewName(playlist?.name);
    };

    getPlaylist();
  }, [router.query.playlistId, user.playlists]);

  const getTime = (): string => {
    console.log(playlist?.tracks);
    const time = timeReducer(playlist?.tracks!);

    if (time.hours) {
      return time.hours + " hr " + time.minutes + "min";
    }
    return time.minutes + " min";
  };

  const openModal = () => {
    if (user.id === playlist?.userId) {
      setIsModalOpen(true); // update only playlists that belong to you
    }
  };

  const closeModal = () => {
    // when closing modal manually means no api call was made
    setIsModalOpen(false);
    setNewName(playlist?.name!);
  };

  const updatePlaylistName = async () => {
    if (newName !== playlist?.name && newName !== "") {
      closeModal();
      dispatch({
        type: "CHANGE_PLAYLIST_NAME",
        payload: { id: playlist?.id!, newName },
      });
      const res = await axios.post("/api/actions/playlist/changeName", {
        newName,
        id: playlist?.id,
      });
    }
  };

  return (
    <Color src={playlist?.image || ""} crossOrigin="anonymous" format="hex">
      {({ data: dominantColor }) => {
        return (
          <div className="min-h-full bg-[#1b1b1b] flex flex-col">
            <Modal
              isOpen={isModalOpen}
              onClose={closeModal}
              title="Edit details"
            >
              <div className="flex gap-4 h-full mt-2">
                <div
                  className={`w-[177px]
            bg-[#282828]
            flex items-center justify-center shadow-[rgba(0,_0,_0,_0.4)_0px_30px_90px]`}
                >
                  <BsMusicNoteBeamed size={50} color="#b3b3b3" />
                </div>
                <div className="flex flex-col gap-4 h-full">
                  <input
                    placeholder="Name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    type="text "
                    className="placeholder:text-[15px] rounded-md outline-none bg-[#3e3e3e]
                    h-full shadow-[rgba(0,_0,_0,_0.4)_0px_30px_90px] px-2 py-1"
                  />
                  <textarea
                    cols={30}
                    rows={5}
                    placeholder="Add an optional description"
                    className="placeholder:text-[15px] rounded-md mt-1 outline-none bg-[#3e3e3e]  px-2 py-1
                  shadow-[rgba(0,_0,_0,_0.4)_0px_30px_90px]"
                  ></textarea>
                </div>
              </div>
              <div className="w-full flex justify-end">
                <Button className="mt-2" onClick={updatePlaylistName}>
                  Save
                </Button>
              </div>
            </Modal>
            <div
              className={`h-fit bg-gradient-to-b
    from-[#545454] via-[#333333] to-[#1b1b1b] pt-[70px] pb-[350px] p-5`}
            >
              <div className="flex gap-5 items-end">
                <div
                  className="w-[230px] h-[230px]
            bg-[#282828]
            flex items-center justify-center shadow-[rgba(0,_0,_0,_0.4)_0px_30px_90px]"
                >
                  <BsMusicNoteBeamed size={100} color="#b3b3b3" />
                </div>
                <div>
                  <h4 className="font-semibold">
                    {playlist?.isPublic ? "Public" : "Private"} Playlist
                  </h4>
                  <h2 className="text-[90px] font-bold" onClick={openModal}>
                    {playlist?.name}
                  </h2>
                  <p className="font-semibold">
                    <span className="font-bold">{playlist?.user.name}</span>
                    <span> • </span> {playlist?.tracks.length} songs
                  </p>
                </div>
              </div>
            </div>
            <div
              className="w-full min-h-full flex-1 -mt-[325px] bg-[rgba(0,0,0,0.3)] p-5
         "
            >
              {playlist?.tracks.length > 0 && (
                <div className="h-full">
                  <div className="pl-3">
                    <PlayPause
                      isPlaying
                      className="w-[65px] h-[65px]"
                      iconSize={35}
                      animation={false}
                    />
                  </div>
                  <div className="mt-3">
                    <Header withDate />
                  </div>
                  <div className="h-full">
                    {playlist?.tracks?.map((track, index) => (
                      <HorizontalSongCard
                        key={index}
                        {...track}
                        //@ts-ignore
                        artists={track.artists}
                        withNo
                        withDate
                        index={index + 1}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      }}
    </Color>
  );
};

export default PlaylistDetail;
