import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import axios from "axios";

function SetupPassword() {
  const { token } = useParams();
  console.log("TOKEN FROM URL:", token);

  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await axios.post("http://127.0.0.1:8000/api/auth/setup-password/", {
        token,
        password,
        confirm_password: confirmPassword,
      });

    
      alert("Password set successfully");

      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("role");

      navigate("/login");

      alert("Password set successfully");

      navigate("/login");
    } catch (error) {
      console.log("FULL ERROR:", error.response?.data);

      alert(error.response?.data?.message || "Failed to set password");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="mb-2 text-center text-3xl font-bold">Setup Password</h1>

        <p className="mb-8 text-center text-sm text-slate-500">
          Create your account password
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium">Password</label>

            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Confirm Password
            </label>

            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-lg border px-3 py-2"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white"
          >
            Set Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default SetupPassword;
