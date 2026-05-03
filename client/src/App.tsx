import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import DashboardLayout from "@/components/DashboardLayout";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import ReposPage from "./pages/Repos";
import MetricsPage from "./pages/Metrics";
import ActionPlanPage from "./pages/ActionPlan";
import FoundationPage from "./pages/Foundation";

function Router() {
  return (
    <DashboardLayout>
      <Switch>
        <Route path="/repos" component={ReposPage} />
        <Route path="/metrics" component={MetricsPage} />
        <Route path="/action-plan" component={ActionPlanPage} />
        <Route path="/foundation" component={FoundationPage} />
        <Route path="/404" component={NotFound} />
        {/* Default redirect to repos */}
        <Route path="/" component={ReposPage} />
        {/* Final fallback route */}
        <Route component={NotFound} />
      </Switch>
    </DashboardLayout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
