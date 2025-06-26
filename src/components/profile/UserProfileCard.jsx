import React from "react";
import { Card, Box, Typography, Avatar } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";

export default function UserProfileCard({ userProfile }) {
  return (
    <Card
      sx={{
        bgcolor: "rgba(30, 20, 44, 0.95)",
        borderRadius: 4,
        p: 4,
        minWidth: 360,
        maxWidth: 400,
        mx: "auto",
        boxShadow: "none",
        border: "1.5px solid #b9a6f9",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Avatar
        sx={{
          width: 66,
          height: 66,
          mb: 2,
          bgcolor: "#2f214c",
          border: "3px solid #bb86fc",
        }}
      >
        <PersonIcon sx={{ fontSize: 44, color: "#bb86fc" }} />
      </Avatar>
      <Typography
        variant="h5"
        fontWeight={700}
        sx={{
          color: "#bb86fc",
          letterSpacing: 1,
          mb: 0.5,
        }}
      >
        {userProfile?.username || "--"}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: "#fff",
          opacity: 0.65,
          fontWeight: 500,
          mb: 1,
        }}
      >
        Username
      </Typography>
      {userProfile?.email && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            color: "#b9a6f9",
            bgcolor: "rgba(80, 60, 120, 0.11)",
            px: 2,
            py: 0.7,
            borderRadius: 3,
            gap: 1,
          }}
        >
          <EmailIcon sx={{ fontSize: 18, color: "#bb86fc" }} />
          <Typography
            variant="body2"
            sx={{
              color: "#b9a6f9",
              fontWeight: 500,
              fontSize: 15,
              letterSpacing: 0.2,
            }}
          >
            {userProfile.email}
          </Typography>
        </Box>
      )}
    </Card>
  );
}
