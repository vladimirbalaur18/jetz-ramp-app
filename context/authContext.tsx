import App from "@/app/(createFlight)/(tabs)/chargeNote";
import { IAppData } from "@/models/AppData";
import { useQuery, useRealm } from "@realm/react";
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  ReactElement,
} from "react";
import { Snackbar } from "react-native-paper";

type IAuthContext = {
  login: (masterPassword: string) => Promise<{
    loginStatus: "success" | "error";
  } | void>;
  logout: () => void;
  isAuthenticated: boolean;
};
const AuthContext = createContext<IAuthContext>({
  isAuthenticated: false,
  login: (masterPassword: string) => Promise.reject(),
  logout: () => {},
});

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [AppData] = useQuery<IAppData>("AppData");

  const login = (masterPassword: string) =>
    new Promise<{ loginStatus: "success" | "error" }>((resolve, reject) => {
      console.log("Master password", AppData.masterPassword);

      if (masterPassword === AppData.masterPassword) {
        setIsAuthenticated(true);
        resolve({ loginStatus: "success" });
      } else {
        reject({ loginStatus: "error" });
      }
    });
  const logout = () => {
    console.log("Logging out user");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
