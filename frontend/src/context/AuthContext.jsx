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
      console.log("Step 1");

      const permission = await requestNotificationPermission();

      console.log("Step 2:", permission);

      if (permission !== "granted") {
        console.log("Permission not granted");
        return;
      }

      const token = await generateFCMToken();

      console.log("Step 3:", token);

      if (!token) {
        console.log("No token received");
        return;
      }

      console.log("Step 4");

      await notificationService.registerDeviceToken(token);

      console.log("Step 5");
    } catch (error) {
      console.error(error);
    }
  };

  const loginUser = async (data) => {
    console.log("Login successful");

    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);
    localStorage.setItem("user", JSON.stringify(data.user));

    setUser(data.user);

    console.log("Starting notification initialization");

    void initializeNotifications();
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
