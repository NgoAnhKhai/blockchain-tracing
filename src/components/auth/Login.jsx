import React from "react";
import styled from "styled-components";

const Login = () => {
  return (
    <StyledWrapper>
      <form className="form">
        <div className="form-title">
          <span>sign in to your</span>
        </div>
        <div className="title-2">
          <span>Tracing</span>
        </div>

        {/* Wallet Address */}
        <div className="input-container">
          <input
            className="input-mail"
            type="text"
            placeholder="Enter wallet address"
          />
        </div>

        {/* Shooting stars */}
        <section className="bg-stars">
          <span className="star" />
          <span className="star" />
          <span className="star" />
          <span className="star" />
        </section>

        {/* Passphrase */}
        <div className="input-container">
          <input
            className="input-pwd"
            type="password"
            placeholder="Enter your passphrase"
          />
        </div>

        <button type="submit" className="submit">
          <span className="sign-text">Sign in</span>
        </button>

        <p className="signup-link">
          No account?
          <a href="#" className="up">
            Sign up!
          </a>
        </p>
      </form>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .form {
    position: relative;
    padding: 2.2rem;
    max-width: 350px;
    background: linear-gradient(
        14deg,
        rgba(2, 0, 36, 0.8) 0%,
        rgba(24, 24, 65, 0.7) 66%,
        rgb(20, 76, 99) 100%
      ),
      radial-gradient(
        circle,
        rgba(2, 0, 36, 0.5) 0%,
        rgba(32, 15, 53, 0.2) 65%,
        rgba(14, 29, 28, 0.9) 100%
      );
    border: 2px solid #fff;
    box-shadow: rgba(0, 212, 255, 0.8) 0px 0px 50px -15px;
    overflow: hidden;
    z-index: 1;
  }

  .input-container {
    margin-top: 1rem;
  }

  .input-container input {
    width: 100%;
    padding: 6px;
    font-size: 0.875rem;
    border: 2px solid #fff;
    border-radius: 4px;
    background: #fff;
    font-family: monospace;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

    /* placeholder style */
    &::placeholder {
      color: #666;
      opacity: 1;
    }
  }

  .submit {
    margin-top: 1.5rem;
    width: 100%;
    padding: 8px;
    background-color: #c0c0c0;
    color: #fff;
    text-transform: uppercase;
    font-family: monospace;
    font-weight: 500;
    border: 2px solid #fff;
    border-radius: 4px;
    position: relative;
    overflow: hidden;
    cursor: pointer;
  }
  .submit:hover {
    box-shadow: 4px 5px 17px -4px #fff;
  }
  .submit::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    width: 0;
    height: 85%;
    background: #fff;
    opacity: 0;
    transform: skewX(-20deg) translateY(-50%);
  }
  .submit:hover::before {
    animation: shine 0.5s linear;
  }
  @keyframes shine {
    0% {
      opacity: 0;
      left: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      left: 100%;
    }
  }

  .signup-link {
    margin-top: 1rem;
    text-align: center;
    font-size: 0.875rem;
    color: #c0c0c0;
    font-family: monospace;
  }
  .signup-link .up {
    margin-left: 4px;
    color: #fff;
    text-decoration: none;
  }
  .signup-link .up:hover {
    text-decoration: underline;
  }

  .form-title {
    font-size: 1.25rem;
    text-align: center;
    font-family: monospace;
    font-weight: 600;
    color: #fff;
    text-shadow: 1px 1px rgba(0, 0, 0, 0.7);
  }
  .form-title span {
    animation: flicker 2s linear infinite both;
  }
  @keyframes flicker {
    0%,
    100% {
      opacity: 1;
    }
    42% {
      opacity: 0;
    }
    43% {
      opacity: 1;
    }
    48% {
      opacity: 0;
    }
    49% {
      opacity: 1;
    }
  }

  .title-2 {
    margin-top: -0.5rem;
    font-size: 2.1rem;
    text-align: center;
    font-family: Arial, Helvetica, sans-serif;
    font-weight: 800;
    color: transparent;
    letter-spacing: 0.2rem;
    -webkit-text-stroke: #fff 0.1rem;
    text-shadow: 0 0 16px #cecece;
  }
  .title-2 span::before,
  .title-2 span::after {
    content: "—";
  }

  .bg-stars {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    animation: bg-scale 50s linear infinite;
  }
  @keyframes bg-scale {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.2);
    }
  }

  .star {
    position: absolute;
    width: 4px;
    height: 4px;
    background: #fff;
    border-radius: 50%;
    box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.1),
      0 0 0 8px rgba(255, 255, 255, 0.1), 0 0 20px rgba(255, 255, 255, 0.1);
    animation: shoot 3s linear infinite;
  }
  .star::before {
    content: "";
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 300px;
    height: 1px;
    background: linear-gradient(90deg, #fff, transparent);
  }
  @keyframes shoot {
    0% {
      transform: rotate(315deg) translateX(0);
      opacity: 1;
    }
    70% {
      opacity: 1;
    }
    100% {
      transform: rotate(315deg) translateX(-1000px);
      opacity: 0;
    }
  }
  .star:nth-child(1) {
    top: 0;
    right: 0;
    animation-delay: 0s;
  }
  .star:nth-child(2) {
    top: 0;
    right: 100px;
    animation-delay: 0.2s;
  }
  .star:nth-child(3) {
    top: 0;
    right: 220px;
    animation-delay: 2.75s;
  }
  .star:nth-child(4) {
    top: 0;
    right: -220px;
    animation-delay: 1.6s;
  }
`;

export default Login;
