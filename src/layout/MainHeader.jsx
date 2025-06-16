import React from "react";
import { Box, ToggleButtonGroup, ToggleButton, useTheme } from "@mui/material";
import { useLocation } from "react-router-dom";
import SearchingBar from "../components/searching/SearchingBar";
import LoginButton from "../components/button/LoginButton";
import { useViewMode } from "../context/ViewModeContext";

const MainHeader = () => {
  const theme = useTheme();
  const { pathname } = useLocation();
  const { viewMode, setViewMode } = useViewMode();

  const showToggle = pathname === "/wallet-graph";

  return (
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
      {/* Left Section: SearchingBar + Toggle */}
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
            onChange={(e, val) => val && setViewMode(val)}
          >
            <ToggleButton value="2d">2D</ToggleButton>
            <ToggleButton value="3d">3D</ToggleButton>
          </ToggleButtonGroup>
        )}
      </Box>

      {/* Right Section: Login */}
      <Box>
        <LoginButton />
      </Box>
    </Box>
  );
};

export default MainHeader;
