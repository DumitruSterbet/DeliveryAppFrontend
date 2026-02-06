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
  
  // Always call useSignalR hook - it will handle the conditional logic internally
  // Set VITE_ENABLE_SIGNALR=true in .env.local to enable
  useSignalR();

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
