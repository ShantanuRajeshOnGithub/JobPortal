"use client";
import { store } from "./store";
import { Provider } from "react-redux";
import { SessionProvider } from "@/context/SessionContext";
import log from "@/utils/clientLogger";
export function Providers({ children }: { children: React.ReactNode }) {
  log.debug("Providers component mounted");
  return (
    <Provider store={store}>
      <SessionProvider>{children}</SessionProvider>
    </Provider>
  );
}
