import { createContext, useState } from "react";
import { logout } from "../services/authService";
import {
  requestNotificationPermission,
  generateFCMToken,
} from "../firebase/messaging";

import notificationService from "../services/notificationService";

export const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const initializeNotifications = async () => {
    try {
      const permission = await requestNotificationPermission();

      if (permission !== "granted") {
        return;
      }

      const token = await generateFCMToken();

      if (!token) {
        return;
      }

      await notificationService.registerDeviceToken(token);
    } catch (error) {
      console.error(error);
    }
  };

  const loginUser = async (data) => {
    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);
    localStorage.setItem("user", JSON.stringify(data.user));

    setUser(data.user);

    if (data.user?.role === "STUDENT") {
      void initializeNotifications();
    }
  };

  const logoutUser = async () => {
    try {
      const refresh = localStorage.getItem("refresh");

      if (refresh) {
        await logout(refresh);
      }
    } catch (error) {
      console.error("Logout Error:", error);
    } finally {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("user");

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
