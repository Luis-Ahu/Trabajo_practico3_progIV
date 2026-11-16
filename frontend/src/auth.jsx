import { createContext, useCallback, useContext, useState } from "react";

// Contexto para compartir el estado de autenticacion
const AuthContext = createContext(null);

// Hook personalizado para acceder al contexto de auth
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);

  const login = useCallback(async (email, contraseña) => {
    setError(null);
    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, contraseña }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const session = await response.json();
      setToken(session.token);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false };
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setError(null);
  }, []);

  const fetchAuth = useCallback(
    async (url, options = {}) => {
      if (!token) {
        throw new Error("No esta iniciada la session");
      }

      const response = await fetch(url, {
        ...options,
        headers: { ...options.headers, Authorization: `Bearer ${token}` },
      });

      // Token vencido o invalido: se cierra la sesion
      if (response.status === 401) {
        logout();
      }

      return response;
    },
    [token, logout],
  );

  return (
    <AuthContext.Provider
      value={{
        token,
        error,
        isAuthenticated: !!token,
        login,
        logout,
        fetchAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};