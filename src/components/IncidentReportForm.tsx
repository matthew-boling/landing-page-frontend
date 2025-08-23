import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Alert, AlertDescription } from "./ui/alert";
import { AlertTriangle, CheckCircle, Clock, Users } from "lucide-react";

export function IncidentReportForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    severity: "",
    brand: "",
    market: "",
    affectedSystems: [] as string[],
    customerImpact: "",
    reporterEmail: "",
    reporterName: "",
    urgentNotification: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const brands = ["Pizza Hut", "KFC", "Taco Bell", "Habit Burger"];
  const markets = ["North America", "EMEA", "APAC", "Latin America"];
  const systems = [
    "Mobile App", "Website", "Payment Processing", "Order Management", 
    "Delivery Tracking", "POS Systems", "Customer Service", "Marketing Platform"
  ];

  const handleSystemToggle = (system: string) => {
    setFormData(prev => ({
      ...prev,
      affectedSystems: prev.affectedSystems.includes(system)
        ? prev.affectedSystems.filter(s => s !== system)
        : [...prev.affectedSystems, system]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Mock form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 2000);
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl mb-2 bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">Incident Report Submitted</h2>
            <p className="text-muted-foreground mb-6">
              Your incident report has been received and forwarded to the incident management team.
            </p>
            
            <div className="bg-muted/60 backdrop-blur-sm p-4 rounded-lg mb-6 text-left">
              <h3 className="font-medium mb-2">What happens next?</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-orange-500" />
                  <span>Incident will be triaged within 15 minutes</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-purple-500" />
                  <span>On-call team will be notified if severity is P1/P2</span>
                </li>
                <li className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <span>You'll receive updates via email if incident is confirmed</span>
                </li>
              </ul>
            </div>
            
            <Button onClick={() => {
              setIsSubmitted(false);
              setFormData({
                title: "",
                description: "",
                severity: "",
                brand: "",
                market: "",
                affectedSystems: [],
                customerImpact: "",
                reporterEmail: "",
                reporterName: "",
                urgentNotification: false
              });
            }} className="gradient-primary">
              Report Another Incident
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <span className="bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">Report New Incident</span>
          </CardTitle>
          <CardDescription>
            Submit a potential incident for investigation by the incident management team.
            For critical issues affecting customers, use P1 severity.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="font-medium bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reporterName">Your Name</Label>
                  <Input
                    id="reporterName"
                    value={formData.reporterName}
                    onChange={(e) => setFormData(prev => ({...prev, reporterName: e.target.value}))}
                    required
                    className="bg-input-background border-border/50"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reporterEmail">Your Email</Label>
                  <Input
                    id="reporterEmail"
                    type="email"
                    value={formData.reporterEmail}
                    onChange={(e) => setFormData(prev => ({...prev, reporterEmail: e.target.value}))}
                    required
                    className="bg-input-background border-border/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Incident Title</Label>
                <Input
                  id="title"
                  placeholder="Brief, descriptive title of the issue"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({...prev, title: e.target.value}))}
                  required
                  className="bg-input-background border-border/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Detailed description of what's happening, when it started, and how it was discovered..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                  rows={4}
                  required
                  className="bg-input-background border-border/50"
                />
              </div>
            </div>

            {/* Impact Assessment */}
            <div className="space-y-4">
              <h3 className="font-medium bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">Impact Assessment</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Severity</Label>
                  <Select value={formData.severity} onValueChange={(value) => setFormData(prev => ({...prev, severity: value}))}>
                    <SelectTrigger className="bg-input-background border-border/50">
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="P1">P1 - Critical (Service Down)</SelectItem>
                      <SelectItem value="P2">P2 - High (Major Degradation)</SelectItem>
                      <SelectItem value="P3">P3 - Medium (Minor Issues)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Affected Brand</Label>
                  <Select value={formData.brand} onValueChange={(value) => setFormData(prev => ({...prev, brand: value}))}>
                    <SelectTrigger className="bg-input-background border-border/50">
                      <SelectValue placeholder="Select brand" />
                    </SelectTrigger>
                    <SelectContent>
                      {brands.map(brand => (
                        <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Market/Region</Label>
                  <Select value={formData.market} onValueChange={(value) => setFormData(prev => ({...prev, market: value}))}>
                    <SelectTrigger className="bg-input-background border-border/50">
                      <SelectValue placeholder="Select market" />
                    </SelectTrigger>
                    <SelectContent>
                      {markets.map(market => (
                        <SelectItem key={market} value={market}>{market}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Affected Systems</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {systems.map(system => (
                    <div key={system} className="flex items-center space-x-2">
                      <Checkbox
                        id={system}
                        checked={formData.affectedSystems.includes(system)}
                        onCheckedChange={() => handleSystemToggle(system)}
                      />
                      <Label htmlFor={system} className="text-sm">{system}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerImpact">Customer Impact</Label>
                <Textarea
                  id="customerImpact"
                  placeholder="Describe how customers are affected (e.g., cannot place orders, slow loading times, payment failures...)"
                  value={formData.customerImpact}
                  onChange={(e) => setFormData(prev => ({...prev, customerImpact: e.target.value}))}
                  rows={3}
                  required
                  className="bg-input-background border-border/50"
                />
              </div>
            </div>

            {/* Urgent Notification */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="urgent"
                  checked={formData.urgentNotification}
                  onCheckedChange={(checked) => setFormData(prev => ({...prev, urgentNotification: !!checked}))}
                />
                <Label htmlFor="urgent">
                  Request urgent notification (will immediately alert on-call team)
                </Label>
              </div>

              {formData.urgentNotification && (
                <Alert className="border-orange-200 bg-orange-50/80 backdrop-blur-sm">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <AlertDescription className="text-orange-800">
                    Urgent notifications should only be used for P1/P2 incidents that require immediate attention.
                    The on-call team will be contacted via phone and SMS.
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" className="border-border/50 bg-card/50">
                Save Draft
              </Button>
              <Button type="submit" disabled={isSubmitting} className="gradient-primary">
                {isSubmitting ? "Submitting..." : "Submit Incident Report"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}