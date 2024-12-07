import { createContext, useState, ReactNode, FC } from 'react';
import { ThemeContextProps, Theme } from '@/types';

export const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

// ThemeProvider
export const ThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');

  const toggleTheme = () => {
    setTheme((prevTheme: Theme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
