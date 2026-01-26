"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Lang = "ua" | "en" | "de";

export interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => Promise<void>;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Lang>("ua");
  const [loading, setLoading] = useState(true);

  // Завантажуємо мову з API при першому рендері
  useEffect(() => {
    const fetchLang = async () => {
      try {
        const res = await fetch("/api/lang/get");
        if (!res.ok) throw new Error("Failed to fetch language");
        const data = await res.json();
        setLangState(data.lang);
        console.log("🌐 Fetched language:", data.lang);
      } catch (err) {
        console.error("❌ Could not fetch language:", err);
        setLangState("ua");
      } finally {
        setLoading(false);
      }
    };
    fetchLang();
  }, []);

  const setLang = async (newLang: Lang) => {
    setLangState(newLang); // оновлюємо UI миттєво
    try {
      const res = await fetch("/api/lang/set", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lang: newLang }),
      });
      if (!res.ok) throw new Error("Failed to save language on server");
      const data = await res.json();
      console.log("🎉 Language saved on server:", data.lang);
    } catch (err) {
      console.error("❌ Could not save language:", err);
    }
  };

  if (loading) return null;

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextValue => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within a LanguageProvider");
  return context;
};


