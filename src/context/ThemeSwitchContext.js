"use client"

import React, { createContext, useState, useContext, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleThemeChange = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode');
    const h2Tags = document.querySelectorAll('h2');
    h2Tags.forEach((p) => {
      p.classList.toggle('dark-mode');
    });
  };

  useEffect(() => {
    async function saveTheme() {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        setIsDarkMode(savedTheme === 'dark');
        if (savedTheme === 'dark') {
          document.body.classList.add('dark-mode');
        }
      }
    }

    saveTheme();
  }, []);

  useEffect(() => {
    async function localForageTheme() {
      localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }

    localForageTheme();
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        handleThemeChange,
        setIsDarkMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export function useThemeContext() {
  return useContext(ThemeContext);
}