import React, { useState } from "react";
import {
  Box,
  Card,
  Typography,
  Button,
  TextField,
  Avatar,
  InputAdornment,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import DiscordIcon from "../../assets/discord.png";
import { updateProfile } from "../../services/UpdateProfile";

export default function EditContent({ user }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const accent = theme.palette.primary.main;
  const accentLight = theme.palette.primary.light;
  const accentDark = theme.palette.primary.dark;

  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [webhook, setWebhook] = useState(user?.webhook_url || "");
  const [saving, setSaving] = useState(false);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await updateProfile({
        username,
        email,
        webhook_url: webhook,
      });
      setSaving(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      setSaving(false);
      alert("Failed to update profile. Please try again.");
    }
  };

  // Các màu cho theme light/dark
  const cardBg = isDark ? "#231d34" : "#fff";
  const cardBorder = isDark ? "#2d283c" : "#ece8fb";
  const boxShadow = isDark ? "0 8px 40px #a076ff18" : "0 8px 32px #dfcdfd35";
  const inputBg = isDark ? "#221d31" : "#f6f1ff";
  const inputColor = isDark ? "#fff" : "#543a6a";
  const inputLabelColor = isDark ? "#a076ff" : accent;
  const inputBorder = isDark ? "#32284b" : "#e0cafd";
  const avatarBorder = isDark ? "#a076ff" : accentLight;
  const helperText = isDark ? "#bbb" : "#9e63c2";

  return (
    <div style={{ padding: 32 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 4,
          gap: 2,
        }}
      >
        <Avatar
          src={
            user.avatar ||
            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
          }
          sx={{
            width: 72,
            height: 72,
            border: `2px solid ${avatarBorder}`,
            boxShadow: isDark ? "0 2px 10px #a076ff44" : "0 2px 10px #ebc9fd77",
            bgcolor: "#fff",
          }}
        />
        <Box>
          <Typography
            variant="h5"
            fontWeight={700}
            sx={{ color: isDark ? "#fff" : accentDark }}
          >
            Edit Profile
          </Typography>
          <Typography sx={{ color: inputLabelColor, fontSize: 15, mt: 0.5 }}>
            Update your information and Discord notifications!
          </Typography>
        </Box>
      </Box>
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.48, ease: "easeOut" }}
      >
        <Card
          sx={{
            p: 3,
            bgcolor: cardBg,
            borderRadius: 5,
            boxShadow: boxShadow,
            border: `1.5px solid ${cardBorder}`,
            mb: 2,
            transition: "all .25s",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Username */}
            <TextField
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: inputLabelColor }} />
                  </InputAdornment>
                ),
                style: { color: inputColor },
              }}
              InputLabelProps={{
                style: { color: inputLabelColor },
              }}
              sx={{
                bgcolor: inputBg,
                borderRadius: 2,
                input: { color: inputColor, fontWeight: 500 },
                label: { color: inputLabelColor },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: inputBorder,
                },
              }}
              fullWidth
              autoComplete="off"
            />
            {/* Email */}
            <TextField
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: "#fd4d85" }} />
                  </InputAdornment>
                ),
                style: { color: inputColor },
              }}
              InputLabelProps={{
                style: { color: inputLabelColor },
              }}
              sx={{
                bgcolor: inputBg,
                borderRadius: 2,
                input: { color: inputColor, fontWeight: 500 },
                label: { color: inputLabelColor },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: inputBorder,
                },
              }}
              fullWidth
              autoComplete="off"
              type="email"
            />
            {/* Discord Webhook */}
            <TextField
              label="Discord Webhook URL"
              value={webhook}
              onChange={(e) => setWebhook(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <img
                      src={DiscordIcon}
                      alt="discord"
                      style={{ width: 24, marginRight: 6 }}
                    />
                  </InputAdornment>
                ),
                style: { color: inputColor },
              }}
              InputLabelProps={{
                style: { color: inputLabelColor },
              }}
              sx={{
                bgcolor: inputBg,
                borderRadius: 2,
                input: { color: inputColor, fontWeight: 500 },
                label: { color: inputLabelColor },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: inputBorder,
                },
              }}
              placeholder="https://discord.com/api/webhooks/..."
              fullWidth
              autoComplete="off"
            />
            {/* Button */}
            <Button
              variant="contained"
              onClick={handleSaveProfile}
              sx={{
                mt: 2,
                borderRadius: 2,
                background: `linear-gradient(90deg, ${accentLight} 0%, #ff4d88 100%)`,
                color: "#fff",
                fontWeight: 700,
                fontSize: 16,
                px: 4,
                py: 1.5,
                letterSpacing: 1,
                boxShadow: isDark
                  ? "0 2px 24px #a076ff22"
                  : "0 2px 24px #ebc9fd77",
                ":hover": {
                  background: `linear-gradient(90deg, #ff4d88, ${accentLight} 90%)`,
                },
                transition: "all .18s",
              }}
              fullWidth
              startIcon={<VerifiedUserIcon />}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </Box>
        </Card>
      </motion.div>
      <Typography
        sx={{
          mt: 2,
          color: helperText,
          fontSize: 14,
          textAlign: "center",
          transition: "color .2s",
        }}
      >
        All changes will be securely updated to your account.
      </Typography>
    </div>
  );
}
