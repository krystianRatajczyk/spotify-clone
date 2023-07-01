import React from "react";

interface PictureProps {
  url: string;
}

const Picture: React.FC<PictureProps> = ({ url }) => {
  return <div>Picture</div>;
};

export default Picture;
