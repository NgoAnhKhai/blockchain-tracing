import React from "react";
import {
  Box,
  Select,
  MenuItem,
  FormControl,
  InputBase,
  useTheme,
} from "@mui/material";
import WalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// 3 ví nổi tiếng với màu nhận diện
const famousWallets = [
  {
    label: "Vitalik Buterin",
    address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
    color: "#9C27B0",
  },

  {
    label: "Coinbase",
    address: "0x503828976D22510aad0201ac7EC88293211D23Da",
    color: "#2979FF",
  },
];

export default function WalletSelector({ selected, onSelect }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 15,
        px: 2,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[1],
        minWidth: 180,
        height: 50,
      }}
    >
      {/* Icon vali */}
      <WalletIcon
        fontSize="small"
        sx={{ color: theme.palette.text.primary, mr: 1 }}
      />

      <FormControl variant="standard" sx={{ flex: 1 }}>
        <Select
          value={selected?.address || ""}
          onChange={(e) => {
            const w = famousWallets.find((w) => w.address === e.target.value);
            onSelect(w);
          }}
          displayEmpty
          input={<InputBase />}
          IconComponent={ExpandMoreIcon}
          sx={{
            // remove default underline and padding
            ".MuiSelect-select": {
              padding: 0,
              display: "flex",
              alignItems: "center",
              gap: 1,
            },
            ".MuiSelect-icon": {
              color: theme.palette.text.primary,
            },
            fontSize: 14,
            color: theme.palette.text.primary,
          }}
        >
          {famousWallets.map((w) => (
            <MenuItem
              key={w.address}
              value={w.address}
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              {/* chấm tròn màu */}
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: w.color,
                }}
              />
              <Box component="span">{w.label}</Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
