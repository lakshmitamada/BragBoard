import { useState } from "react";
import { api } from "../../src/api";
import Navbar from "./Navbar";
import "../styles/Login.scss";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee"); // default role
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", { email, password, role });
      console.log("Login response:", res.data);

      // Store tokens
      localStorage.setItem("access_token", res.data.access_token);
      localStorage.setItem("refresh_token", res.data.refresh_token);
      localStorage.setItem("role", role);
      localStorage.setItem("accessToken", res.data.access_token);

      // Store user info if available
      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        localStorage.setItem("userName", res.data.user.name || res.data.user.username);
        localStorage.setItem("userDepartment", res.data.user.department);
      }

      alert(`${role.charAt(0).toUpperCase() + role.slice(1)} logged in successfully!`);

      // Redirect based on role
      if (role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/employee/dashboard");
      }

    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      const errorMessage = err.response?.data?.detail || "Login failed. Please check your credentials.";
      alert(errorMessage);
    }
  };


  return (
    <>
      <Navbar />
      <div className="login-container">
        <h1>Login</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Role Selection Buttons */}
        <div className="role-selection">
          <button
            type="button"
            className={role === "employee" ? "active" : ""}
            onClick={() => setRole("employee")}
          >
            Employee
          </button>
          <button
            type="button"
            className={role === "admin" ? "active" : ""}
            onClick={() => setRole("admin")}
          >
            Admin
          </button>
        </div>

        <button onClick={handleLogin} className="submit-btn">Login</button>
      </div>
    </>
  );
}
