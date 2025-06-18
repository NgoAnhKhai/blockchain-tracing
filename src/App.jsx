import { BrowserRouter } from "react-router-dom";

import Router from "./routes";
import ThemeProvider from "./context/theme";
import { ViewModeProvider } from "./context/ViewModeContext";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ViewModeProvider>
          <AuthProvider>
            <Router />
          </AuthProvider>
        </ViewModeProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
