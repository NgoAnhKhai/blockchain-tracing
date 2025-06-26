import { BrowserRouter } from "react-router-dom";
import Router from "./routes";
import ThemeProvider from "./context/theme";
import { ViewModeProvider } from "./context/ViewModeContext";
import { AuthProvider } from "./context/AuthContext";
import { AddressSearchProvider } from "./context/AddressSearchContext";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <AddressSearchProvider>
            <ViewModeProvider>
              <Router />
            </ViewModeProvider>
          </AddressSearchProvider>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
