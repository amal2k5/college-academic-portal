import { createContext, useState } from "react";
import { logout } from "../services/authService";

export const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(
    localStorage.getItem("role") || null
  );

  const loginUser = (data) => {
    localStorage.setItem(
      "access",
      data.access
    );

    localStorage.setItem(
      "refresh",
      data.refresh
    );

    localStorage.setItem(
      "role",
      data.role
    );

    setUser(data.role);
  };

  const logoutUser = async () => {
    try {
      const refresh =
        localStorage.getItem(
          "refresh"
        );

      if (refresh) {
        await logout(refresh);
      }
    } catch (error) {
      console.error(
        "Logout Error:",
        error
      );
    } finally {
      localStorage.removeItem(
        "access"
      );

      localStorage.removeItem(
        "refresh"
      );

      localStorage.removeItem(
        "role"
      );

      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;