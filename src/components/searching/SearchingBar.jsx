import React from "react";
import { Box, InputBase, Typography, useTheme } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchingBar = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        bgcolor: isDark ? "#222" : "#fff",
        borderRadius: "8px",
        px: 2,
        py: 1,
        width: "100%",
        maxWidth: 360,
        gap: 1,
        boxShadow: isDark ? "none" : "0 0 0 1px #ddd inset",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      <SearchIcon sx={{ color: isDark ? "#888" : "#999", fontSize: 20 }} />
      <InputBase
        placeholder="Search"
        sx={{
          color: isDark ? "#ccc" : "#333",
          flex: 1,
          fontSize: 14,
          "::placeholder": {
            color: isDark ? "#888" : "#aaa",
            opacity: 1,
          },
        }}
      />
      <Typography
        sx={{
          color: isDark ? "#888" : "#999",
          fontSize: 12,
          backgroundColor: isDark ? "#333" : "#eee",
          px: 1,
          py: "1px",
          borderRadius: "4px",
        }}
      >
        Ctrl + P
      </Typography>
    </Box>
  );
};

export default SearchingBar;
