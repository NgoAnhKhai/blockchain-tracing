import React from "react";
import { Box, Button } from "@mui/material";
import { motion } from "framer-motion";

const filterOptions = ["all", "followed"];

const FollowFilterSwitcher = ({ filter, setFilter }) => {
  return (
    <Box
      sx={{
        display: "inline-flex",
        borderRadius: "999px",
        bgcolor: "rgba(255, 255, 255, 0.08)",
        p: "3px",
        position: "relative",
        width: 300,
        height: 38,
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {filterOptions.map((option) => {
        const isActive = filter === option;
        return (
          <Button
            key={option}
            onClick={() => setFilter(option)}
            disableRipple
            sx={{
              zIndex: 1,
              flex: 1,
              color: isActive ? "#fff" : "rgba(255,255,255,0.6)",
              fontWeight: 600,
              fontSize: 14,
              borderRadius: "999px",
              textTransform: "none",
              minHeight: "32px",
              py: "6px",
              px: "12px",
            }}
          >
            {option === "all" ? "All Wallets" : "Followed Only"}
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
          background: "linear-gradient(90deg, #bb86fc, #ff4d88)",
          zIndex: 0,
        }}
      />
    </Box>
  );
};

export default FollowFilterSwitcher;
