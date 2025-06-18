import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { StyledWrapper } from "../../styles/RegisterStyled";

const Register = ({ onRegisterSuccess, onSwitchToLogin }) => {
  const { signup } = useAuth();
  const [form, setForm] = useState({
    username: "",
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
      await signup(form.username, form.email, form.password);
      if (onRegisterSuccess) onRegisterSuccess();
    } catch (err) {
      setError(err.message || "Registration failed");
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
          <input
            className="input-email"
            type="email"
            name="email"
            placeholder="Enter email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-container">
          <input
            className="input-pwd"
            type="password"
            name="password"
            placeholder="Choose a password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <section className="bg-stars">
          <span className="star" />
          <span className="star" />
          <span className="star" />
          <span className="star" />
        </section>

        {error && <p style={{ color: "red", marginTop: 8 }}>{error}</p>}

        <button type="submit" className="submit" disabled={loading}>
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
