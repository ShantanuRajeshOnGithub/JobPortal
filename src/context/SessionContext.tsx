import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface Session {
  user: {
    name: string;
    email: string;
  } | null;
}

interface SessionContextProps {
  session: Session | null;
  fetchWithSession: (url: string, options?: RequestInit) => Promise<any>;
}

const SessionContext = createContext<SessionContextProps | null>(null);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Fetch initial session data here
    // setSession(initialSessionData);
  }, []);

  const fetchWithSession = async (url: string, options?: RequestInit) => {
    const response = await fetch(url, options);

    if (response.redirected) {
      window.location.href = response.url;
      return null;
    }

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    return response.json();
  };

  return (
    <SessionContext.Provider value={{ session, fetchWithSession }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === null) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};
