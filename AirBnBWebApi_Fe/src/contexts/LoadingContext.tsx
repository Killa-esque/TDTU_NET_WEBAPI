import React, { createContext, useState, ReactNode, useEffect } from "react";
import loading from "@/assets/images/loading.gif";

// Define the interface for the loading state
interface LoadingState {
  isLoading: boolean;
}

// Define the initial default state
const DEFAULT_STATE: LoadingState = {
  isLoading: false,
};

// Define the type for the context
interface LoadingContextType {
  isLoading: boolean;
  showLoading: () => void;
  hideLoading: () => void;
}

// Create the context with default values
export const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  showLoading: () => { },
  hideLoading: () => { },
});

// Provider props interface
interface LoadingProviderProps {
  children: ReactNode;
}

// Define the LoadingProvider component
export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(DEFAULT_STATE.isLoading);

  // Helper function to show loading
  const showLoading = () => {
    setIsLoading(true);
  };

  // Helper function to hide loading
  const hideLoading = () => {
    setIsLoading(false);
  };

  // Use useEffect to handle side-effects like body overflow when loading
  useEffect(() => {
    document.querySelector("body")!.style.overflow = isLoading ? "hidden" : "unset";
  }, [isLoading]);

  return (
    <LoadingContext.Provider value={{ isLoading, showLoading, hideLoading }}>
      {/* Display the loading indicator if isLoading is true */}
      {isLoading && (
        <div className="fixed inset-0 flex justify-center items-center bg-white z-[999]">
          <img src={loading} className="max-w-full max-h-full w-auto h-auto" alt="Loading..." />
        </div>
      )}
      {children}
    </LoadingContext.Provider>
  );
};

// Custom hook to use the LoadingContext

