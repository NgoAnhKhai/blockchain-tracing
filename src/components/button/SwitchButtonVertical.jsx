import { motion } from "framer-motion";
import PersonIcon from "@mui/icons-material/Person";
import EditIcon from "@mui/icons-material/Edit";

const BUTTONS = [
  { key: "profile", icon: <PersonIcon fontSize="medium" />, label: "Profile" },
  { key: "edit", icon: <EditIcon fontSize="medium" />, label: "Edit" },
];

export default function SwitchButtonVertical({ tab, setTab }) {
  const idx = BUTTONS.findIndex((btn) => btn.key === tab);

  return (
    <div
      style={{
        position: "fixed",
        top: "20%",
        right: 0,
        width: 56,
        zIndex: 30,
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        height: 112,
        background: "transparent",
      }}
    >
      <div style={{ position: "relative", width: 56, height: 104 }}>
        {/* Nền hiệu ứng */}
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 420, damping: 32 }}
          style={{
            position: "absolute",
            top: idx * 52, // mỗi button cao 52px
            left: 0,
            width: 56,
            height: 48,
            borderRadius: "18px 0 0 18px",
            background:
              idx === 0
                ? "linear-gradient(90deg,#fff 70%,#a076ff11)"
                : "linear-gradient(90deg,#fff 70%,#ff4d8822)",
            boxShadow:
              idx === 0 ? "-2px 0 12px #a076ff44" : "-2px 0 12px #ff4d8844",
            borderLeft: idx === 0 ? "5px solid #a076ff" : "5px solid #ff4d88",
          }}
        />
        {/* Nút Icon */}
        {BUTTONS.map((btn, i) => (
          <button
            key={btn.key}
            title={btn.label}
            onClick={() => setTab(btn.key)}
            style={{
              zIndex: 2,
              position: "absolute",
              top: i * 52,
              left: 0,
              width: 56,
              height: 48,
              background: "transparent",
              color:
                tab === btn.key ? (i === 0 ? "#a076ff" : "#ff4d88") : "#fff",
              border: "none",
              outline: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "18px 0 0 18px",
              fontSize: 24,
              fontWeight: 700,
              cursor: "pointer",
              transition: "color 0.16s",
            }}
          >
            {btn.icon}
          </button>
        ))}
      </div>
    </div>
  );
}
