import React, { useEffect, useRef } from "react";
import { Box, InputBase, Typography, useTheme } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchingBar = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "p") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        // 1) Chuyển nền gần tông với panel
        bgcolor: isDark ? "#1F232C" : "#fff",
        borderRadius: "8px",
        width: "100%",
        maxWidth: 360,
        px: 2,
        py: 1,
        gap: 1,
        // 2) Viền xám đen hơn
        border: isDark ? "1px solid #3C3F46" : "1px solid #ddd",

        transition:
          "background-color 0.3s ease, color 0.3s ease, border-color 0.2s ease",

        "&:focus-within": {
          // 3) Highlight nhẹ khi focus
          borderColor: isDark ? "#00FFE7" : theme.palette.primary.main,
          boxShadow: isDark
            ? "0 0 0 2px rgba(0,255,231,0.3)"
            : `0 0 0 2px ${theme.palette.primary.main}33`,
        },
      }}
    >
      <SearchIcon
        sx={{
          color: isDark ? "#6C6C6C" : "#999",
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
            color: isDark ? "#777" : "#aaa",
            opacity: 1,
          },
        }}
      />
      <Typography
        sx={{
          color: isDark ? "#777" : "#999",
          fontSize: 12,
          backgroundColor: isDark ? "#252A35" : "#eee",
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
