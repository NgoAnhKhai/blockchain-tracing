import React from "react";
import { BrowserRouter } from "react-router-dom";

import Router from "./routes";
import ThemeProvider from "./context/theme";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
