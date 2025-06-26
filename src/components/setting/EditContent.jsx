import React, { useState } from "react";
import {
  Box,
  Card,
  Typography,
  Button,
  TextField,
  Avatar,
  InputAdornment,
} from "@mui/material";
import { motion } from "framer-motion";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import LinkIcon from "@mui/icons-material/Link";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import DiscordIcon from "../../assets/discord.png";
import { updateProfile } from "../../services/UpdateProfile";

export default function EditContent({ user }) {
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
            border: "2px solid #a076ff",
            boxShadow: "0 2px 10px #a076ff44",
          }}
        />
        <Box>
          <Typography variant="h5" fontWeight={700} sx={{ color: "#fff" }}>
            Edit Profile
          </Typography>
          <Typography sx={{ color: "#bb86fc", fontSize: 15, mt: 0.5 }}>
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
            bgcolor: "#231d34",
            borderRadius: 5,
            boxShadow: "0 8px 40px #a076ff18",
            border: "1.5px solid #2d283c",
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <TextField
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: "#bb86fc" }} />
                  </InputAdornment>
                ),
                style: { color: "#fff" },
              }}
              sx={{
                bgcolor: "#221d31",
                borderRadius: 2,
                input: { color: "#fff" },
              }}
              fullWidth
              autoComplete="off"
            />
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
                style: { color: "#fff" },
              }}
              sx={{
                bgcolor: "#221d31",
                borderRadius: 2,
                input: { color: "#fff" },
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
                style: { color: "#fff" },
              }}
              sx={{
                bgcolor: "#221d31",
                borderRadius: 2,
                input: { color: "#fff" },
              }}
              placeholder="https://discord.com/api/webhooks/..."
              fullWidth
              autoComplete="off"
            />
            <Button
              variant="contained"
              onClick={handleSaveProfile}
              sx={{
                mt: 2,
                borderRadius: 2,
                background: "linear-gradient(90deg, #7289da 0%, #ff4d88 100%)",
                color: "#fff",
                fontWeight: 700,
                fontSize: 16,
                px: 4,
                py: 1.5,
                letterSpacing: 1,
                boxShadow: "0 2px 24px #a076ff22",
                ":hover": {
                  background: "linear-gradient(90deg, #ff4d88, #7289da 90%)",
                },
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
        sx={{ mt: 2, color: "#bbb", fontSize: 14, textAlign: "center" }}
      >
        All changes will be securely updated to your account.
      </Typography>
    </div>
  );
}
