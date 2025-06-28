import React from "react";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { SubscribeWallet } from "../../services/follow/SubscribeWallet";
import { UnsubscribeWallet } from "../../services/follow/UnsubscribeWallet";

export default function FollowButton({
  isFollowed,
  walletAddress,
  walletId,
  onStatusChange,
}) {
  const handleToggle = async (e) => {
    e.stopPropagation();
    try {
      onStatusChange(walletId, walletAddress, isFollowed);
    } catch (err) {
      console.error("Follow/unfollow failed", err);
    }
  };

  return (
    <IconButton onClick={handleToggle} size="small">
      {isFollowed ? (
        <FavoriteIcon sx={{ color: "#ff4d88" }} />
      ) : (
        <FavoriteBorderIcon sx={{ color: "#ff4d88" }} />
      )}
    </IconButton>
  );
}
