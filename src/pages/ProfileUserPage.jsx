import React, { useEffect, useState } from "react";
import { getUserProfile } from "../services/GetUserProfile";

const DEFAULT_AVATAR =
  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"; // Hoặc link AI avatar bạn chọn

const ProfileUserPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getUserProfile();
        console.log("User profile data:", data);

        setUser(data.data);
      } catch {
        setUser(null);
      }
      setLoading(false);
    })();
  }, []);

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: 48, color: "#bbb" }}>
        Loading profile...
      </div>
    );

  if (!user)
    return (
      <div style={{ textAlign: "center", padding: 48, color: "#ff4d88" }}>
        Không tìm thấy thông tin người dùng.
      </div>
    );

  return (
    <div
      style={{
        maxWidth: 520,
        margin: "4rem auto",
        display: "flex",
        background: "rgba(24,18,44,0.98)",
        borderRadius: 18,
        boxShadow: "0 4px 32px 0 rgba(90,0,120,0.14)",
        padding: 36,
        alignItems: "center",
        border: "1px solid #22223b",
      }}
    >
      <img
        src={DEFAULT_AVATAR}
        alt="User avatar"
        style={{
          width: 120,
          height: 120,
          borderRadius: "50%",
          objectFit: "cover",
          boxShadow: "0 2px 12px #bb86fc77",
          border: "3px solid #da00ff",
          marginRight: 36,
        }}
      />
      <div>
        <h2 style={{ margin: "0 0 6px 0", color: "#fff" }}>
          User: {user.username}
        </h2>
        <p style={{ color: "#bb86fc", margin: 0 }}>Email: {user.email}</p>
        <p style={{ color: "#fff", margin: "14px 0 0 0" }}>Role: {user.role}</p>
      </div>
    </div>
  );
};

export default ProfileUserPage;
