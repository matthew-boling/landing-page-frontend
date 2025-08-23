import { useState } from "react";
import { Dashboard } from "./components/Dashboard";
import { IncidentReportForm } from "./components/IncidentReportForm";
import { AuthLogin } from "./components/AuthLogin";
import { Navigation } from "./components/Navigation";
import { FloatingChat } from "./components/FloatingChat";

export default function App() {
  const [currentView, setCurrentView] = useState<string>("login");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userScope, setUserScope] = useState<{brands: string[], markets: string[]}>({
    brands: ["Pizza Hut", "KFC", "Taco Bell"],
    markets: ["North America", "EMEA"]
  });

  const handleLogin = (email: string) => {
    // Mock authentication - in real app this would handle magic link
    setIsAuthenticated(true);
    setCurrentView("dashboard");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView("login");
  };

  if (!isAuthenticated) {
    return <AuthLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen">
      <Navigation 
        currentView={currentView} 
        onViewChange={setCurrentView}
        onLogout={handleLogout}
        userScope={userScope}
      />
      
      <main className="container mx-auto p-6">
        {currentView === "dashboard" && <Dashboard userScope={userScope} />}
        {currentView === "report" && <IncidentReportForm />}
      </main>

      {/* Floating Chat Widget */}
      <FloatingChat userScope={userScope} />
    </div>
  );
}