import { useRouter } from "next/router";
import React from "react";

const PlaylistDetail = () => {
  const router = useRouter();

  return <div>{router.query.playlistId}</div>;
};

export default PlaylistDetail;
