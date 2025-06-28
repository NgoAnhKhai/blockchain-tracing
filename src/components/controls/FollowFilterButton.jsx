import React from "react";
import { Box, Button, useTheme } from "@mui/material";
import { motion } from "framer-motion";

const filterOptions = ["all", "followed"];

const FollowFilterSwitcher = ({ filter, setFilter }) => {
  const theme = useTheme();

  const GRADIENT = "linear-gradient(90deg, #bb86fc 0%, #ff4d88 100%)";
  const inactiveText = theme.palette.mode === "dark" ? "#bb86fc" : "#a024a8";
  const inactiveBg =
    theme.palette.mode === "dark"
      ? "rgba(190,170,255,0.14)"
      : "rgba(190,170,255,0.13)";

  return (
    <Box
      sx={{
        display: "inline-flex",
        borderRadius: "999px",
        bgcolor: inactiveBg,
        p: "3px",
        position: "relative",
        width: 300,
        height: 38,
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {filterOptions.map((option, idx) => {
        const isActive = filter === option;
        return (
          <Button
            key={option}
            onClick={() => setFilter(option)}
            disableRipple
            sx={{
              zIndex: 1,
              flex: 1,
              color: isActive ? "#fff" : inactiveText,
              fontWeight: 700,
              fontSize: 15,
              borderRadius: "999px",
              textTransform: "none",
              minHeight: "32px",
              py: "6px",
              px: "12px",

              transition: "color 0.18s",
            }}
          >
            {option === "all" ? "Featured Wallets" : "Followed Only"}
          </Button>
        );
      })}

      <motion.div
        layout
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{
          position: "absolute",
          top: 3,
          bottom: 3,
          left: filter === "all" ? 3 : "calc(50% + 3px)",
          width: "calc(50% - 6px)",
          borderRadius: "999px",
          background: GRADIENT,
          zIndex: 0,
          boxShadow: "0 2px 14px #e548c814",
        }}
      />
    </Box>
  );
};

export default FollowFilterSwitcher;
