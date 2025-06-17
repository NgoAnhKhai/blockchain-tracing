import React, { useState } from "react";
import {
  Box,
  ToggleButtonGroup,
  ToggleButton,
  useTheme,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useLocation } from "react-router-dom";
import SearchingBar from "../components/searching/SearchingBar";
import { useViewMode } from "../context/ViewModeContext";
import { LoginButton, RegisterButton } from "../components/button/ButtonAuth";
import Login from "../components/auth/Login";
import Register from "../components/auth/register";

export default function MainHeader() {
  const theme = useTheme();
  const { pathname } = useLocation();
  const { viewMode, setViewMode } = useViewMode();
  const showToggle = pathname === "/wallet-graph";

  // mode: null | "login" | "register"
  const [mode, setMode] = useState(null);

  return (
    <>
      {/* === HEADER BAR === */}
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
        <Box sx={{ display: "flex", gap: 2 }}>
          <LoginButton onClick={() => setMode("login")}>Login</LoginButton>
          <RegisterButton onClick={() => setMode("register")}>
            Register
          </RegisterButton>
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

          {/* Chỉ cần render component bạn có sẵn */}
          {mode === "login" && <Login />}
          {mode === "register" && <Register />}
        </Box>
      )}
    </>
  );
}
