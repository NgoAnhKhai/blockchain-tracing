import React, { useState } from "react";

import { useAuth } from "../../context/AuthContext";
import { StyledWrapper } from "../../styles/LoginStyled";

const Login = ({ onSwitchToRegister, onLoginSuccess }) => {
  const { signin } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
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
    } catch (err) {
      setError(err?.message || "Login failed");
    }
    setLoading(false);
    onLoginSuccess?.();
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

        <div className="input-container">
          <input
            className="input-pwd"
            type="password"
            name="password"
            placeholder="Enter your passphrase"
            value={form.password}
            onChange={handleChange}
            required
          />
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
