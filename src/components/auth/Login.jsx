import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { StyledWrapper } from "../../styles/LoginStyled";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";

const Login = ({ onSwitchToRegister, onLoginSuccess }) => {
  const { signin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signin(form.email, form.password);
      onLoginSuccess?.();
      navigate("/", { replace: true });
      setTimeout(() => window.location.reload(), 100);
    } catch (err) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledWrapper>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-title">
          <span>Sign in to your</span>
        </div>
        <div className="title-2">
          <span>Tracing</span>
        </div>

        <div className="input-container">
          <input
            className="input-mail"
            type="text"
            name="email"
            placeholder="Enter Email"
            value={form.email}
            onChange={handleChange}
            required
            autoFocus
          />
        </div>

        <section className="bg-stars">
          <span className="star" />
          <span className="star" />
          <span className="star" />
          <span className="star" />
        </section>

        <div className="input-container" style={{ position: "relative" }}>
          <input
            className="input-pwd"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter your passphrase"
            value={form.password}
            onChange={handleChange}
            required
            style={{ paddingRight: 40 }}
          />
          <IconButton
            onClick={() => setShowPassword((v) => !v)}
            tabIndex={-1}
            style={{
              position: "absolute",
              right: 6,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 2,
              padding: 4,
            }}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <VisibilityOff sx={{ color: "#6b7280" }} />
            ) : (
              <Visibility sx={{ color: "#6b7280" }} />
            )}
          </IconButton>
        </div>

        {error && <p style={{ color: "red", marginTop: 8 }}>{error}</p>}

        <button type="submit" className="submit" disabled={loading}>
          <span className="sign-text">
            {loading ? "Signing in..." : "Sign in"}
          </span>
        </button>

        <p className="signup-link">
          No account?
          <a
            href="#"
            className="up"
            onClick={(e) => {
              e.preventDefault();
              onSwitchToRegister?.();
            }}
          >
            Sign up!
          </a>
        </p>
      </form>
    </StyledWrapper>
  );
};

export default Login;
