import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { MessageSquare, Send, Bot, User, Clock, AlertTriangle } from "lucide-react";

interface ChatbotProps {
  userScope: {brands: string[], markets: string[]};
  isFloating?: boolean;
}

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
  data?: any;
}

export function Chatbot({ userScope, isFloating = false }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content: "Hi! I'm your incident assistant. I can help you find information about incidents, check system status, and answer questions about our incident management process. What would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const suggestedQueries = [
    "Show me active incidents for Pizza Hut",
    "Were there any P1 incidents this week?",
    "What's the status of the payment system?",
    "Show incidents affecting mobile apps",
    "Weekly incident summary"
  ];

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const generateBotResponse = (userMessage: string): { content: string; data?: any } => {
    const message = userMessage.toLowerCase();
    
    if (message.includes("active") || message.includes("open")) {
      return {
        content: "Here are the current active incidents visible to you:",
        data: {
          type: "incident-list",
          incidents: [
            {
              id: "INC-001",
              title: "Payment Processing Delayed",
              severity: "P1",
              brand: "Pizza Hut",
              status: "Active",
              startTime: "2025-01-22T15:30:00Z"
            },
            {
              id: "INC-002",
              title: "Mobile App Login Issues", 
              severity: "P2",
              brand: "KFC",
              status: "Investigating",
              startTime: "2025-01-22T14:15:00Z"
            }
          ]
        }
      };
    }
    
    if (message.includes("p1") || message.includes("critical")) {
      return {
        content: "I found 1 P1 critical incident currently active:\n\n**INC-001: Payment Processing Delayed**\n- Brand: Pizza Hut\n- Status: Active since 3:30 PM\n- Impact: High - affecting order completion\n\nThis incident is being actively worked on by the engineering team. Would you like more details or updates?"
      };
    }
    
    if (message.includes("payment") || message.includes("billing")) {
      return {
        content: "There is currently a known issue with payment processing:\n\n**Active Issue:** Payment Processing Delayed (INC-001)\n- Affects: Pizza Hut payment systems\n- Severity: P1 Critical\n- Status: Engineers are working on a fix\n- ETA: Updates expected within 30 minutes\n\nCustomers may experience delays when completing orders. The team is prioritizing this issue."
      };
    }
    
    if (message.includes("mobile") || message.includes("app")) {
      return {
        content: "I found mobile app related incidents:\n\n**INC-002: Mobile App Login Issues**\n- Brand: KFC\n- Region: EMEA (UK, Germany)\n- Severity: P2\n- Status: Investigating\n- Started: 2:15 PM today\n\nUsers are unable to log into the mobile application. The authentication team is currently investigating the root cause."
      };
    }
    
    if (message.includes("status") || message.includes("health")) {
      return {
        content: "Current system status across your accessible brands:\n\n🔴 **Pizza Hut**: Payment system degraded (P1 incident active)\n🟡 **KFC**: Mobile auth issues in EMEA (P2)\n🟢 **Taco Bell**: All systems operational\n\nOverall uptime this week: 96.8%\nActive incidents: 2\nResolved incidents today: 1"
      };
    }
    
    if (message.includes("week") || message.includes("summary")) {
      return {
        content: "**Weekly Incident Summary (Jan 16-22, 2025)**\n\n📊 **Statistics:**\n- Total incidents: 8\n- P1 Critical: 2\n- P2 High: 3  \n- P3 Medium: 3\n- Average resolution time: 2.4 hours\n- Uptime: 96.8%\n\n🔥 **Top Issues:**\n1. Payment processing (2 incidents)\n2. Mobile authentication (1 incident)\n3. Database performance (1 incident)\n\nWould you like details on any specific incident or brand?"
      };
    }
    
    if (message.includes("help") || message.includes("what can you")) {
      return {
        content: "I can help you with:\n\n🔍 **Find Incidents**\n- \"Show active incidents for [brand]\"\n- \"Were there any P1 incidents this week?\"\n- \"What incidents affected payments?\"\n\n📊 **System Status**\n- \"What's the current system status?\"\n- \"Is [brand] having issues?\"\n\n📈 **Reports & Analytics**\n- \"Weekly incident summary\"\n- \"Show uptime for this month\"\n\n❓ **General Questions**\n- \"How do I report an incident?\"\n- \"What does P1/P2/P3 mean?\"\n\nJust ask me anything about incidents in natural language!"
      };
    }
    
    return {
      content: "I understand you're asking about incident information. Could you be more specific? For example:\n\n• \"Show me active incidents\"\n• \"What's the status of [brand]?\"\n• \"Were there any P1 incidents today?\"\n• \"Help\" for more options\n\nI have access to incidents for: " + userScope.brands.join(", ")
    };
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue.trim(),
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);
    
    // Simulate typing delay
    setTimeout(() => {
      const response = generateBotResponse(userMessage.content);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: response.content,
        timestamp: new Date(),
        data: response.data
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (query: string) => {
    setInputValue(query);
  };

  const renderMessage = (message: Message) => {
    const isUser = message.type === "user";
    
    return (
      <div key={message.id} className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
        <div className={`flex items-start space-x-2 max-w-[80%] ${isUser ? "flex-row-reverse space-x-reverse" : ""}`}>
          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            isUser ? "gradient-primary text-white" : "bg-muted"
          }`}>
            {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
          </div>
          
          <div className={`rounded-lg p-3 ${
            isUser 
              ? "gradient-primary text-white" 
              : "bg-muted/60 backdrop-blur-sm"
          }`}>
            <div className="whitespace-pre-wrap text-sm">{message.content}</div>
            
            {message.data?.type === "incident-list" && (
              <div className="mt-3 space-y-2">
                {message.data.incidents.map((incident: any) => (
                  <div key={incident.id} className="bg-background/20 rounded p-2 text-xs backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{incident.id}</span>
                      <Badge variant={incident.severity === "P1" ? "destructive" : "secondary"} className="text-xs">
                        {incident.severity}
                      </Badge>
                    </div>
                    <div className="text-foreground/80">{incident.title}</div>
                    <div className="flex items-center space-x-2 mt-1 text-foreground/60">
                      <span>{incident.brand}</span>
                      <span>•</span>
                      <span>{incident.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="text-xs opacity-70 mt-2">
              {message.timestamp.toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isFloating) {
    return (
      <div className="h-full flex flex-col">
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          {messages.map(renderMessage)}
          
          {isTyping && (
            <div className="flex justify-start mb-4">
              <div className="flex items-start space-x-2 max-w-[80%]">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-muted">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="rounded-lg p-3 bg-muted/60 backdrop-blur-sm">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </ScrollArea>
        
        {/* Input Area */}
        <div className="border-t p-4 bg-card/50 backdrop-blur-sm">
          <div className="flex space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about incidents..."
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              disabled={isTyping}
              className="bg-input-background border-border/50"
            />
            <Button onClick={handleSend} disabled={!inputValue.trim() || isTyping} className="gradient-primary">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="h-[600px] flex flex-col border-border/50 bg-card/60 backdrop-blur-sm">
        <CardHeader className="border-b border-border/50 gradient-primary text-white">
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>Incident Assistant</span>
          </CardTitle>
          <div className="text-sm text-white/80">
            Ask me about incidents across {userScope.brands.join(", ")}
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            {messages.map(renderMessage)}
            
            {isTyping && (
              <div className="flex justify-start mb-4">
                <div className="flex items-start space-x-2 max-w-[80%]">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-muted">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="rounded-lg p-3 bg-muted/60 backdrop-blur-sm">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </ScrollArea>
          
          {/* Suggested Queries */}
          {messages.length === 1 && (
            <div className="border-t p-4 border-border/50 bg-card/30">
              <div className="text-sm text-muted-foreground mb-2">Try asking:</div>
              <div className="flex flex-wrap gap-2">
                {suggestedQueries.map((query, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSuggestionClick(query)}
                    className="text-xs border-border/50 bg-card/50 hover:bg-card/70"
                  >
                    {query}
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          {/* Input Area */}
          <div className="border-t p-4 border-border/50 bg-card/30">
            <div className="flex space-x-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about incidents, system status, or weekly summaries..."
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                disabled={isTyping}
                className="bg-input-background border-border/50"
              />
              <Button onClick={handleSend} disabled={!inputValue.trim() || isTyping} className="gradient-primary">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}