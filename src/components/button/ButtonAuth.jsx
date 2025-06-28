import { Button } from "@mui/material";
import { styled, keyframes } from "@mui/system";
import { transform } from "lodash";

const gradientShift = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

export const LoginButton = styled(Button)({
  position: "relative",
  overflow: "hidden",

  minWidth: "100px",
  height: "36px",
  fontFamily: "'Poppins', sans-serif",
  fontWeight: 600,
  fontSize: "1.125rem",
  textTransform: "none",

  background: `
    linear-gradient(45deg,
      #00FFE7 0%,
      #00B4DB 25%,
      #8A2BE2 50%,
      #E040FB 75%,
      #FF00D0 100%
    )
  `,
  backgroundSize: "300% 300%",

  borderRadius: "15px",
  color: "#fff",

  boxShadow:
    "0 0 16px rgba(0,255,231,0.8), " +
    "0 0 32px rgba(0,180,219,0.8), " +
    "0 0 48px rgba(255,0,208,0.8)",

  animation: `${gradientShift} 5s linear infinite`,

  "&:hover": {
    boxShadow:
      "0 0 24px rgba(0,255,231,1), " +
      "0 0 48px rgba(0,180,219,1), " +
      "0 0 72px rgba(255,0,208,1)",
  },

  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: "-75%",
    width: "60%",
    height: "100%",
    background: "rgba(255,255,255,0.6)",
    transform: "skewX(-25deg)",
    pointerEvents: "none",
  },
  "&:hover::after": {
    animation: `${gradientShift} 0.8s ease-in-out`,
  },
});
export const RegisterButton = styled(Button)(({ theme }) => {
  const dark = theme.palette.mode === "dark";
  return {
    minWidth: "40px",
    height: "36px",
    fontWeight: 500,
    fontSize: "0.9rem",
    textTransform: "none",

    border: "2px solid transparent",
    borderImage: "linear-gradient(90deg, #00ffe7 0%, #ff00d0 100%) 1",

    color: dark ? "#fff" : "#000",

    borderRadius: "12px",

    background: dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",

    boxShadow: dark
      ? "0 0 6px rgba(0,255,231,0.4), 0 0 6px rgba(255,0,208,0.4)"
      : "0 0 4px rgba(0,0,0,0.1)",

    transition:
      "background 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease",
    "&:hover": {
      background: dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
      boxShadow: dark
        ? "0 0 12px rgba(0,255,231,0.6), 0 0 12px rgba(255,0,208,0.6)"
        : "0 0 6px rgba(0,0,0,0.2)",
      transform: "scale(1.02)",
    },
  };
});
