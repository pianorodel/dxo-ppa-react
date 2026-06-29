import { useEffect, useState } from "react";

import { PhotoViewer } from "./PhotoViewer";

export const AvatarIcon = ({
  initials = "",
  name = "",
  avatarImg = null,
  color = null,
  height = "42px",
  width = "42px",
  fontSize = "13px",
  marginRight = "me-3",
}) => {
  const [bgColor, setBgColor] = useState("success");

  const computedInitials = (() => {
    if (initials) return initials;
    else {
      const words = name?.trim().split(/\s+/) || [];
      if (words.length === 0) return "";
      if (words.length === 1) {
        const firstWord = words[0];
        return firstWord.length >= 2 ? firstWord.slice(0, 2).toUpperCase() : firstWord.slice(0, 1).toUpperCase();
      }
      return `${words[0][0]?.toUpperCase() || ""}${words.at(-1)?.[0]?.toUpperCase() || ""}`;
    }
  })();

  const colorOptions = ["info", "primary", "secondary", "warning", "success", "danger"];

  const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colorOptions.length);
    return colorOptions[randomIndex];
  };

  useEffect(() => {
    setBgColor(color ? color : getRandomColor());
  }, [color]);

  const avatarImage = process.env.REACT_APP_S3 + avatarImg;

  return (
    <div
      className={`flex-shrink-0 ${marginRight}`}
      onClick={(e) => {
        e.stopPropagation();
      }}>
      {!!avatarImg ? (
        <PhotoViewer>
          <img src={avatarImage} alt="" className="rounded-circle object-fit-cover" style={{ width: width, height: height, cursor: "pointer" }} />
        </PhotoViewer>
      ) : (
        <div
          className={`avatar-title text-uppercase rounded-circle bg-${bgColor} text-white`}
          style={{ width: width, height: height, fontSize: fontSize }}>
          {initials ? initials : computedInitials}
        </div>
      )}
    </div>
  );
};
