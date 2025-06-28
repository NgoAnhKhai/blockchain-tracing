import React, { useContext, useState } from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home as HomeIcon,
  AccountBalanceWallet as WalletIcon,
  Assessment as GraphIcon,
  WarningAmber as AlertIcon,
} from "@mui/icons-material";

import ToggleMode from "../components/button/ToggleMode";
import { ThemeContext } from "../context/theme";
import { useAuth } from "../context/AuthContext";

const LOGO_SRC = "/block_trace.png";

const menuItems = [
  { text: "Dashboard", icon: <HomeIcon />, path: "/" },
  { text: "Trace Wallet", icon: <WalletIcon />, path: "/trace-wallets" },
  { text: "Wallet Graph", icon: <GraphIcon />, path: "/wallet-graph" },
  { text: "Alerts", icon: <AlertIcon />, path: "/alerts" },
];

const MainSideBar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const { isAuthenticated } = useAuth();

  // State điều khiển snackbar
  const [showLoginSnack, setShowLoginSnack] = useState(false);

  const activeBg = isDark
    ? "linear-gradient(90deg, #342e51 0%, #7051f3 120%)"
    : "linear-gradient(90deg, #ebe9f6 0%, #f8f7fd 120%)";
  const activeColor = isDark ? "#ff4d88" : "#7051f3";
  const hoverBg = isDark ? "#221d37" : "#f0eef9";
  const borderActive = isDark ? "#a076ff77" : "#c4a9fc88";

  const handleMenuClick = (path) => {
    if (path === "/") {
      navigate(path);
      return;
    }
    if (!isAuthenticated()) {
      setShowLoginSnack(true);
      return;
    }
    navigate(path);
  };

  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: theme.palette.background.default,
        color: theme.palette.text.secondary,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        borderRight: isDark ? "1.5px solid #2f2942" : "1.5px solid #e6e2f4",
        boxShadow: isDark ? "4px 0 16px #a076ff18" : "4px 0 16px #ded5ff11",
      }}
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          userSelect: "none",
          cursor: "pointer",
          borderBottom: `1px solid ${theme.palette.divider}`,
          pb: 1.5,
          transition: "background 0.16s, box-shadow 0.18s",
          "&:hover": {
            background: isDark ? "#231841" : "#ece8f7",
          },
        }}
        onClick={() => navigate("/")}
      >
        <img
          src={LOGO_SRC}
          alt="BlockTrace Logo"
          style={{
            objectFit: "contain",
            borderRadius: 8,
            width: "100%",
            transform: "scale(1.17)",
            boxShadow: isDark ? "0 0 18px #a076ff66" : "0 0 18px #c3a3ff33",
            transition: "box-shadow 0.2s",
            background: isDark
              ? "linear-gradient(120deg, #23203c 60%, #353060 100%)"
              : "linear-gradient(120deg, #f8f5fd 60%, #ede8ff 100%)",
            padding: 4,
          }}
        />
      </Box>

      {/* Menu */}
      <List>
        {menuItems.map(({ text, icon, path }) => {
          const isActive = pathname === path;
          return (
            <ListItem
              key={text}
              onClick={() => handleMenuClick(path)}
              sx={{
                mb: 0.5,
                mx: 1,
                borderRadius: 12,
                width: "92%",
                alignSelf: "center",
                cursor: "pointer",
                background: isActive ? activeBg : "none",
                color: isActive ? activeColor : theme.palette.text.secondary,
                border: isActive
                  ? `1.5px solid ${borderActive}`
                  : "1.5px solid transparent",
                boxShadow: isActive
                  ? "0 2px 10px #a076ff22"
                  : "0 1px 2px #00000009",
                transition:
                  "background 0.18s, color 0.18s, box-shadow 0.18s, border 0.18s, transform 0.16s",
                "&:hover": {
                  background: hoverBg,
                  color: activeColor,
                  transform: "scale(1.025)",
                },
                "&:active": {
                  background: "#ffedf5",
                  color: "#ff4d88",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 36,
                  color: isActive ? activeColor : theme.palette.text.secondary,
                  fontSize: 25,
                  transition: "color 0.16s",
                  "& svg": {
                    fontSize: 24,
                  },
                }}
              >
                {icon}
              </ListItemIcon>
              <ListItemText
                primary={text}
                primaryTypographyProps={{
                  fontWeight: isActive ? 700 : 500,
                  fontSize: 15,
                  color: isActive ? activeColor : theme.palette.text.primary,
                  letterSpacing: 0.3,
                }}
              />
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ bgcolor: theme.palette.divider, mt: "auto" }} />

      <Box
        sx={{
          px: 2,
          py: 2,
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <ToggleMode isDark={isDark} toggleTheme={toggleTheme} />
      </Box>

      <Snackbar
        open={showLoginSnack}
        autoHideDuration={4000}
        onClose={() => setShowLoginSnack(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setShowLoginSnack(false)}
          severity="warning"
          variant="filled"
          sx={{
            fontWeight: 600,
            fontSize: 16,
            letterSpacing: 0.3,
            bgcolor: isDark ? "#22123d" : "#ffe7e3",
            color: isDark ? "#ff6d90" : "#b83241",
            border: isDark ? "2px solid #b69af7" : "2px solid #d399af",
            boxShadow: "0 2px 16px #a076ff33",
          }}
        >
          You need to login to view this page.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MainSideBar;
