import { createContext, useContext, useState } from "react";
import { registerCustomer, loginCustomer } from "../api/customerAuth";

const CustomerAuthContext = createContext(null);
const TOKEN_KEY = "customer_token";
const USER_KEY = "customer_user";

function loadInitialUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function CustomerAuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(loadInitialUser);

  const persist = (token, user) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    setToken(token);
    setUser(user);
  };

  const register = async (data) => {
    const { token, user } = await registerCustomer(data);
    persist(token, user);
  };

  const login = async (email, password) => {
    const { token, user } = await loginCustomer(email, password);
    persist(token, user);
  };

  const updateUser = (user) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  };

  return (
    <CustomerAuthContext.Provider
      value={{ token, user, isAuthenticated: !!token, register, login, updateUser, logout }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  const ctx = useContext(CustomerAuthContext);
  if (!ctx) throw new Error("useCustomerAuth debe usarse dentro de <CustomerAuthProvider>");
  return ctx;
}
