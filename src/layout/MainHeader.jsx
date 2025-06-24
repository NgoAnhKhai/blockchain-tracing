import React, { useState } from "react";
import {
  Box,
  ToggleButtonGroup,
  ToggleButton,
  useTheme,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useLocation, useNavigate } from "react-router-dom";
import SearchingBar from "../components/searching/SearchingBar";
import { useViewMode } from "../context/ViewModeContext";
import { LoginButton, RegisterButton } from "../components/button/ButtonAuth";
import Login from "../components/auth/Login";
import Register from "../components/auth/register";
import { useAuth } from "../context/AuthContext";

export default function MainHeader() {
  const theme = useTheme();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { viewMode, setViewMode } = useViewMode();
  const showToggle = pathname === "/wallet-graph";
  const { user, signout } = useAuth();

  const [mode, setMode] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const handleAvatarClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleProfileClick = () => {
    handleMenuClose();
    navigate("/user/profile");
  };

  return (
    <>
      <Box
        sx={{
          width: "100%",
          px: 3,
          py: 2,
          bgcolor: theme.palette.background.paper,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
          zIndex: 1000,
        }}
      >
        {/* Left */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flex: 1,
            minWidth: 300,
            gap: 2,
          }}
        >
          <Box sx={{ flex: 1, maxWidth: 500 }}>
            <SearchingBar />
          </Box>
          {showToggle && (
            <ToggleButtonGroup
              size="small"
              value={viewMode}
              exclusive
              onChange={(e, v) => v && setViewMode(v)}
            >
              <ToggleButton value="2d">2D</ToggleButton>
              <ToggleButton value="3d">3D</ToggleButton>
            </ToggleButtonGroup>
          )}
        </Box>

        {/* Right */}
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          {!user ? (
            <>
              <LoginButton onClick={() => setMode("login")}>Login</LoginButton>
              <RegisterButton onClick={() => setMode("register")}>
                Register
              </RegisterButton>
            </>
          ) : (
            <>
              <IconButton onClick={handleAvatarClick}>
                <Avatar sx={{ bgcolor: "#da00ff", color: "#fff" }}>
                  {user.username?.[0]?.toUpperCase() ||
                    user.email?.[0]?.toUpperCase() ||
                    "U"}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={openMenu}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: {
                    minWidth: 180,
                    bgcolor: theme.palette.background.paper,
                  },
                }}
              >
                <Box sx={{ px: 2, py: 1 }}>
                  <Typography fontWeight="bold">
                    {user.username || user.email}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user.email}
                  </Typography>
                </Box>
                <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
                <MenuItem
                  onClick={() => {
                    signout();
                    handleMenuClose();
                  }}
                >
                  Đăng xuất
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Box>

      {/* === OVERLAY FORM === */}
      {mode && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            bgcolor: "rgba(0,0,0,0.75)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
          }}
        >
          <Box sx={{ position: "absolute", top: 16, right: 16 }}>
            <IconButton onClick={() => setMode(null)} sx={{ color: "#fff" }}>
              <CloseIcon />
            </IconButton>
          </Box>
          {mode === "login" && (
            <Login
              onSwitchToRegister={() => setMode("register")}
              onLoginSuccess={() => setMode(null)}
            />
          )}
          {mode === "register" && (
            <Register
              onRegisterSuccess={() => setMode("login")}
              onSwitchToLogin={() => setMode("login")}
            />
          )}
        </Box>
      )}
    </>
  );
}
