import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import MainMenu from "@/pages/MainMenu";
import Home from "@/pages/Home";
import BMICalculator from "@/pages/BMICalculator";
import DailyTracker from "@/pages/DailyTracker";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={MainMenu} />
      <Route path="/food-analysis" component={Home} />
      <Route path="/bmi" component={BMICalculator} />
      <Route path="/daily-tracker" component={DailyTracker} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <Toaster />
          <Router />
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;