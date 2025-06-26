import { useEffect, useState } from "react";
import { getUserProfile } from "../services/GetUserProfile";
import ProfileContent from "../components/setting/ProfileContent";
import EditContent from "../components/setting/EditContent";

import SwitchButtonVertical from "../components/button/SwitchButtonVertical";
import ProfileSkeleton from "../components/skeleton/ProfileSkeloton";

export default function ProfileUserPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("profile");

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
      }}
    >
      <SwitchButtonVertical tab={tab} setTab={setTab} />

      {/* Nội dung tab */}
      <div
        style={{
          marginRight: 200,
          padding: "64px 0",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        {loading && (
          <div style={{ textAlign: "center", padding: 48, color: "#bbb" }}>
            <ProfileSkeleton />
          </div>
        )}
        {!loading && !user && (
          <div style={{ textAlign: "center", padding: 48, color: "#ff4d88" }}>
            Không tìm thấy thông tin người dùng.
          </div>
        )}
        {!loading && user && tab === "profile" && (
          <ProfileContent user={user} />
        )}
        {!loading && user && tab === "edit" && <EditContent user={user} />}
      </div>
    </div>
  );
}
