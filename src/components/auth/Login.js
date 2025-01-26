import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import env from "react-dotenv";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    // Redirect to /home if user is already logged in
    const token = localStorage.getItem("authToken");
    if (token) {
      navigate("/home");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError(false);
    try {
      const response = await axios.post(
        `${env.BASE_URL}/api/auth/login`, // Use `https` in production
        formData
      );

      console.log(response.data);
      if (response.data?.token) {
        // Store the token securely (localStorage for now)
        localStorage.setItem("authToken", response.data.token);
        setMessage("Login successful!");
        navigate("/home"); // Redirect to Home page
      }
    } catch (error) {
      setError(true);
      setMessage(
        error.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          aria-label="Email"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          aria-label="Password"
        />
        <button type="submit">Login</button>
        {message && (
          <p className={`message ${error ? "error" : "success"}`}>
            {message}
          </p>
        )}
        <div className="login-link">
          <p>
            Don't have an account? <Link to="/signup">Create a new account</Link>
          </p>
        </div>
        <div className="login-link">
          <p>
            Forgot your password? <Link to="/forgot/password">Reset it here</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;