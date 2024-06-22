import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
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
  updateSession: () => Promise<void>;
}

const SessionContext = createContext<SessionContextProps | null>(null);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isSessionLoading, setIsSessionLoading] = useState<boolean>(true);

  const fetchSession = useCallback(async () => {
    log.debug("Fetching initial session data");
    try {
      const response = await fetch("/api/auth/session");
      if (!response.ok) {
        throw new Error("Failed to fetch session data");
      }
      const data = await response.json();
      log.debug("Fetched session data:", data);
      setSession(data);
    } catch (error) {
      log.error("Error fetching session data:", error);
      setSession(null);
    } finally {
      setIsSessionLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isSessionLoading) {
      fetchSession();
    }
  }, [isSessionLoading, fetchSession]);

  const fetchWithSession = async (url: string, options?: RequestInit) => {
    log.debug(`Fetching URL: ${url}`);
    const response = await fetch(url, options);

    if (response.redirected) {
      log.warn(`Redirected to: ${response.url}`);
      window.location.href = response.url;
      return null;
    }

    const jsonResponse = await response.json();

    if (!response.ok) {
      const error = `Error: ${response.statusText}`;
      // Specific handling for different status codes
      if (response.status === 400) {
        // Return the response object for 400 errors
        return { ...jsonResponse, status: 400 };
      } else {
        const error = `Error: ${response.statusText}`;
        log.error(error);
        throw new Error(error);
      }
    }

    log.debug("Fetch successful response", jsonResponse);
    return { ...jsonResponse, status: 200 };
  };

  const updateSession = async () => {
    setIsSessionLoading(true);
    await fetchSession();
  };

  return (
    <SessionContext.Provider
      value={{ session, fetchWithSession, updateSession }}
    >
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
