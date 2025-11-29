import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import Quiz from "./pages/Quiz";
import Dashboard from "./pages/Dashboard";
import Entries from "./pages/Entries";
import Articles from "./pages/Articles";
import ArticleDetail from "./pages/ArticleDetail";
import ArticleSubmit from "./pages/ArticleSubmit";
import ArticleAdmin from "./pages/ArticleAdmin";
import Chat from "./pages/Chat";
import Book from "./pages/Book";
import Partner from "./pages/Partner";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/entries" element={<Entries />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/articles/submit" element={<ArticleSubmit />} />
            <Route path="/articles/admin" element={<ArticleAdmin />} />
            <Route path="/article/:id" element={<ArticleDetail />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/book" element={<Book />} />
            <Route path="/partner" element={<Partner />} />
            <Route path="/settings" element={<Settings />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
