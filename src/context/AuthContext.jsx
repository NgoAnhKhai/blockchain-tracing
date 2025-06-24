import React, { createContext, useState, useContext, useEffect } from "react";
import apiService from "../api/apiService";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        if (decodedUser.exp && decodedUser.exp * 1000 < Date.now()) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("role");
          return null;
        }
        if (decodedUser.role) {
          localStorage.setItem("role", decodedUser.role);
        }
        return decodedUser;
      } catch (error) {
        console.error("Failed to decode token", error);
        localStorage.removeItem("access_token");
        localStorage.removeItem("role");
      }
    }
    return null;
  });

  const signin = async (email, password) => {
    try {
      const response = await apiService.post("/authentications/login", {
        email,
        password,
      });
      const { access_token } = response;

      if (!access_token) throw new Error("access_token không tồn tại");

      const decodedUser = jwtDecode(access_token);
      setUser(decodedUser);
      localStorage.setItem("access_token", access_token);
      if (decodedUser.role) {
        localStorage.setItem("role", decodedUser.role);
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const signout = () => {
    setUser(null);
    localStorage.removeItem("access_token");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  const isAuthenticated = () => {
    const token = localStorage.getItem("access_token");
    if (!token) return false;
    try {
      const decodedUser = jwtDecode(token);

      if (decodedUser.exp && decodedUser.exp * 1000 < Date.now()) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("role");
        setUser(null);
        return false;
      }
      return true;
    } catch (error) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("role");
      setUser(null);
      return false;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        if (decodedUser.exp && decodedUser.exp * 1000 < Date.now()) {
          signout();
        } else {
          setUser(decodedUser);
          if (decodedUser.role) {
            localStorage.setItem("role", decodedUser.role);
          }
        }
      } catch (error) {
        signout();
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, signin, signout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
