import { BrowserRouter } from "react-router-dom";

import Router from "./routes";
import ThemeProvider from "./context/theme";
import { ViewModeProvider } from "./context/ViewModeContext";
import { AuthProvider } from "./context/AuthContext";
import { GraphDataProvider } from "./context/GraphDataContext";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <GraphDataProvider>
            <ViewModeProvider>
              <Router />
            </ViewModeProvider>
          </GraphDataProvider>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
