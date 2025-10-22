import "../App.css";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { api_url } from "../../config";

const defaultEmail = "admin@example.com";
const defaultPassword = "admin123";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ handleLogin — returns success or failure
  const handleLogin = async (api_url, email, password) => {
    try {
      const response = await fetch(`${api_url}/admin/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Invalid credentials",
        };
      } else {
        localStorage.setItem("auth_token", data.token);
        navigate("/Dashboard");

        return {
          success: true,
          token: data.token,
        };
      }
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: "Network error, please try again later.",
      };
    }
  };

  // handleSubmit — combines frontend validation + API login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setEmailError(false);
    setPasswordError(false);
    setLoading(true);

    // Frontend check (for hardcoded default credentials)
    if (email === defaultEmail && password === defaultPassword) {
      handleLogin(api_url, email, password);
      console.log("Successful login checked from frontend!");
      setLoading(false);

      return;
    }

    if (email !== defaultEmail) {
      setEmailError(true);
      setErrorMessage("Invalid email address");
      setLoading(false);
      return;
    }

    if (password !== defaultPassword) {
      setPasswordError(true);
      setErrorMessage("Incorrect password");
      setLoading(false);
      return;
    }

    setLoading(false);
  };

  // Clear errors when typing
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (emailError || errorMessage) {
      setEmailError(false);
      setErrorMessage("");
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (passwordError || errorMessage) {
      setPasswordError(false);
      setErrorMessage("");
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form className="App" onSubmit={handleSubmit}>
        <div className="main_box">
          <div className="input-wrapper">
            <FaEnvelope className="icon" />
            <input
              id="email"
              className={`input_box email ${emailError ? "error" : ""}`}
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={handleEmailChange}
            />
          </div>

          <div className="input-wrapper">
            <FaLock className="icon" />
            <input
              id="password"
              className={`input_box password ${passwordError ? "error" : ""}`}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              value={password}
              onChange={handlePasswordChange}
            />
            <span
              className="toggle-icon"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>

          <input
            className="submit_btn"
            type="submit"
            disabled={loading}
            value={loading ? "Logging in..." : "Login"}
          />
        </div>

        {errorMessage && <p className="error-text">{errorMessage}</p>}
      </form>
    </div>
  );
}
