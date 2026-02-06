import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { router } from "./navigation/router";
import { useAuthState, useGetProfile } from "./lib/actions";
import { ThemeProvider, StylesProvider } from "./providers";
import { useSignalR } from "./hooks";

import "./index.css";

function App() {
  useAuthState();
  useGetProfile();
  
  // Initialize SignalR connection only if enabled via environment variable
  // Set VITE_ENABLE_SIGNALR=true in .env.local to enable
  const shouldUseSignalR = import.meta.env.VITE_ENABLE_SIGNALR === 'true';
  
  if (shouldUseSignalR) {
    useSignalR();
  }

  return (
    <div className="app">
      <StylesProvider />
      <ToastContainer />
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </div>
  );
}

export default App;
