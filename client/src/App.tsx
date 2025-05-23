import { Switch } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";

import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import CoursesPage from "@/pages/courses-page";
import CourseDetailPage from "@/pages/course-detail-page";
import TestsPage from "@/pages/tests-page";
import TestDetailPage from "@/pages/test-detail-page";
import TakeTestPage from "@/pages/take-test-page";
import DashboardPage from "@/pages/dashboard-page";
import StudyMaterialsPage from "@/pages/study-materials-page";
import { ProtectedRoute } from "./lib/protected-route";

function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/dashboard" component={DashboardPage} />
      <ProtectedRoute path="/take-test/:id" component={TakeTestPage} />
      <ProtectedRoute path="/test/:id" component={TestDetailPage} />
      <ProtectedRoute path="/course/:id" component={CourseDetailPage} />
      
      <HomePage path="/" />
      <AuthPage path="/auth" />
      <CoursesPage path="/courses" />
      <TestsPage path="/tests" />
      <StudyMaterialsPage path="/study-materials" />
      
      <NotFound />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
