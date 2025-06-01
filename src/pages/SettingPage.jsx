import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Button,
  Divider,
  useTheme,
} from "@mui/material";

const SettingPage = () => {
  const theme = useTheme();

  // ----------------------
  // State DEMO (có thể lưu vào localStorage / API thực)
  // ----------------------
  const [walletAddress, setWalletAddress] = useState("0x6fa...e07");
  const [darkMode, setDarkMode] = useState(theme.palette.mode === "dark");
  const [language, setLanguage] = useState("en");
  const [notifLargeTx, setNotifLargeTx] = useState(true);
  const [notifSurge, setNotifSurge] = useState(false);
  const [notifUnusual, setNotifUnusual] = useState(false);
  const [passphrase, setPassphrase] = useState("");

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode !== null) {
      setDarkMode(savedMode === "true");
    }
  }, []);

 
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  // ----------------------
  // Handler
  // ----------------------
  const handleThemeChange = (e) => {
    setDarkMode(e.target.checked);
  };
  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };
  const handleNotifLargeTx = (e) => {
    setNotifLargeTx(e.target.checked);
  };
  const handleNotifSurge = (e) => {
    setNotifSurge(e.target.checked);
  };
  const handleNotifUnusual = (e) => {
    setNotifUnusual(e.target.checked);
  };
  const handlePassphraseChange = (e) => {
    setPassphrase(e.target.value);
  };

  const handleDisconnectWallet = () => {
    // Gọi hàm disconnect ví thực tế ở đây
    alert("Wallet disconnected (demo).");
    setWalletAddress("");
  };
  const handleSaveProfile = () => {
    // Gọi API lưu profile / preferences
    alert("Profile & Preferences saved (demo).");
  };
  const handleChangePassphrase = () => {
    // Gọi API thay đổi passphrase
    alert(`Passphrase changed to "${passphrase}" (demo).`);
    setPassphrase("");
  };
  const handleLogoutAll = () => {
    // Gọi API logout tất cả devices
    alert("Logged out from all devices (demo).");
  };
  const handleDeleteAccount = () => {
    // Gọi API delete account
    alert("Account deleted (demo).");
  };

  return (
    <Box
      sx={{
        p: 2,
        bgcolor: theme.palette.background.default,
        color: theme.palette.text.primary,
        minHeight: "100vh",
      }}
    >
      <Box
        sx={{
          maxWidth: "1000px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >

        {/* === 1. Profile Settings === */}
        <Card
          sx={{
            backgroundColor: theme.palette.background.paper,
            borderRadius: 1,
          }}
        >
          <CardContent>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
            >
              <TextField
                label="Wallet Address"
                value={walletAddress}
                InputProps={{
                  readOnly: true,
                }}
                size="small"
                sx={{ borderRadius: 1 }}
              />

              <Button
                variant="outlined"
                color="warning"
                onClick={handleDisconnectWallet}
                sx={{ alignSelf: "flex-start", borderRadius: 1 }}
              >
                Disconnect Wallet
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* === 2. Theme & Preferences === */}
        <Card
          sx={{
            backgroundColor: theme.palette.background.paper,
            borderRadius: 1,
          }}
        >
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Theme & Preferences
            </Typography>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={darkMode}
                    onChange={handleThemeChange}
                    color="primary"
                  />
                }
                label="Enable Dark Mode"
              />

              <FormControl sx={{ minWidth: 180 }} size="small">
                <InputLabel sx={{ color: theme.palette.text.primary }}>
                  Language
                </InputLabel>
                <Select
                  value={language}
                  label="Language"
                  onChange={handleLanguageChange}
                  sx={{
                    bgcolor:
                      theme.palette.mode === "dark"
                        ? theme.palette.background.default
                        : "rgba(255,255,255,0.8)",
                    color: theme.palette.text.primary,
                    borderRadius: 1,
                  }}
                >
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="vi">Tiếng Việt</MenuItem>
                  <MenuItem value="es">Español</MenuItem>
                  <MenuItem value="zh">中文</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </CardContent>
        </Card>

        {/* === 3. Notification Settings === */}
        <Card
          sx={{
            backgroundColor: theme.palette.background.paper,
            borderRadius: 1,
          }}
        >
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Notification Settings
            </Typography>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 1 }}
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={notifLargeTx}
                    onChange={handleNotifLargeTx}
                    color="error"
                  />
                }
                label="Large Transaction Alerts"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={notifSurge}
                    onChange={handleNotifSurge}
                    color="warning"
                  />
                }
                label="Surge in Activity Alerts"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={notifUnusual}
                    onChange={handleNotifUnusual}
                    color="info"
                  />
                }
                label="Unusual Behavior Alerts"
              />
            </Box>
          </CardContent>
        </Card>

        {/* === 4. Security & Privacy === */}
        <Card
          sx={{
            backgroundColor: theme.palette.background.paper,
            borderRadius: 1,
          }}
        >
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Security & Privacy
            </Typography>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
            >
              <TextField
                label="Change Passphrase"
                type="password"
                value={passphrase}
                onChange={handlePassphraseChange}
                size="small"
                sx={{ borderRadius: 1 }}
                placeholder="Enter new passphrase"
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleChangePassphrase}
                sx={{ width: "fit-content", borderRadius: 1 }}
              >
                Save Passphrase
              </Button>

              <Divider sx={{ my: 2 }} />

              <Button
                variant="outlined"
                color="secondary"
                onClick={handleLogoutAll}
                sx={{ width: "fit-content", borderRadius: 1 }}
              >
                Logout from All Devices
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* === 5. Account Actions === */}
        <Card
          sx={{
            backgroundColor: theme.palette.background.paper,
            borderRadius: 1,
          }}
        >
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Account Actions
            </Typography>
            <Box sx={{ mt: 1 }}>
              <Button
                variant="contained"
                color="error"
                onClick={handleDeleteAccount}
                sx={{ borderRadius: 1 }}
              >
                Delete Account
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* === Lưu tất cả Changes === */}
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            color="success"
            onClick={handleSaveProfile}
            sx={{ borderRadius: 1 }}
          >
            Save All Settings
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default SettingPage;
