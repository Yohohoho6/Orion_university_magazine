import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@fontsource-variable/inter";
import App from "./App.jsx";
import { HeroUIProvider } from "@heroui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

const theme = {
  colors: {
    primary: {
      50: "#e6f0ff",
      100: "#b3d1ff",
      200: "#80b3ff",
      300: "#4d94ff",
      400: "#1a75ff",
      500: "#1e3a8a",
      600: "#1a315e",
      700: "#162848",
      800: "#121f32",
      900: "#0e151c",
      DEFAULT: "#1e3a8a",
      foreground: "#ffffff",
    },
  },
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider>
          <HeroUIProvider theme={theme}>
            <AuthProvider>
              <App />
            </AuthProvider>
          </HeroUIProvider>
        </ThemeProvider>
      </BrowserRouter>
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  </StrictMode>,
);
