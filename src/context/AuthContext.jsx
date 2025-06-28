import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useRef,
} from "react";
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
        localStorage.removeItem("access_token");
        localStorage.removeItem("role");
      }
    }
    return null;
  });

  // Ref để giữ timeout logout (tránh bị leak hay trùng timeout)
  const logoutTimeout = useRef(null);

  // Hàm set timeout logout khi hết hạn
  const setupLogoutTimer = (decodedUser) => {
    if (!decodedUser?.exp) return;
    const expiresIn = decodedUser.exp * 1000 - Date.now();
    if (logoutTimeout.current) clearTimeout(logoutTimeout.current);
    if (expiresIn > 0) {
      logoutTimeout.current = setTimeout(() => {
        signout();
        alert("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.");
      }, expiresIn);
    } else {
      signout();
    }
  };

  // Khi login, set lại timeout
  const signin = async (email, password) => {
    try {
      const response = await apiService.post("/api/v1/auth/login", {
        email,
        password,
      });
      const { access_token } = response;
      if (!access_token) throw new Error("access_token không tồn tại");
      const decodedUser = jwtDecode(access_token);
      setUser(decodedUser);
      localStorage.setItem("access_token", access_token);
      if (decodedUser.role) localStorage.setItem("role", decodedUser.role);
      setupLogoutTimer(decodedUser); // <-- setup timer mới
    } catch (error) {
      throw error;
    }
  };

  // Khi logout hoặc token lỗi, clear luôn timeout
  const signout = () => {
    setUser(null);
    localStorage.removeItem("access_token");
    localStorage.removeItem("role");
    if (logoutTimeout.current) clearTimeout(logoutTimeout.current);
    window.location.href = "/";
  };

  // Khi reload app: set lại timeout nếu có token
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        if (decodedUser.exp && decodedUser.exp * 1000 < Date.now()) {
          signout();
        } else {
          setUser(decodedUser);
          if (decodedUser.role) localStorage.setItem("role", decodedUser.role);
          setupLogoutTimer(decodedUser); // <-- set lại timer
        }
      } catch (error) {
        signout();
      }
    }
    // Clear timeout khi unmount
    return () => {
      if (logoutTimeout.current) clearTimeout(logoutTimeout.current);
    };
    // eslint-disable-next-line
  }, []);

  const signup = async (username, email, password) => {
    try {
      const response = await apiService.post("/api/v1/auth/register", {
        username,
        email,
        password,
      });
      return response;
    } catch (error) {
      throw error;
    }
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
        if (logoutTimeout.current) clearTimeout(logoutTimeout.current);
        return false;
      }
      return true;
    } catch (error) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("role");
      setUser(null);
      if (logoutTimeout.current) clearTimeout(logoutTimeout.current);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, signup, signin, signout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
