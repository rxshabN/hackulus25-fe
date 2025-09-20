"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { setToken, getToken, removeToken } from "@/lib/auth";
import { toast } from "sonner";
import { whitelist } from "@/lib/data";
import { jwtDecode } from "jwt-decode";

interface User {
  user_id: number;
  email: string;
  role: "user" | "admin" | "judge" | "superadmin";
  team_id: number;
  is_leader: boolean;
  name: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(getToken());
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const verifyUser = async () => {
      const storedToken = getToken();
      if (storedToken) {
        try {
          const decodedToken: { role?: string } = jwtDecode(storedToken);

          let response;
          if (
            decodedToken.role === "judge" ||
            decodedToken.role === "superadmin"
          ) {
            // If it's an admin, call the admin profile endpoint
            response = await api.get("/admin/me");
            setUser(response.data.user);
            setIsAdmin(true);
          } else {
            // Otherwise, call the user endpoint
            response = await api.get("/users/home");
            setUser(response.data.user);
            setIsAdmin(false);
          }
        } catch (error) {
          console.error("Session expired or token is invalid.", error);
          removeToken();
          setTokenState(null);
          setUser(null);
          setIsAdmin(false);
        }
      }
      setIsLoading(false);
    };
    verifyUser();
  }, []);

  const login = async (email: string, password: string) => {
    const isAttemptingAdminLogin = whitelist.includes(email);
    const loginEndpoint = isAttemptingAdminLogin
      ? "/auth/admin/login"
      : "/auth/user/login";

    try {
      const response = await api.post(loginEndpoint, { email, password });
      const { token: newToken } = response.data;

      setToken(newToken);
      setTokenState(newToken);

      if (isAttemptingAdminLogin) {
        const adminProfileRes = await api.get("/admin/me");
        setUser(adminProfileRes.data.user);
        setIsAdmin(true);
        router.push("/admin");
      } else {
        const userProfileRes = await api.get("/users/home");
        setUser(userProfileRes.data.user);
        setIsAdmin(false);
        router.push("/dashboard");
      }
      toast.success("Login Successful!");
    } catch (error) {
      const errorMessage =
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        (error as any).response?.data?.message ||
        "Login failed. Please try again.";
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      toast.error("Failed to blacklist token on backend");
      console.error("Logout error:", error);
    } finally {
      removeToken();
      setTokenState(null);
      setUser(null);
      setIsAdmin(false);
      toast.info("You have been logged out.");
      router.push("/");
    }
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user,
    isLoading,
    isAdmin,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
