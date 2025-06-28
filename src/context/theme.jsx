import React, { createContext, useState, useEffect, useMemo } from "react";
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
  CssBaseline,
  GlobalStyles,
} from "@mui/material";

export const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) setIsDark(saved === "dark");
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDark ? "dark" : "light",
          primary: {
            main: "#ff61d5",
            light: "#ffb8f5",
            dark: "#a042b3",
            contrastText: "#fff",
          },
          secondary: {
            main: "#8d6cff",
            light: "#d1bbff",
            dark: "#5b3a99",
            contrastText: "#fff",
          },
          background: {
            default: isDark ? "#0F111A" : "#f5f5f5",
            paper: isDark ? "#191528" : "#fff",
          },
          text: {
            primary: isDark ? "rgba(255,255,255,0.9)" : "#2d183d",
            secondary: isDark ? "#f1c5f9" : "#a042b3",
          },
          error: { main: "#ff4e8b" },
          warning: { main: "#ffbc65" },
          success: { main: "#37d67a" },
          action: {
            hover: isDark ? "#37204e" : "#ffecfa",
            selected: isDark ? "#2e1941" : "#ffe2fc",
          },
          divider: isDark ? "#ffb8f533" : "#a042b322",
        },
        shape: {
          borderRadius: 12,
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                transition: "background-color 0.4s, color 0.4s",
                backgroundColor: isDark ? "#0F111A" : "#f5f5f5",
                color: isDark ? "#fff" : "#2d183d",
              },
              "*": {
                transition: "background-color 0.4s, color 0.4s",
              },
              a: {
                color: "#ff61d5",
              },
            },
          },
        },
        typography: {
          fontFamily: [
            "Inter",
            "Roboto",
            "Arial",
            "monospace",
            "sans-serif",
          ].join(","),
        },
      }),
    [isDark]
  );

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles
          styles={{
            "*": {
              transition: "background-color 0.4s, color 0.4s",
            },
            a: {
              color: "#ff61d5",
            },
          }}
        />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
