import React, { useEffect, useRef } from "react";
import { Box, InputBase, Typography, useTheme } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchingBar = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const inputRef = useRef(null);
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+P (Windows/Linux) hoặc ⌘+P (macOS)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "p") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        bgcolor: isDark ? "#2d2d2d" : "#fff",
        borderRadius: "8px",
        width: "100%",
        maxWidth: 360,
        px: 2,
        py: 1,
        gap: 1,
        border: isDark ? "1px solid #3c3f41" : "1px solid #ddd",

        transition:
          "background-color 0.3s ease, color 0.3s ease, border-color 0.2s ease",

        "&:focus-within": {
          borderColor: isDark ? "#007ACC" : theme.palette.primary.main,
          boxShadow: isDark
            ? "0 0 0 1px rgba(0,122,204,0.5)"
            : `0 0 0 1px ${theme.palette.primary.main}33`,
        },
      }}
    >
      <SearchIcon
        sx={{
          color: isDark ? "#888" : "#999",
          fontSize: 20,
        }}
      />
      <InputBase
        inputRef={inputRef}
        placeholder="Search"
        sx={{
          color: isDark ? "#DDD" : "#333",
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
