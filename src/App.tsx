import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { CompareProvider } from "./contexts/CompareContext";
import AnimatedRoute from "./components/AnimatedRoute";
import Index from "./pages/Index";
import Pricing from "./pages/Pricing";
import Leaderboard from "./pages/Leaderboard";
import NotFound from "./pages/NotFound";
import BenchmarksPage from "./pages/Benchmarks";
import ModelComparisonPage from "./pages/comparison/modelComparison";
import ModelView from "./pages/viewPage/modelView";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <AnimatedRoute>
              <Index />
            </AnimatedRoute>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <AnimatedRoute>
              <Leaderboard />
            </AnimatedRoute>
          }
        />
        <Route
          path="/benchmarks"
          element={
            <AnimatedRoute>
              <BenchmarksPage />
            </AnimatedRoute>
          }
        />
        <Route
          path="/pricing"
          element={
            <AnimatedRoute>
              <Pricing />
            </AnimatedRoute>
          }
        />
        <Route
          path="/comparison"
          element={
            <AnimatedRoute>
              <ModelComparisonPage />
            </AnimatedRoute>
          }
        />
        <Route
          path="/model/:id"
          element={
            <AnimatedRoute>
              <ModelView />
            </AnimatedRoute>
          }
        />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route
          path="*"
          element={
            <AnimatedRoute>
              <NotFound />
            </AnimatedRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CompareProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnimatedRoutes />
        </BrowserRouter>
      </CompareProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
