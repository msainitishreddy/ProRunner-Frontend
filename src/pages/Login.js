import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const getUserFromToken = (token) => {
    if (!token) {
      return null;
    }
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.userId;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginRequest = {
      username,
      password,
    };

    try {
      const response = await fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginRequest),
      });

      if (response.ok) {
        const data = await response.text();
        const token = data.replace("Bearer ", "").trim();
        localStorage.setItem("authToken", token);

        const userId = getUserFromToken(token);
        localStorage.setItem("userId", userId);
        console.log("userId: ", userId);

        alert("Login successful!");
        navigate("/");
      } else {
        const errorData = await response.text();
        setErrorMessage(errorData || "Login failed. Please try again.");
      }
    } catch (error) {
      setErrorMessage("An error occurred during login. Please try again.");
      console.error("Login error:", error);
    }
  };

  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
    padding: "0 15px",
    margin: "3.5rem 0",
  };

  const formStyle = {
    margin: "3.5rem 0",
    padding: "2rem",
    maxWidth: "600px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    boxSizing: "border-box",
  };

  const fieldStyle = {
    width: "100%",
    margin: "0.5rem 0",
  };

  const inputStyle = {
    padding: "0.75rem",
    margin: "10px 0",
    width: "100%",
    boxSizing: "border-box",
    borderRadius: "5px",
    border: "1px solid #ccc",
  };

  const LoginButtonStyle = {
    padding: "10px 20px",
    backgroundColor: "#333",
    color: "white",
    border: "none",
    cursor: "pointer",
    width: "100%",
    borderRadius: "5px",
  };

  const eyeIconStyle = {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    fontSize: "1.5rem",
    opacity: 0.6,
    transition: "opacity 0.3s",
  };

  const redirectLinkStyle = {
    marginTop: "10px",
    textAlign: "center",
  };

  const responsiveFormStyle = {
    "@media (max-width: 768px)": {
      width: "90%",
    },

    "@media (max-width: 480px)": {
      width: "100%",
      padding: "1rem",
    },
  };

  const combinedFormStyle = {
    ...formStyle,
    ...(window.innerWidth <= 768
      ? responsiveFormStyle["@media (max-width: 768px)"]
      : {}),
    ...(window.innerWidth <= 480
      ? responsiveFormStyle["@media (max-width: 480px)"]
      : {}),
  };

  return (
    <div style={containerStyle}>
      <div style={combinedFormStyle}>
        <h2>Please login</h2>
        <form onSubmit={handleSubmit}>
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

          <div>
            <label htmlFor="username" style={fieldStyle}>
              Username:{" "}
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              style={inputStyle}
              required
            />
          </div>
          <div>
            <label htmlFor="password" style={fieldStyle}>
              Password:{" "}
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={isPasswordVisible ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                style={inputStyle}
                required
              />
              <span
                style={eyeIconStyle}
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          <button type="submit" style={LoginButtonStyle}>
            Login
          </button>
        </form>
        <div style={redirectLinkStyle}>
          <p>
            New user?{" "}
            <Link to="/register" style={redirectLinkStyle}>
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
