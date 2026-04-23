import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/login", form);

      // STORE TOKEN
      localStorage.setItem("token", res.data.token);

      alert("Login Successful");

      // REDIRECT
      navigate("/dashboard");

    } catch (error) {
      alert(error.response?.data?.message || "Error");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-2"
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />

        <input
          className="form-control mb-2"
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />

        <button className="btn btn-success">Login</button>
      </form>

      <p className="mt-3">
        New user? <Link to="/">Register</Link>
      </p>
    </div>
  );
}

export default Login;