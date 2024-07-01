import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "./components/ui/toaster";
import router from "./router/router";
import React from "react";

function App() {
  return (
    <>
      <React.StrictMode>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <RouterProvider router={router} />
          <Toaster />
        </ThemeProvider>
      </React.StrictMode>
    </>
  );
}

export default App;
