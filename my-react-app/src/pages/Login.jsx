import "../App.css";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const defaultEmail = "abc@gmail.com";
const defaultPassword = "admin@123";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    setErrorMessage("");
    setEmailError(false);

    if (email === defaultEmail && password === defaultPassword) {
      navigate("/Dashboard");
    } else if (email != defaultEmail) {
      setEmailError(true);
      setErrorMessage("Invalid email address");
      return;
    } else if (password != defaultPassword) {
      setPasswordError(true);
      setErrorMessage("Incorrect password");
      return;
    } else {
      alert("Please enter correct email and password");
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (emailError) {
      setEmailError(false);
      setErrorMessage("");
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (passwordError) {
      setPasswordError(false);
      setErrorMessage("");
    }
  };

  return (
    <div className="login-container">
      <h1>Login </h1>
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
          <input className="submit_btn" type="submit" />
        </div>
        {errorMessage && <p className="error-text">{errorMessage}</p>}
      </form>
    </div>
  );
}
