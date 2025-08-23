import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import { Checkbox } from "./ui/checkbox";
import { Alert, AlertDescription } from "./ui/alert";
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  ExternalLink,
  Filter,
  TrendingUp,
  Users,
  Activity,
  Mail,
  Settings as SettingsIcon,
  Download,
  Calendar
} from "lucide-react";
import { apiService } from "../services/api";

interface DashboardProps {
  userScope: {brands: string[], markets: string[]};
}

// Incident data state
interface Incident {
  id: string;
  title: string;
  severity: string;
  status: string;
  brand: string;
  market: string;
  startTime: string;
  lastUpdate: string;
  description: string;
  impact: string;
}

const statusPageLinks = [
  { brand: "Pizza Hut", url: "#", region: "Global" },
  { brand: "KFC", url: "#", region: "Global" },
  { brand: "Taco Bell", url: "#", region: "Americas" },
  { brand: "Habit Burger", url: "#", region: "US Only" }
];

export function Dashboard({ userScope }: DashboardProps) {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [brandFilter, setBrandFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  // Weekly Digest State
  const [digestEnabled, setDigestEnabled] = useState(true);
  const [deliveryDay, setDeliveryDay] = useState("monday");
  const [deliveryTime, setDeliveryTime] = useState("17:00");
  const [includeBrands, setIncludeBrands] = useState<string[]>(["Pizza Hut", "KFC"]);
  const [includeResolved, setIncludeResolved] = useState(true);
  const [includeMetrics, setIncludeMetrics] = useState(true);
  const [savedChanges, setSavedChanges] = useState(false);

  // Fetch incidents from API
  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        setLoading(true);
        const response = await apiService.getIncidents();
        setIncidents(response.incidents);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch incidents');
        // Fallback to mock data for development
        setIncidents([
          {
            id: "INC-001",
            title: "Payment Processing Delayed",
            severity: "P1",
            status: "Active",
            brand: "Pizza Hut",
            market: "North America",
            startTime: "2025-01-22T15:30:00Z",
            lastUpdate: "2025-01-22T16:45:00Z",
            description: "Customers experiencing delays in payment processing across mobile and web platforms",
            impact: "High - affecting order completion"
          },
          {
            id: "INC-002", 
            title: "Mobile App Login Issues",
            severity: "P2",
            status: "Investigating",
            brand: "KFC",
            market: "EMEA",
            startTime: "2025-01-22T14:15:00Z",
            lastUpdate: "2025-01-22T16:30:00Z",
            description: "Users unable to log into mobile application in UK and Germany",
            impact: "Medium - authentication system affected"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchIncidents();
  }, []);

  const filteredIncidents = incidents.filter(incident => {
    if (severityFilter !== "all" && incident.severity !== severityFilter) return false;
    if (brandFilter !== "all" && incident.brand !== brandFilter) return false;
    if (statusFilter !== "all" && incident.status !== statusFilter) return false;
    if (!userScope.brands.includes(incident.brand)) return false;
    return true;
  });

  const activeIncidents = filteredIncidents.filter(i => i.status === "Active" || i.status === "Investigating");
  const p1Count = filteredIncidents.filter(i => i.severity === "P1" && (i.status === "Active" || i.status === "Investigating")).length;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "P1": return "bg-red-500";
      case "P2": return "bg-yellow-500"; 
      case "P3": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active": return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "Investigating": return <Clock className="h-4 w-4 text-yellow-500" />;
      case "Monitoring": return <Activity className="h-4 w-4 text-blue-500" />;
      case "Resolved": return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const brands = ["Pizza Hut", "KFC", "Taco Bell", "Habit Burger"];
  const days = [
    { value: "monday", label: "Monday" },
    { value: "tuesday", label: "Tuesday" },
    { value: "wednesday", label: "Wednesday" },
    { value: "thursday", label: "Thursday" },
    { value: "friday", label: "Friday" }
  ];

  const handleBrandToggle = (brand: string) => {
    setIncludeBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const handleSave = () => {
    setSavedChanges(true);
    setTimeout(() => setSavedChanges(false), 3000);
  };

  // Mock last digest data
  const lastDigest = {
    date: "January 15, 2025",
    incidentCount: 6,
    criticalCount: 1,
    resolvedCount: 5,
    avgResolutionTime: "2.1 hours",
    uptime: "98.2%"
  };

  return (
    <div className="space-y-6">
      {/* Success Alert */}
      {savedChanges && (
        <Alert className="border-green-200 bg-green-50/80 backdrop-blur-sm">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Digest preferences saved successfully!
          </AlertDescription>
        </Alert>
      )}

      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">{activeIncidents.length}</p>
                <p className="text-sm text-muted-foreground">Active Incidents</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="h-5 w-5 bg-gradient-to-r from-red-500 to-red-600 rounded-full" />
              <div>
                <p className="text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">{p1Count}</p>
                <p className="text-sm text-muted-foreground">P1 Critical</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-orange-500 bg-clip-text text-transparent">{userScope.brands.length}</p>
                <p className="text-sm text-muted-foreground">Accessible Brands</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">96.8%</p>
                <p className="text-sm text-muted-foreground">Weekly Uptime</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Alert */}
      {p1Count > 0 && (
        <Alert className="border-red-200 bg-red-50/80 backdrop-blur-sm">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Critical Alert:</strong> {p1Count} P1 incident{p1Count > 1 ? 's' : ''} currently active. 
            Immediate attention required.
          </AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-purple-500" />
            <span className="bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">Incident Overview</span>
          </CardTitle>
          <CardDescription>
            Filter incidents by severity, brand, and status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center space-x-2">
              <label className="text-sm">Severity:</label>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-24 bg-input-background border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="P1">P1</SelectItem>
                  <SelectItem value="P2">P2</SelectItem>
                  <SelectItem value="P3">P3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-sm">Brand:</label>
              <Select value={brandFilter} onValueChange={setBrandFilter}>
                <SelectTrigger className="w-32 bg-input-background border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {userScope.brands.map(brand => (
                    <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-sm">Status:</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32 bg-input-background border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Investigating">Investigating</SelectItem>
                  <SelectItem value="Monitoring">Monitoring</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Incident List */}
          <div className="space-y-4">
            {filteredIncidents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                <p>No incidents match your current filters.</p>
                <p className="text-sm">Try adjusting the filters above.</p>
              </div>
            ) : (
              filteredIncidents.map(incident => (
                <Card key={incident.id} className="border-l-4 border-border/50 bg-card/40 backdrop-blur-sm" style={{borderLeftColor: getSeverityColor(incident.severity).replace('bg-', '#')}}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(incident.status)}
                          <h3 className="font-medium">{incident.title}</h3>
                          <Badge variant="outline" className={`${getSeverityColor(incident.severity)} text-white border-0`}>
                            {incident.severity}
                          </Badge>
                          <Badge variant="secondary" className="bg-secondary/60">{incident.brand}</Badge>
                          <Badge variant="outline" className="border-border/50">{incident.status}</Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground">{incident.description}</p>
                        
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>ID: {incident.id}</span>
                          <span>Market: {incident.market}</span>
                          <span>Started: {new Date(incident.startTime).toLocaleString()}</span>
                          <span>Updated: {new Date(incident.lastUpdate).toLocaleString()}</span>
                        </div>
                        
                        <p className="text-sm"><strong>Impact:</strong> {incident.impact}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Digest Settings */}
      <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <SettingsIcon className="h-5 w-5 text-orange-500" />
            <span className="bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">Weekly Digest Settings</span>
          </CardTitle>
          <CardDescription>
            Configure your weekly incident summary email delivered every Monday at 5 PM (Louisville, KY time)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Enable/Disable */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <label className="text-sm font-medium">Weekly Digest Email</label>
              <p className="text-sm text-muted-foreground">
                Receive a summary of incidents from the previous week
              </p>
            </div>
            <Switch
              checked={digestEnabled}
              onCheckedChange={setDigestEnabled}
            />
          </div>

          {digestEnabled && (
            <>
              {/* Delivery Schedule */}
              <div className="space-y-4">
                <h3 className="font-medium">Delivery Schedule</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm">Delivery Day</label>
                    <Select value={deliveryDay} onValueChange={setDeliveryDay}>
                      <SelectTrigger className="bg-input-background border-border/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {days.map(day => (
                          <SelectItem key={day.value} value={day.value}>
                            {day.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm">Delivery Time (Louisville, KY)</label>
                    <Select value={deliveryTime} onValueChange={setDeliveryTime}>
                      <SelectTrigger className="bg-input-background border-border/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="09:00">9:00 AM</SelectItem>
                        <SelectItem value="12:00">12:00 PM</SelectItem>
                        <SelectItem value="17:00">5:00 PM</SelectItem>
                        <SelectItem value="18:00">6:00 PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Brand Selection */}
              <div className="space-y-4">
                <h3 className="font-medium">Included Brands</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {brands.map(brand => (
                    <div key={brand} className="flex items-center space-x-2">
                      <Checkbox
                        id={brand}
                        checked={includeBrands.includes(brand)}
                        onCheckedChange={() => handleBrandToggle(brand)}
                      />
                      <label htmlFor={brand} className="text-sm">{brand}</label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Content Options */}
              <div className="space-y-4">
                <h3 className="font-medium">Content Options</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Include Resolved Incidents</label>
                      <p className="text-xs text-muted-foreground">Show incidents that were resolved during the week</p>
                    </div>
                    <Switch
                      checked={includeResolved}
                      onCheckedChange={setIncludeResolved}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Include Performance Metrics</label>
                      <p className="text-xs text-muted-foreground">Show uptime statistics and resolution times</p>
                    </div>
                    <Switch
                      checked={includeMetrics}
                      onCheckedChange={setIncludeMetrics}
                    />
                  </div>
                </div>
              </div>

              <Button onClick={handleSave} className="w-full gradient-primary">
                Save Digest Preferences
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Last Digest Summary */}
      <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="h-5 w-5 text-purple-500" />
            <span>Last Digest Summary</span>
          </CardTitle>
          <CardDescription>
            Summary from your most recent weekly digest ({lastDigest.date})
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-orange-500 bg-clip-text text-transparent">{lastDigest.incidentCount}</div>
              <div className="text-sm text-muted-foreground">Total Incidents</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-500">{lastDigest.criticalCount}</div>
              <div className="text-sm text-muted-foreground">Critical (P1)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">{lastDigest.resolvedCount}</div>
              <div className="text-sm text-muted-foreground">Resolved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">{lastDigest.avgResolutionTime}</div>
              <div className="text-sm text-muted-foreground">Avg Resolution</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">{lastDigest.uptime}</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
          </div>
          
          <div className="mt-4 flex justify-center">
            <Button variant="outline" className="flex items-center space-x-2 border-border/50 bg-card/50">
              <Download className="h-4 w-4" />
              <span>Download Last Digest (PDF)</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Status Page Links */}
      <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">Brand Status Pages</CardTitle>
          <CardDescription>
            Quick access to public status pages for system health
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {statusPageLinks.map(link => (
              <Button key={link.brand} variant="outline" className="justify-between h-auto p-4 border-border/50 bg-card/30 hover:bg-card/50">
                <div className="text-left">
                  <div className="font-medium">{link.brand}</div>
                  <div className="text-sm text-muted-foreground">{link.region}</div>
                </div>
                <ExternalLink className="h-4 w-4" />
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}