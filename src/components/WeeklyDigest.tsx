import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Alert, AlertDescription } from "./ui/alert";
import { 
  Mail, 
  Clock, 
  Settings, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Download,
  Calendar
} from "lucide-react";

export function WeeklyDigest() {
  const [digestEnabled, setDigestEnabled] = useState(true);
  const [deliveryDay, setDeliveryDay] = useState("monday");
  const [deliveryTime, setDeliveryTime] = useState("17:00");
  const [includeBrands, setIncludeBrands] = useState<string[]>(["Pizza Hut", "KFC"]);
  const [includeResolved, setIncludeResolved] = useState(true);
  const [includeMetrics, setIncludeMetrics] = useState(true);
  const [savedChanges, setSavedChanges] = useState(false);

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

  // Mock upcoming digest preview
  const upcomingDigest = {
    date: "January 22, 2025",
    incidents: [
      { id: "INC-001", title: "Payment Processing Delayed", severity: "P1", brand: "Pizza Hut", status: "Active" },
      { id: "INC-002", title: "Mobile App Login Issues", severity: "P2", brand: "KFC", status: "Resolved" },
      { id: "INC-003", title: "Delivery Tracking Inaccurate", severity: "P3", brand: "Taco Bell", status: "Resolved" }
    ]
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Success Alert */}
      {savedChanges && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Digest preferences saved successfully!
          </AlertDescription>
        </Alert>
      )}

      {/* Digest Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Weekly Digest Settings</span>
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
                      <SelectTrigger>
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
                      <SelectTrigger>
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

              <Button onClick={handleSave} className="w-full">
                Save Digest Preferences
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Last Digest Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="h-5 w-5" />
            <span>Last Digest Summary</span>
          </CardTitle>
          <CardDescription>
            Summary from your most recent weekly digest ({lastDigest.date})
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{lastDigest.incidentCount}</div>
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
              <div className="text-2xl font-bold">{lastDigest.avgResolutionTime}</div>
              <div className="text-sm text-muted-foreground">Avg Resolution</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">{lastDigest.uptime}</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
          </div>
          
          <div className="mt-4 flex justify-center">
            <Button variant="outline" className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Download Last Digest (PDF)</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Digest Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Upcoming Digest Preview</span>
          </CardTitle>
          <CardDescription>
            Preview of incidents that will be included in your next digest ({upcomingDigest.date})
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingDigest.incidents.map(incident => (
              <div key={incident.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {incident.status === "Resolved" ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  )}
                  <div>
                    <div className="font-medium text-sm">{incident.title}</div>
                    <div className="text-xs text-muted-foreground">{incident.id} • {incident.brand}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={incident.severity === "P1" ? "destructive" : incident.severity === "P2" ? "default" : "secondary"}>
                    {incident.severity}
                  </Badge>
                  <Badge variant={incident.status === "Resolved" ? "secondary" : "destructive"}>
                    {incident.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          
          <Alert className="mt-4">
            <Clock className="h-4 w-4" />
            <AlertDescription>
              Next digest will be sent on {deliveryDay.charAt(0).toUpperCase() + deliveryDay.slice(1)} at {deliveryTime} (Louisville, KY time).
              You can preview or download a draft version 24 hours before delivery.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}