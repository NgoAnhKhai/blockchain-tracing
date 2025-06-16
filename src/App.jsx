import React from "react";
import { BrowserRouter } from "react-router-dom";

import Router from "./routes";
import ThemeProvider from "./context/theme";
import { ViewModeProvider } from "./context/ViewModeContext";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ViewModeProvider>
          <Router />
        </ViewModeProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
