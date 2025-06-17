import React, { useContext } from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  Box,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home as HomeIcon,
  AccountBalanceWallet as WalletIcon,
  Assessment as GraphIcon,
  ListAlt as TransactionsIcon,
  Settings as SettingsIcon,
  WarningAmber as AlertIcon,
} from "@mui/icons-material";

import ToggleMode from "../components/button/ToggleMode";
import { ThemeContext } from "../context/theme";

const menuItems = [
  { text: "Dashboard", icon: <HomeIcon />, path: "/" },
  { text: "Trace Wallet", icon: <WalletIcon />, path: "/trace-wallets" },
  { text: "Wallet Graph", icon: <GraphIcon />, path: "/wallet-graph" },
  { text: "Transactions", icon: <TransactionsIcon />, path: "/transactions" },
  { text: "Alerts", icon: <AlertIcon />, path: "/alerts" },
  { text: "Settings", icon: <SettingsIcon />, path: "/settings" },
];

const MainSideBar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { isDark, toggleTheme } = useContext(ThemeContext);

  const activeColor = "#ff4d88";

  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: theme.palette.background.paper,
        color: theme.palette.text.secondary,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          textAlign: "center",
          fontSize: 20,
          fontWeight: "bold",
          borderBottom: `1px solid ${theme.palette.divider}`,
          color: theme.palette.text.primary,
        }}
      >
        BlockTrace
      </Box>

      {/* Menu */}
      <List>
        {menuItems.map(({ text, icon, path }) => {
          const isActive = pathname === path;
          return (
            <ListItem
              key={text}
              onClick={() => navigate(path)}
              sx={{
                mb: 1,
                mx: 1,
                borderRadius: 15,
                width: 200,
                cursor: "pointer",
                transition: "background-color 0.3s ease",
                bgcolor: isActive
                  ? theme.palette.action.selected
                  : "transparent",
                "&:hover": {
                  bgcolor: theme.palette.action.hover,
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: isActive ? activeColor : theme.palette.text.secondary,
                }}
              >
                {icon}
              </ListItemIcon>
              <ListItemText
                primary={text}
                primaryTypographyProps={{
                  fontWeight: isActive ? 600 : 500,
                  fontSize: 14,
                  color: theme.palette.text.primary,
                }}
              />
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ bgcolor: theme.palette.divider, mt: "auto" }} />

      {/* Footer: Toggle Dark/Light */}
      <Box
        sx={{
          px: 2,
          py: 2,
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <ToggleMode isDark={isDark} toggleTheme={toggleTheme} />
      </Box>
    </Box>
  );
};

export default MainSideBar;
