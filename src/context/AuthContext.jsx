import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import apiService from "../api/apiService";
import { jwtDecode } from "jwt-decode";
import PropTypes from "prop-types";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const access_token = localStorage.getItem("access_token");
    if (!access_token) return null;
    try {
      const decodedUser = jwtDecode(access_token);

      // Nếu access token hết hạn, return null, KHÔNG xóa token ở đây
      if (decodedUser.exp * 1000 < Date.now()) {
        return null;
      }
      return decodedUser;
    } catch (e) {
      // Chỉ xóa token khi thực sự không decode được (token lỗi format)
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("role");
      return null;
    }
  });

  // Đăng ký tài khoản
  const signup = async (username, email, password) => {
    try {
      const response = await apiService.post("/api/v1/auth/register", {
        username,
        email,
        password,
      });
      console.log("Đăng ký thành công:", response);

      return response;
    } catch (error) {
      console.error("Đăng ký thất bại:", error);
      throw new Error(error?.response?.data?.message || "Registration failed");
    }
  };

  const signin = async (email, password) => {
    try {
      const response = await apiService.post("/api/v1/auth/login", {
        email,
        password,
      });

      const { access_token, refresh_token, role } = response.data || response;

      if (!access_token || typeof access_token !== "string") {
        throw new Error("access_token không hợp lệ");
      }
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);
      localStorage.setItem("role", role);

      // Cập nhật user vào state
      const decodedUser = jwtDecode(access_token);
      setUser(decodedUser);
      return decodedUser;
    } catch (error) {
      console.error("Đăng nhập thất bại:", error);
      throw new Error(error?.response?.data?.message || "Login failed");
    }
  };

  // Đăng xuất
  const signout = () => {
    setUser(null);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  const refreshAccessToken = useCallback(async () => {
    const refresh_token = localStorage.getItem("refresh_token");
    if (!refresh_token) {
      signout();
      return false;
    }
    try {
      const response = await apiService.post("/api/v1/auth/refresh", {
        refresh_token,
      });
      const { access_token } = response;
      localStorage.setItem("access_token", access_token);
      setUser(jwtDecode(access_token));
      return true;
    } catch {
      signout();
      return false;
    }
  }, []);

  // Kiểm tra đăng nhập, tự refresh nếu access_token hết hạn
  const isAuthenticated = useCallback(async () => {
    const access_token = localStorage.getItem("access_token");
    if (!access_token) return false;
    try {
      const decodedUser = jwtDecode(access_token);
      if (decodedUser.exp * 1000 < Date.now()) {
        // Hết hạn, thử refresh
        return await refreshAccessToken();
      }
      return true;
    } catch {
      signout();
      return false;
    }
  }, [refreshAccessToken]);

  // Khi load lại app, kiểm tra & refresh nếu cần
  useEffect(() => {
    const checkToken = async () => {
      const access_token = localStorage.getItem("access_token");
      if (access_token) {
        try {
          const decodedUser = jwtDecode(access_token);
          if (decodedUser.exp * 1000 > Date.now()) {
            setUser(decodedUser);
          } else {
            await refreshAccessToken();
          }
        } catch {
          signout();
        }
      }
    };
    checkToken();
    // eslint-disable-next-line
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        signup,
        signin,
        signout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
