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
          background: {
            // <-- đổi thành màu #1F232C như mockup
            default: isDark ? "#0F111A" : "#f5f5f5",
            paper: isDark ? "#0F111A" : "#ffffff",
          },
          // (tuỳ chọn) bạn có thể điều chỉnh text.primary để sáng hơn trên nền này
          text: {
            primary: isDark ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.87)",
          },
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                transition: "background-color 0.4s ease, color 0.4s ease",
              },
            },
          },
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
              transition: "background-color 0.4s ease, color 0.4s ease",
            },
          }}
        />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
