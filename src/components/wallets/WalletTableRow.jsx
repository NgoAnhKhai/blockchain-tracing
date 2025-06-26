import React from "react";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import WalletIcon from "@mui/icons-material/AccountBalanceWallet";
import Box from "@mui/material/Box";
import FollowButton from "./FollowButton";
import RankCup from "../common/RankCup";

export default function WalletTableRow({
  row,
  followed,
  onToggleFollow,
  onRowClick,
  formatAddress,
}) {
  function formatBalance(balance) {
    const num = Number(balance);
    if (isNaN(num)) return balance;
    if (num >= 1e12) return (num / 1e12).toFixed(2) + "T";
    if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
    if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(2) + "K";
    return num.toLocaleString("en-US", { maximumFractionDigits: 2 });
  }

  return (
    <TableRow
      key={row.address}
      onClick={() => onRowClick(row.address)}
      sx={{
        cursor: "pointer",
        transition: "all 0.13s",
        "&:hover": {
          background: "linear-gradient(90deg, #40156b 0%, #0a0023 100%)",
          boxShadow: "0 2px 16px 0 #bb86fc50",
          transform: "scale(1.018)",
        },
      }}
    >
      <TableCell sx={{ fontWeight: "bold", fontSize: 15 }}>
        <WalletIcon
          sx={{
            color: "#bb86fc",
            fontSize: 20,
            mr: 1,
            verticalAlign: "middle",
          }}
        />
        {formatAddress(row.address)}
      </TableCell>
      <TableCell sx={{ fontWeight: 700, color: "#fff" }}>
        {row.name_tag || "--"}
      </TableCell>
      <TableCell sx={{ color: "#ff4d88", fontWeight: 700, fontSize: 16 }}>
        {formatBalance(row.balance)}
      </TableCell>

      <TableCell align="right">
        <FollowButton
          isFollowed={row.is_followed}
          walletAddress={row.address}
          walletId={row.id}
          onStatusChange={onToggleFollow}
        />
      </TableCell>
    </TableRow>
  );
}
