import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { StyledWrapper } from "../../styles/RegisterStyled";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const Register = ({ onRegisterSuccess, onSwitchToLogin }) => {
  const { signup } = useAuth();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email)) return false;
    const allowedDomains = [
      "gmail.com",
      "hotmail.com",
      "yahoo.com",
      "outlook.com",
      "protonmail.com",
      "icloud.com",
      "aol.com",
      "live.com",
      "msn.com",
    ];
    const domain = email.split("@")[1]?.toLowerCase();
    if (!allowedDomains.some((d) => domain?.endsWith(d))) return false;
    return true;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signup(form.username, form.email, form.password);
      if (onRegisterSuccess) onRegisterSuccess();
    } catch (err) {
      // Lấy message, chuyển về lowercase để so sánh
      let msg = (err?.message || "").toLowerCase();
      if (!msg || msg === "lỗi không xác định") {
        setError("Registration failed");
      } else {
        setError(err.message);
      }
    }
    setLoading(false);
  };

  return (
    <StyledWrapper>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-title">
          <span>Sign up to your</span>
        </div>
        <div className="title-2">
          <span>Tracing</span>
        </div>

        <div className="input-container">
          <input
            className="input-username"
            type="text"
            name="username"
            placeholder="Enter username"
            value={form.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-container">
          <div className="input-container">
            <input
              className="input-email"
              type="email"
              name="email"
              placeholder="Enter email"
              value={form.email}
              onChange={handleChange}
              required
            />
            {form.email && !isValidEmail(form.email) && (
              <p style={{ color: "orange", marginTop: 4, fontSize: 13 }}>
                Please enter a valid email (gmail, hotmail, yahoo, outlook,
                ...).
              </p>
            )}
          </div>
        </div>
        <div className="input-container" style={{ position: "relative" }}>
          <div className="input-container" style={{ position: "relative" }}>
            <input
              className="input-pwd"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Choose a password"
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
          {form.password && form.password.length < 7 && (
            <p style={{ color: "orange", marginTop: 4, fontSize: 13 }}>
              Password must be at least 7 characters.
            </p>
          )}
        </div>

        <section className="bg-stars">
          <span className="star" />
          <span className="star" />
          <span className="star" />
          <span className="star" />
        </section>

        {error && <p style={{ color: "red", marginTop: 8 }}>{error}</p>}

        <button
          type="submit"
          className="submit"
          disabled={
            loading ||
            !form.username ||
            !form.email ||
            !isValidEmail(form.email) ||
            !form.password ||
            form.password.length < 7
          }
          style={{
            background:
              loading ||
              !form.username ||
              !form.email ||
              !isValidEmail(form.email) ||
              !form.password ||
              form.password.length < 7
                ? "#d1d5db"
                : "#22223b",
            color:
              loading ||
              !form.username ||
              !form.email ||
              !isValidEmail(form.email) ||
              !form.password ||
              form.password.length < 7
                ? "#6b7280"
                : "#fff",
            cursor:
              loading ||
              !form.username ||
              !form.email ||
              !isValidEmail(form.email) ||
              !form.password ||
              form.password.length < 7
                ? "not-allowed"
                : "pointer",
            border: "none",
            borderRadius: 6,
            padding: "12px 0",
            width: "100%",
            fontWeight: 600,
            fontSize: 18,
            marginTop: 12,
            transition: "all 0.2s",
            boxShadow: "none",
            outline: "none",
          }}
        >
          <span className="sign-text">
            {loading ? "Registering..." : "Sign Up"}
          </span>
        </button>

        <p className="signup-link">
          Have account?
          <a
            href="#"
            className="up"
            onClick={(e) => {
              e.preventDefault();
              onSwitchToLogin?.();
            }}
          >
            Sign in!
          </a>
        </p>
      </form>
    </StyledWrapper>
  );
};

export default Register;
