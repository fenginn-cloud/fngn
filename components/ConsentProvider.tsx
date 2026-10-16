"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Consent = "unset" | "granted" | "denied";

interface ConsentContextValue {
  consent: Consent;
  /** true once the saved value has been read on the client */
  ready: boolean;
  accept: () => void;
  reject: () => void;
  /** re-open the banner so the visitor can change their choice */
  reset: () => void;
}

const ConsentContext = createContext<ConsentContextValue | null>(null);

const STORAGE_KEY = "fngn-consent";

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<Consent>("unset");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY) as Consent | null;
      if (saved === "granted" || saved === "denied") setConsent(saved);
    } catch {
      /* localStorage unavailable */
    }
    setReady(true);
  }, []);

  const persist = (value: Consent) => {
    setConsent(value);
    try {
      if (value === "unset") window.localStorage.removeItem(STORAGE_KEY);
      else window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* ignore */
    }
  };

  const accept = () => persist("granted");
  const reject = () => persist("denied");
  const reset = () => persist("unset");

  return (
    <ConsentContext.Provider value={{ consent, ready, accept, reject, reset }}>
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent() {
  const ctx = useContext(ConsentContext);
  if (!ctx) {
    throw new Error("useConsent must be used within a ConsentProvider");
  }
  return ctx;
}
