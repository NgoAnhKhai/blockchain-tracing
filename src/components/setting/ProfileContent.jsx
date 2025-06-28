import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import RobotMascot from "../RobotMascot";
import { Box, Typography, useTheme } from "@mui/material";
import Logo from "/block_trace.png";

export default function ProfileContent({ user }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  // Màu dynamic cho card & các element
  const cardBg = isDark
    ? "linear-gradient(120deg, #201c2b 70%, #231d34 100%)"
    : "linear-gradient(120deg, #f4f3fd 60%, #ffeaf6 100%)";
  const boxShadow = isDark ? "0 2px 18px #a076ff33" : "0 4px 36px #d1c6ee44";
  const profileGradient = isDark
    ? "linear-gradient(90deg, #a076ff, #ff4d88 65%)"
    : "linear-gradient(90deg, #865dff, #ff4d88 65%)";
  const mainText = isDark ? "#fff" : "#32214c";
  const emailBg = isDark ? "#251b34" : "#e8e6fb";
  const emailColor = isDark ? "#bb86fc" : "#945ad6";
  const roleBg = isDark ? "#191623" : "#f2e6ff";
  const roleColor = isDark ? "#a076ff" : "#7c3aed";
  const quoteBg = isDark ? "#241c30" : "#f8eaff";
  const quoteColor = isDark ? "#bdb2ff" : "#b493ff";
  const aiColor = isDark ? "#a076ff" : "#865dff";

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "stretch",
        gap: 2,
        p: 4,
        minWidth: 420,
        background: cardBg,
        borderRadius: 6,
        boxShadow: boxShadow,
        position: "relative",
        flexDirection: "column",
        fontFamily: "Inter, monospace",
        transition: "all .3s",
      }}
    >
      {/* HEADER PROFILE */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mr: 7,
          justifyContent: "center",
          fontFamily: "Inter, monospace",
        }}
      >
        <img
          src={Logo}
          alt="Logo"
          style={{
            width: 144,
            height: 84,
            filter: isDark
              ? "drop-shadow(0 2px 8px #a076ff55)"
              : "drop-shadow(0 2px 12px #d1c6ee66)",
            borderRadius: 8,
            background: isDark ? "none" : "#fff8",
          }}
        />
        <Typography
          component="span"
          sx={{
            fontSize: 45,
            fontWeight: 800,
            letterSpacing: 1,
            ml: 2,
            color: "transparent",
            background: profileGradient,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            textShadow: isDark ? "0 2px 8px #a076ff66" : "0 2px 12px #d1c6ee55",
            textTransform: "uppercase",
            fontFamily: "inherit",
            userSelect: "none",
          }}
        >
          Profile
        </Typography>
      </Box>

      <Box sx={{ display: "flex", gap: 4 }}>
        {/* AVATAR & MASCOT */}
        <Box sx={{ flex: "0 0 120px", textAlign: "center" }}>
          <Box sx={{ mt: 2.5 }}>
            <RobotMascot />
            <Typography
              sx={{
                color: aiColor,
                fontWeight: 600,
                fontSize: 15,
                mt: 0.6,
                letterSpacing: 0.1,
                fontFamily: "inherit",
              }}
            >
              AI Guardian
            </Typography>
          </Box>
        </Box>

        {/* Thông tin user */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            fontFamily: "inherit",
          }}
        >
          {/* Username */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 1.2 }}>
            <PersonIcon sx={{ color: aiColor, mr: 1 }} />
            <Typography
              variant="h5"
              sx={{
                color: mainText,
                fontWeight: 700,
                fontSize: 26,
                fontFamily: "inherit",
                m: 0,
              }}
            >
              {user.username || "No Name"}
            </Typography>
          </Box>
          {/* Email */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 1.2 }}>
            <EmailIcon sx={{ color: "#fd4d85", mr: 1 }} />
            <Typography
              sx={{
                color: emailColor,
                background: emailBg,
                px: 2,
                py: 0.6,
                borderRadius: 1.2,
                fontWeight: 600,
                fontSize: 16,
                letterSpacing: 0.4,
                fontFamily: "inherit",
              }}
            >
              {user.email}
            </Typography>
          </Box>
          {/* Role */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 1.2 }}>
            <VerifiedUserIcon sx={{ color: "#52c1fa", mr: 1 }} />
            <Typography
              sx={{
                background: roleBg,
                px: 2.5,
                py: 0.6,
                borderRadius: 1.2,
                fontWeight: 600,
                color: roleColor,
                fontSize: 16,
                letterSpacing: 0.35,
                fontFamily: "inherit",
              }}
            >
              Role: {user.role}
            </Typography>
          </Box>
          {/* Quote */}
          <Box
            sx={{
              mt: 2.3,
              color: quoteColor,
              background: quoteBg,
              borderRadius: 1.3,
              px: 2.5,
              py: 1.2,
              fontSize: 15.5,
              fontWeight: 500,
              fontFamily: "inherit",
              boxShadow: isDark
                ? "0 1px 8px #a076ff20"
                : "0 2px 10px #e9d8fd22",
              fontStyle: "italic",
            }}
          >
            “Welcome to your blockchain workspace”
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
