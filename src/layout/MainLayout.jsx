import { Box } from "@mui/material";
import React from "react";
import { Outlet } from "react-router-dom";
import MainSideBar from "./MainSideBar";

const MainLayout = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      {/* Main SideBar with fixed position on the left */}
      <Box
        sx={{

          position: 'fixed', 
          top: 0,
          left: 0,
          bottom: 0,
          bgcolor: '#222',
          color: 'white', 
        }}
      >
        <MainSideBar />
      </Box>

      {/* Main Content (next to sidebar) */}
      <Box
        sx={{

          flexGrow: 1,
          padding: 2,
          backgroundColor: '#121212',
        }}
      >
        <Outlet /> 
      </Box>
    </Box>
  );
};

export default MainLayout;
