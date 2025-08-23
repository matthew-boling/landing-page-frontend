import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { Settings, Mail, CheckCircle } from "lucide-react";

interface AuthLoginProps {
  onLogin: (email: string) => void;
}

export function AuthLogin({ onLogin }: AuthLoginProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [linkSent, setLinkSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    
    // Mock sending magic link
    setTimeout(() => {
      setIsLoading(false);
      setLinkSent(true);
      
      // Mock clicking the magic link after 3 seconds
      setTimeout(() => {
        onLogin(email);
      }, 3000);
    }, 1500);
  };

  if (linkSent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-border/50 bg-card/80 backdrop-blur-sm shadow-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-green-100 to-green-200">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">Check Your Email</CardTitle>
            <CardDescription>
              We've sent a secure login link to <strong>{email}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="border-blue-200 bg-blue-50/80 backdrop-blur-sm">
              <Mail className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                Click the link in your email to sign in. The link expires in 10 minutes.
                <br />
                <br />
                <em className="text-xs text-muted-foreground">
                  (Demo: Auto-logging you in in 3 seconds...)
                </em>
              </AlertDescription>
            </Alert>
            
            <Button 
              variant="outline" 
              className="w-full mt-4 border-border/50 bg-card/50"
              onClick={() => setLinkSent(false)}
            >
              Use Different Email
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-border/50 bg-card/80 backdrop-blur-sm shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full gradient-primary">
            <Settings className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
            Incident Stakeholder Portal
          </CardTitle>
          <CardDescription>
            Enter your email to receive a secure login link
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-input-background border-border/50"
              />
            </div>
            
            <Button type="submit" className="w-full gradient-primary" disabled={isLoading}>
              {isLoading ? "Sending Link..." : "Send Login Link"}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Only authorized stakeholders can access this portal.
              <br />
              Access is verified against the incident.io catalog.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}