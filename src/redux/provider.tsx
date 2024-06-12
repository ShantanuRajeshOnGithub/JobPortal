"use client";
import { store } from "./store";
import { Provider } from "react-redux";
import { SessionProvider } from "@/context/SessionContext";
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <SessionProvider>{children}</SessionProvider>
    </Provider>
  );
}
