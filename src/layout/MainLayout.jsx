import { Box, useTheme } from "@mui/material";
import React from "react";
import { Outlet } from "react-router-dom";
import MainSideBar from "./MainSideBar";

const SIDEBAR_WIDTH = 240;

const MainLayout = () => {
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: SIDEBAR_WIDTH,
          bgcolor: theme.palette.background.paper,
          color: theme.palette.text.primary,
        }}
      >
        <MainSideBar />
      </Box>

      {/* Nội dung chính */}
      <Box
        sx={{
          flexGrow: 1,
          padding: 2,
          backgroundColor: theme.palette.background.default, 
          color: theme.palette.text.primary,
          transition: 'background-color 0.4s ease',
          overflowY: 'auto',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;
