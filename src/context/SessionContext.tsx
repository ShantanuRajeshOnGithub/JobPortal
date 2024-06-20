import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import log from "@/utils/clientLogger";
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
    log.debug("Fetching initial session data");
    // setSession(initialSessionData);
  }, []);

  const fetchWithSession = async (url: string, options?: RequestInit) => {
    log.debug(`Fetching URL: ${url}`);
    const response = await fetch(url, options);

    if (response.redirected) {
      log.warn(`Redirected to: ${response.url}`);
      window.location.href = response.url;
      return null;
    }

    if (!response.ok) {
      const error = `Error: ${response.statusText}`;
      // Specific handling for different status codes
      if (response.status === 400) {
        // Return the response object for 400 errors
        return { ...response.json(), status: 400 };
      } else {
        const error = `Error: ${response.statusText}`;
        log.error(error);
        throw new Error(error);
      }
    }

    log.debug("Fetch successful");
    return { ...response.json(), status: 200 };
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
    const error = "useSession must be used within a SessionProvider";
    log.error(error);
    throw new Error(error);
  }
  return context;
};
