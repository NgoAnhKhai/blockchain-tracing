import { useEffect, useState } from "react";
import { getUserProfile } from "../services/GetUserProfile";
import ProfileContent from "../components/setting/ProfileContent";
import EditContent from "../components/setting/EditContent";
import SwitchButtonVertical from "../components/button/SwitchButtonVertical";
import { Skeleton, useTheme, Box, Avatar } from "@mui/material";

export default function ProfileUserPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("profile");
  const theme = useTheme();

  useEffect(() => {
    (async () => {
      try {
        const data = await getUserProfile();
        setUser(data);
      } catch {
        setUser(null);
      }
      setLoading(false);
    })();
  }, []);

  return (
    <div
      style={{
        position: "relative",
        background: theme.palette.background.default,
        minHeight: "100vh",
      }}
    >
      <SwitchButtonVertical tab={tab} setTab={setTab} />

      <div
        style={{
          marginRight: 200,
          padding: "64px 0",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          minHeight: 480,
        }}
      >
        {loading && (
          <Box
            sx={{
              width: 420,
              maxWidth: "95vw",
              py: 3,
              px: 3,
              textAlign: "center",
              bgcolor: theme.palette.background.paper,
              borderRadius: 3,
              boxShadow: theme.shadows[1],
            }}
          >
            <Skeleton
              variant="circular"
              width={82}
              height={82}
              sx={{ mx: "auto", mb: 2 }}
            />
            <Skeleton
              variant="text"
              height={36}
              width="50%"
              sx={{ mx: "auto" }}
            />
            <Skeleton
              variant="text"
              height={26}
              width="80%"
              sx={{ mx: "auto", mb: 2 }}
            />
            <Skeleton
              variant="rectangular"
              height={28}
              width="90%"
              sx={{ mx: "auto", mb: 1.5 }}
            />
            <Skeleton
              variant="rectangular"
              height={28}
              width="60%"
              sx={{ mx: "auto", mb: 1.5 }}
            />
            <Skeleton
              variant="rectangular"
              height={80}
              width="100%"
              sx={{ mb: 1.5 }}
            />
          </Box>
        )}
        {!loading && !user && (
          <Box
            sx={{
              textAlign: "center",
              p: 6,
              color: theme.palette.error.main,
              fontWeight: 600,
              fontSize: 18,
              bgcolor: theme.palette.background.paper,
              borderRadius: 3,
            }}
          >
            User was not found
          </Box>
        )}
        {!loading && user && tab === "profile" && (
          <ProfileContent user={user} />
        )}
        {!loading && user && tab === "edit" && <EditContent user={user} />}
      </div>
    </div>
  );
}
