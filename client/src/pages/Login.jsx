import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../App.css";


export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    const res = await axios.post("https://military-assets-1.onrender.com/api/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    nav("/dashboard");
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Military Assets Portal</h2>
        <p>Secure Login</p>

        <input
          placeholder="Email"
          onChange={e => setEmail(e.target.value)}
        />
        <input
          placeholder="Password"
          type="password"
          onChange={e => setPassword(e.target.value)}
        />

        <button onClick={login}>Login</button>
      </div>
    </div>
  );
}
