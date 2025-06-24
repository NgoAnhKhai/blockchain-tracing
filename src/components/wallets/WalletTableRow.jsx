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
        {row.balance}
      </TableCell>
      <TableCell
        sx={{
          fontWeight: "bold",
          color: row.rank <= 3 ? "#ff4d88" : "#fff",
          fontSize: 16,
        }}
      >
        <RankCup rank={row.rank} />
        {row.rank}
      </TableCell>
      <TableCell>
        <Box
          component="span"
          sx={{
            bgcolor: "#2e1440",
            color: "#00ffe7",
            px: 1.5,
            py: 0.5,
            borderRadius: 2,
            fontWeight: 700,
            fontSize: 13,
            display: "inline-block",
          }}
        >
          {row.percentage}
        </Box>
      </TableCell>
      <TableCell align="right">
        <FollowButton
          isFollowed={row.is_followed}
          walletAddress={row.address}
          onStatusChange={onToggleFollow}
        />
      </TableCell>
    </TableRow>
  );
}
