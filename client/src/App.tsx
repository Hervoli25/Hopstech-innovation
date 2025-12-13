import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import HomePage from "./pages/HomePage";
import PortfolioPage from "./pages/PortfolioPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import ContactPage from "./pages/ContactPage";
import ClientPortalPage from "./pages/ClientPortalPage";
import AuthVerifyPage from "./pages/AuthVerifyPage";
import { ScrollProgress } from "./components/animations/ScrollProgress";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={HomePage} />
      <Route path={"/portfolio"} component={PortfolioPage} />
      <Route path={"/portfolio/:slug"} component={ProjectDetailPage} />
      <Route path={"/contact"} component={ContactPage} />
      <Route path={"/client-portal"} component={ClientPortalPage} />
      <Route path={"/auth/verify"} component={AuthVerifyPage} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
        // switchable
      >
        <TooltipProvider>
          <ScrollProgress />
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
