import React, { useState } from "react";
import {
  Box,
  Card,
  Typography,
  Button,
  Avatar,
  TextField,
  Divider,
} from "@mui/material";
import DiscordIcon from "../assets/discord.png"; // icon discord png

const ProfilePage = () => {
  // Profile info
  const [profile, setProfile] = useState({
    firstName: "Ahmad",
    lastName: "Saris",
    email: "ahmadsaris@gmail.com",
    phone: "+1 03203202",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  });
  const [webhook, setWebhook] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingWebhook, setSavingWebhook] = useState(false);

  // Edit profile handler
  const handleSaveProfile = () => {
    setSavingProfile(true);
    setTimeout(() => {
      setSavingProfile(false);
      alert("Profile saved!");
    }, 900);
  };

  // Save webhook handler
  const handleSaveWebhook = () => {
    setSavingWebhook(true);
    setTimeout(() => {
      setSavingWebhook(false);
      alert("Webhook saved!");
    }, 900);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        color: "#fff",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        gap: 5,
        px: 4,
        py: 7,
      }}
    >
      {/* Left: Profile Info */}
      <Card
        sx={{
          width: 370,
          p: 4,
          bgcolor: "#231d34",
          borderRadius: 5,
          boxShadow: "0 8px 40px #a076ff28",
          border: "1.5px solid #2d283c",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <Avatar src={profile.avatar} sx={{ width: 72, height: 72 }} />
          <Box>
            <Typography variant="h6" fontWeight={700}>
              {profile.firstName} {profile.lastName}
            </Typography>
            <Typography fontSize={13} color="#ccc">
              User Profile
            </Typography>
          </Box>
        </Box>
        <TextField
          label="First Name"
          value={profile.firstName}
          onChange={(e) =>
            setProfile({ ...profile, firstName: e.target.value })
          }
          size="small"
          fullWidth
          sx={{ mb: 2, input: { color: "#fff" } }}
        />
        <TextField
          label="Last Name"
          value={profile.lastName}
          onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
          size="small"
          fullWidth
          sx={{ mb: 2, input: { color: "#fff" } }}
        />
        <TextField
          label="Email Address"
          value={profile.email}
          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          size="small"
          fullWidth
          sx={{ mb: 2, input: { color: "#fff" } }}
        />
        <TextField
          label="Phone Number"
          value={profile.phone}
          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
          size="small"
          fullWidth
          sx={{ mb: 3, input: { color: "#fff" } }}
        />
        <Button
          variant="contained"
          color="secondary"
          sx={{
            borderRadius: 2,
            fontWeight: 700,
            width: "100%",
            py: 1.2,
            fontSize: 16,
          }}
          onClick={handleSaveProfile}
          disabled={savingProfile}
        >
          {savingProfile ? "Saving..." : "Save Profile"}
        </Button>
      </Card>

      {/* Right: Discord Webhook & Data Verify */}
      <Box
        sx={{
          flex: 1,
          maxWidth: 450,
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        {/* Discord Webhook */}
        <Card
          sx={{
            p: 4,
            bgcolor: "#231d34",
            borderRadius: 5,
            boxShadow: "0 8px 40px #a076ff28",
            border: "1.5px solid #2d283c",
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <img src={DiscordIcon} width={38} alt="discord" />
            <Typography variant="h6" fontWeight={700}>
              Discord Webhook Config
            </Typography>
          </Box>
          <TextField
            label="Discord Webhook URL"
            value={webhook}
            onChange={(e) => setWebhook(e.target.value)}
            fullWidth
            size="small"
            sx={{ mb: 2, input: { color: "#fff" } }}
            placeholder="https://discord.com/api/webhooks/..."
          />
          <Button
            variant="contained"
            sx={{
              background: "linear-gradient(90deg, #7289da 0%, #ff4d88 100%)",
              color: "#fff",
              borderRadius: 2,
              fontWeight: 700,
              px: 3,
              py: 1.2,
              fontSize: 16,
            }}
            onClick={handleSaveWebhook}
            disabled={savingWebhook}
          >
            {savingWebhook ? "Saving..." : "Save Webhook"}
          </Button>
        </Card>

        {/* Data Verify - tuỳ ý bạn thêm hoặc bỏ */}
        <Card
          sx={{
            p: 4,
            bgcolor: "#231d34",
            borderRadius: 5,
            boxShadow: "0 8px 40px #a076ff28",
            border: "1.5px solid #2d283c",
          }}
        >
          <Typography variant="h6" fontWeight={700} mb={2}>
            Data Verification
          </Typography>
          <Typography fontSize={15}>
            This section will display data verify or KYC features...
          </Typography>
        </Card>
      </Box>
    </Box>
  );
};

export default ProfilePage;
