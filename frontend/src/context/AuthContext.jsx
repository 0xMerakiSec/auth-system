import { createContext, useContext, useState, useEffect } from "react";

import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const iniAuth = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          const response = await axios.get("/api/v1/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(response.data.user);
        } catch (error) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        }
      }
      setLoading(false);
    };
    iniAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post("/api/v1/auth/login", {
        email,
        password,
      });
      const { user, accessToken, refreshToken } = response.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      return user;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      await axios.post(
        "/api/v1/auth/logout",
        { refreshToken },
        {
          header: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUser(null);
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post(`/api/v1/auth/register`, userData);
      const { user, accessToken, refreshToken } = response.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      setUser(user);
    } catch (error) {
      throw new Error(error.response?.data?.message || " Registration failed");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
