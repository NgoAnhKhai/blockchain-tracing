import React from "react";
import styled from "styled-components";
import { useTheme } from "@mui/material";

const LoginButton = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <StyledWrapper isDark={isDark}>
      <button>Login</button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  button {
    font: inherit;
    font-weight: 600;
    font-size: 1.1rem;
    padding: 0.4em 1.2em;
    border-radius: 0.5em;
    cursor: pointer;
    transition: all 0.2s ease;
    text-shadow: ${({ isDark }) => (isDark ? "0 1px 0 #000" : "0 1px 0 #fff")};

    background-color: ${({ isDark }) => (isDark ? "#2a2a2a" : "#f2f2f2")};
    color: ${({ isDark }) => (isDark ? "#e0e0e0" : "#202020")};

    box-shadow: ${({ isDark }) =>
      isDark
        ? `inset 0 1px 0 #3a3a3a,
           0 1px 0 #252525,
           0 2px 0 #202020,
           0 4px 0 #1c1c1c,
           0 5px 0 #181818,
           0 6px 0 #141414,
           0 7px 0 #101010,
           0 7px 8px #0a0a0a`
        : `inset 0 1px 0 #fff,
           0 1px 0 #ddd,
           0 2px 0 #ccc,
           0 4px 0 #bbb,
           0 5px 0 #aaa,
           0 6px 0 #999,
           0 7px 0 #888,
           0 7px 8px #777`};
  }

  button:active {
    transform: translateY(3px);
    box-shadow: ${({ isDark }) =>
      isDark
        ? `inset 0 1px 0 #3a3a3a,
           0 1px 0 #252525,
           0 2px 0 #202020,
           0 3px 0 #1c1c1c,
           0 4px 0 #181818,
           0 5px 0 #141414,
           0 6px 0 #101010,
           0 6px 6px #0a0a0a`
        : `inset 0 1px 0 #fff,
           0 1px 0 #ddd,
           0 2px 0 #ccc,
           0 3px 0 #bbb,
           0 4px 0 #aaa,
           0 5px 0 #999,
           0 6px 0 #888,
           0 6px 6px #777`};
  }
`;

export default LoginButton;
