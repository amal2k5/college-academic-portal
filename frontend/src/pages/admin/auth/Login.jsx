import { useState, useContext } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthContext } from "../../../context/AuthContext";
import { login } from "../../../services/authService";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const token = localStorage.getItem("access");
  const role = localStorage.getItem("role");

  // Bug 2 Fix: Added STUDENT to auto-redirect
  if (token) {
    if (role === "PLATFORM_ADMIN") {
      return <Navigate to="/admin" replace />;
    }

    if (role === "COLLEGE_ADMIN") {
      return <Navigate to="/college-admin" replace />;
    }

    if (role === "HOD") {
      return <Navigate to="/hod" replace />;
    }

    if (role === "STUDENT") {
      return <Navigate to="/student" replace />;
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await login(email, password);
      console.log(data);

      loginUser(data);

     
      if (data.role === "PLATFORM_ADMIN") {
        toast.success(`Welcome back, ${data.email || "Admin"}!`);
        navigate("/admin", { replace: true });
      } else if (data.role === "COLLEGE_ADMIN") {
        toast.success(`Welcome back, ${data.email || "College Admin"}!`);
        navigate("/college-admin", { replace: true });
      } else if (data.role === "HOD") {
        toast.success(`Welcome back, ${data.email || "HOD"}!`);
        navigate("/hod", { replace: true });
      } else if (data.role === "STUDENT") {
        toast.success(`Welcome back, ${data.email || "Student"}!`);
        navigate("/student", { replace: true });
      } else {
        toast.warning("Unknown role. Please contact support.");
      }
    } catch (error) {
      console.log(error.response?.data);
      

      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.detail || 
                          "Invalid email or password. Please try again.";
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-xl shadow-slate-100 border border-slate-200/60">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Please enter your credentials to access your account
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email-address"
                className="block text-sm font-semibold text-slate-700 mb-1.5"
              >
                Email Address
              </label>

              <input
                id="email-address"
                name="email"
                type="email"
                required
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 placeholder-slate-400 shadow-sm transition duration-150 ease-in-out focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/10 sm:text-sm disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-slate-700 mb-1.5"
              >
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 placeholder-slate-400 shadow-sm transition duration-150 ease-in-out focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/10 sm:text-sm disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 active:bg-indigo-700 transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;