import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./ResetPassword.css";  // Import the CSS file

const ResetPassword = () => {
  const { token } = useParams(); // Extract token from the URL
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await axios.post(`http://localhost:8000/api/auth/reset-password/${token}`, { password });
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  useEffect(() => {
    let timer;
    if (message) {
      // Timer to redirect after success message
      timer = setTimeout(() => {
        navigate('/login'); // Redirect to login after 2 seconds
      }, 2000);
    }

    return () => clearTimeout(timer); // Cleanup the timer if the component unmounts or message changes
  }, [message, navigate]);
  return (
    <div className="reset-password-container">
      <div className="reset-password-box">
        <h2 className="reset-password-title">Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              id="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="submit-button"
          >
            Reset Password
          </button>
        </form>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;