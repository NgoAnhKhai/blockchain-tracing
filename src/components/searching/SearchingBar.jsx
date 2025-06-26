import React, { useEffect, useRef, useState } from "react";
import { Box, InputBase, Typography, useTheme } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useAddressSearch } from "../../context/AddressSearchContext";

const SearchingBar = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const inputRef = useRef(null);
  const { address, setAddress } = useAddressSearch();

  // State cho input local, sync theo address khi address thay đổi từ ngoài
  const [inputValue, setInputValue] = useState(address || "");

  // Cập nhật input khi address context thay đổi (khi search xong hoặc từ ngoài set)
  useEffect(() => {
    setInputValue(address || "");
  }, [address]);

  // Chỉ update inputValue, không update address global
  const handleInputChange = (e) => setInputValue(e.target.value);

  // Khi nhấn Enter, mới setAddress (tức là mới thực sự search)
  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      setAddress(inputValue.trim());
      // Có thể clear inputValue nếu muốn
      // setInputValue("");
      console.log("Address searched:", inputValue.trim());
    }
  };

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
        bgcolor: isDark ? "#1F232C" : "#fff",
        borderRadius: "8px",
        width: "100%",
        maxWidth: 360,
        px: 2,
        py: 1,
        gap: 1,
        border: isDark ? "1px solid #3C3F46" : "1px solid #ddd",
        transition:
          "background-color 0.3s ease, color 0.3s ease, border-color 0.2s ease",
        "&:focus-within": {
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
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
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
