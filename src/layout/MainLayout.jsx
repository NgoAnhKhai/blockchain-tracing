import { Box } from "@mui/material";
import React from "react";
import MainHeader from "./MainHeader";
import MainFooter from "./MainFooter";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <Box>
      <MainHeader />
      <Outlet />
      <MainFooter />
    </Box>
  );
};

export default MainLayout;
