import { Box, useTheme } from "@mui/material";
import React from "react";
import { Outlet } from "react-router-dom";
import MainSideBar from "./MainSideBar";
import MainHeader from "./MainHeader";

const SIDEBAR_WIDTH = 240;

const MainLayout = () => {
  const theme = useTheme();

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Sidebar bên trái */}
      <Box
        sx={{
          width: SIDEBAR_WIDTH,
          bgcolor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          flexShrink: 0,
        }}
      >
        <MainSideBar />
      </Box>

      {/* Nội dung bên phải */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <MainHeader />

        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            padding: 2,
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
            transition: "background-color 0.4s ease",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
