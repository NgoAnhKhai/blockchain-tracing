import React from "react";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

const RankCup = ({ rank }) => {
  if (rank === 1)
    return <EmojiEventsIcon sx={{ color: "#ffbc00", mr: 0.5, fontSize: 22 }} />;
  if (rank === 2)
    return <EmojiEventsIcon sx={{ color: "#bababa", mr: 0.5, fontSize: 20 }} />;
  if (rank === 3)
    return <EmojiEventsIcon sx={{ color: "#a0785a", mr: 0.5, fontSize: 20 }} />;
  return null;
};

export default RankCup;
