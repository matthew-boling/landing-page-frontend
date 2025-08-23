import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  LayoutDashboard, 
  AlertTriangle, 
  LogOut,
  Settings
} from "lucide-react";

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
  onLogout: () => void;
  userScope: {brands: string[], markets: string[]};
}

export function Navigation({ currentView, onViewChange, onLogout, userScope }: NavigationProps) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "report", label: "Report Incident", icon: AlertTriangle },
  ];

  return (
    <header className="border-b bg-card/80 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
                <Settings className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-medium bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
                  Incident Portal
                </h1>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span>Access:</span>
                  {userScope.brands.slice(0, 2).map(brand => (
                    <Badge key={brand} variant="secondary" className="text-xs bg-secondary/60">
                      {brand}
                    </Badge>
                  ))}
                  {userScope.brands.length > 2 && (
                    <Badge variant="secondary" className="text-xs bg-secondary/60">
                      +{userScope.brands.length - 2} more
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <nav className="flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={currentView === item.id ? "default" : "ghost"}
                    className={`flex items-center space-x-2 ${
                      currentView === item.id ? "gradient-primary text-white" : ""
                    }`}
                    onClick={() => onViewChange(item.id)}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Button>
                );
              })}
            </nav>
          </div>

          <Button 
            variant="outline" 
            onClick={onLogout} 
            className="flex items-center space-x-2 border-border/50 bg-card/50"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </Button>
        </div>
      </div>
    </header>
  );
}