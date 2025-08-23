import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { MessageSquare, X, Minimize2 } from "lucide-react";
import { Chatbot } from "./Chatbot";

interface FloatingChatProps {
  userScope: {brands: string[], markets: string[]};
}

export function FloatingChat({ userScope }: FloatingChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full shadow-lg gradient-primary hover:scale-105 transition-transform"
          size="icon"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Card className="w-80 shadow-xl border-2 backdrop-blur-sm bg-card/90">
          <CardHeader className="p-4 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Incident Assistant</CardTitle>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setIsMinimized(false)}
                >
                  <MessageSquare className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">
              Chat minimized. Click to expand and continue your conversation.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className="w-96 h-[500px] shadow-2xl border-2 backdrop-blur-sm bg-card/95">
        <CardHeader className="p-4 border-b gradient-primary text-white">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Incident Assistant</CardTitle>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20"
                onClick={() => setIsMinimized(true)}
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <div className="h-[440px] overflow-hidden">
          <Chatbot userScope={userScope} isFloating={true} />
        </div>
      </Card>
    </div>
  );
}