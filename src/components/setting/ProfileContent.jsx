import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import RobotMascot from "../RobotMascot";

import Logo from "/block_trace.png";

export default function ProfileContent({ user }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "stretch",
        gap: 2,
        padding: 32,
        minWidth: 420,
        background: "linear-gradient(120deg, #201c2b 70%, #231d34 100%)",
        borderRadius: 18,
        boxShadow: "0 2px 18px #a076ff33",
        position: "relative",
        flexDirection: "column",
      }}
    >
      {/* HEADER PROFILE với logo + chữ */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginRight: 52,
          justifyContent: "center",
        }}
      >
        <img
          src={Logo}
          alt="Logo"
          style={{
            width: 144,
            height: 84,
            filter: "drop-shadow(0 2px 8px #a076ff55)",
            borderRadius: 8,
          }}
        />
        <span
          style={{
            fontSize: 45,
            fontWeight: 800,
            letterSpacing: 1,
            color: "transparent",
            background: "linear-gradient(90deg, #a076ff, #ff4d88 65%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            textShadow: "0 2px 8px #a076ff66",
            textTransform: "uppercase",
          }}
        >
          Profile
        </span>
      </div>

      <div style={{ display: "flex", gap: 32 }}>
        {/* AVATAR bên trái + hình minh hoạ phía dưới */}
        <div style={{ flex: "0 0 120px", textAlign: "center" }}>
          <div style={{ marginTop: 18 }}>
            <RobotMascot />
            <div
              style={{
                color: "#a076ff",
                fontWeight: 600,
                fontSize: 15,
                marginTop: 6,
                letterSpacing: 0.1,
              }}
            >
              AI Guardian
            </div>
          </div>
        </div>

        {/* Thông tin user bên phải */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", marginBottom: 10 }}
          >
            <PersonIcon sx={{ color: "#a076ff", marginRight: 8 }} />
            <h2
              style={{
                color: "#fff",
                margin: 0,
                fontWeight: 700,
                fontSize: 26,
              }}
            >
              {user.username || "No Name"}
            </h2>
          </div>

          <div
            style={{ display: "flex", alignItems: "center", marginBottom: 10 }}
          >
            <EmailIcon sx={{ color: "#fd4d85", marginRight: 8 }} />
            <span
              style={{
                color: "#bb86fc",
                background: "#251b34",
                padding: "6px 14px",
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 16,
                letterSpacing: 0.4,
              }}
            >
              {user.email}
            </span>
          </div>

          <div
            style={{ display: "flex", alignItems: "center", marginBottom: 10 }}
          >
            <VerifiedUserIcon sx={{ color: "#52c1fa", marginRight: 8 }} />
            <span
              style={{
                background: "#191623",
                padding: "5px 18px",
                borderRadius: 8,
                fontWeight: 600,
                color: "#a076ff",
                fontSize: 16,
                letterSpacing: 0.35,
              }}
            >
              Role: {user.role}
            </span>
          </div>

          <div
            style={{
              marginTop: 18,
              color: "#bdb2ff",
              background: "#241c30",
              borderRadius: 10,
              padding: "10px 18px",
              fontSize: 15.5,
              fontWeight: 500,
              boxShadow: "0 1px 8px #a076ff20",
            }}
          >
            <span style={{ fontStyle: "italic" }}>
              “Welcome to your blockchain workspace”
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
