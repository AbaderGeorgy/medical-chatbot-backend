import React, { useState } from "react";
import "../styles/ForgetPassword.css"; 

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [messages, setMessages] = useState({});

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => {
    return password.length >= 8 &&
           /[A-Z]/.test(password) &&
           /[a-z]/.test(password) &&
           /\d/.test(password);
  };

  const handleSendCode = () => {
    setMessages({});
    if (!email) return setMessages({ email: "Please enter your email address" });
    if (!validateEmail(email)) return setMessages({ email: "Please enter a valid email address" });

    setMessages({ emailSuccess: "Verification code sent successfully!" });
    setTimeout(() => setStep(2), 1000);
  };

  const handleVerifyCode = () => {
    setMessages({});
    if (!code) return setMessages({ code: "Please enter the verification code" });
    if (code.length !== 6 || !/^\d+$/.test(code)) return setMessages({ code: "Verification code must be 6 digits" });

    setMessages({ codeSuccess: "Verification code is correct!" });
    setTimeout(() => setStep(3), 1000);
  };

  const handleResetPassword = () => {
    setMessages({});
    if (!password) return setMessages({ password: "Please enter a new password" });
    if (!validatePassword(password)) return setMessages({ password: "Password does not meet the required criteria" });

    setMessages({ passwordSuccess: "Password has been reset successfully!" });
    setTimeout(() => window.location.href = "/home", 1500);
  };

  return (
    <div className="fp-container">
      <div className="fp-steps">
        {[1, 2, 3].map((s) => (
          <div key={s} className={`fp-step ${step === s ? "active" : ""}`}>{s}</div>
        ))}
      </div>

      <div className="fp-header">
        <h1>Forgot Password</h1>
        <p>Follow the steps below to reset your password</p>
      </div>

      {step === 1 && (
        <div className="fp-step-content">
          <div className="fp-form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={messages.email ? "error" : messages.emailSuccess ? "success" : ""}
            />
            {messages.email && <div className="error-message">{messages.email}</div>}
            {messages.emailSuccess && <div className="success-message">{messages.emailSuccess}</div>}
          </div>
          <button className="btn" onClick={handleSendCode}>Send Verification Code</button>
        </div>
      )}

      {step === 2 && (
        <div className="fp-step-content">
          <div className="fp-form-group">
            <label>Verification Code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className={messages.code ? "error" : messages.codeSuccess ? "success" : ""}
            />
            {messages.code && <div className="error-message">{messages.code}</div>}
            {messages.codeSuccess && <div className="success-message">{messages.codeSuccess}</div>}
          </div>
          <button className="btn" onClick={handleVerifyCode}>Verify Code</button>
          <button className="btn btn-secondary" onClick={() => setStep(1)}>Back to Email</button>
        </div>
      )}

      {step === 3 && (
        <div className="fp-step-content">
          <div className="fp-form-group">
            <label>New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={messages.password ? "error" : messages.passwordSuccess ? "success" : ""}
            />
            <div className="password-requirements">
              <h4>Password Requirements:</h4>
              <ul className="requirements-list">
                <li>At least 8 characters</li>
                <li>One uppercase letter (A-Z)</li>
                <li>One lowercase letter (a-z)</li>
                <li>One number (0-9)</li>
              </ul>
            </div>
            {messages.password && <div className="error-message">{messages.password}</div>}
            {messages.passwordSuccess && <div className="success-message">{messages.passwordSuccess}</div>}
          </div>
          <button className="btn" onClick={handleResetPassword}>Reset Password</button>
          <button className="btn btn-secondary" onClick={() => setStep(2)}>Back to Code</button>
        </div>
      )}
    </div>
  );
}

export default ForgotPassword;
