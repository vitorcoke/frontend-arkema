import { CssBaseline, ThemeProvider } from "@mui/material";
import type { AppProps } from "next/app";
import AuthContextProvider from "../contexts/AuthContext";
import ControllerPagesProvider from "../contexts/ControllerPagesContext";
import { light } from "../theme/light";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <ThemeProvider theme={light}>
        <CssBaseline />
        <AuthContextProvider>
          <ControllerPagesProvider>
            <Component {...pageProps} />
          </ControllerPagesProvider>
        </AuthContextProvider>
      </ThemeProvider>
    </>
  );
}

export default MyApp;
