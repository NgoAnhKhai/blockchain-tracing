import React, { useRef, useState } from "react";
import {
  Box,
  InputBase,
  Typography,
  useTheme,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useAddressSearch } from "../../context/AddressSearchContext";
import { useLocation, useNavigate } from "react-router-dom";

const WalletGraphSearchBar = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const inputRef = useRef(null);
  const { setAddress } = useAddressSearch();
  const navigate = useNavigate();
  const location = useLocation();
  const [inputValue, setInputValue] = useState("");

  const doSearch = () => {
    const value = inputValue.trim();
    if (!value) return;
    setAddress(value);
    if (location.pathname !== "/wallet-graph") {
      navigate("/wallet-graph");
    }
    setInputValue("");
  };

  const handleInputChange = (e) => setInputValue(e.target.value);
  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") doSearch();
  };

  React.useEffect(() => {
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
        bgcolor: isDark
          ? "linear-gradient(90deg, #251847 70%, #391773 100%)"
          : "#fff",
        borderRadius: "14px",
        width: "100%",
        maxWidth: 500,
        minHeight: 50,
        px: 2,
        gap: 1,
        border: isDark ? "2px solid #b486ff" : "1.5px solid #bbb",
        boxShadow: isDark
          ? "0 4px 24px 0 rgba(160,118,255,0.10)"
          : "0 1px 2px #eee",
        transition: "background-color 0.3s, border-color 0.2s",
        "&:focus-within": {
          borderColor: "#bb80ff",
          boxShadow: "0 0 0 2px #b486ff55",
        },
      }}
    >
      <IconButton
        onClick={doSearch}
        sx={{
          p: 0.7,
          color: "#b486ff",
          bgcolor: "transparent",
          transition: "color .18s",
          "&:hover": { color: "#fff", bgcolor: "#b486ff" },
        }}
      >
        <SearchIcon sx={{ fontSize: 26 }} />
      </IconButton>
      <InputBase
        inputRef={inputRef}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        placeholder="Search wallet address"
        sx={{
          color: "#fff",
          flex: 1,
          fontSize: 18,
          fontWeight: 500,
          ml: 1,
          "::placeholder": {
            color: "#b199d2",
            opacity: 1,
            fontWeight: 400,
          },
        }}
      />
      <Typography
        sx={{
          color: "#b486ff",
          fontSize: 13,
          background: "#281c48",
          px: 1.5,
          py: "3px",
          borderRadius: "7px",
          ml: 2,
          fontWeight: 500,
          letterSpacing: 1.2,
        }}
      >
        Ctrl + P
      </Typography>
    </Box>
  );
};

export default WalletGraphSearchBar;
