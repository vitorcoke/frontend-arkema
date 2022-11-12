import { createContext, ReactNode, useContext, useState } from "react";
import { api } from "../service";
import { User } from "../types/user.type";
import { destroyCookie, setCookie } from "nookies";
import Router from "next/router";

type SingData = {
  username: string;
  password: string;
};

type AuthContextProviderProps = {
  children: ReactNode;
};

type AuthContextProps = {
  singIn: ({ username, password }: SingData) => Promise<void>;
  singOut: () => void;
  user: User | null;
};

const authContext = createContext({} as AuthContextProps);

export const useAuthContext = () => {
  return useContext(authContext);
};

const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  const singIn = async ({ username, password }: SingData) => {
    const { data } = await api.post("/auth/login", { username, password });

    setCookie(undefined, "token-arkema", data.token);

    setUser(data.user);

    api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

    Router.push("/dashboard");
  };

  const singOut = () => {
    setUser(null);
    destroyCookie(undefined, "token-arkema");
    Router.push("/");
  };

  return (
    <authContext.Provider value={{ singIn, user, singOut }}>
      {children}
    </authContext.Provider>
  );
};

export default AuthContextProvider;
