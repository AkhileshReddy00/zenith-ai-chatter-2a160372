import { Message } from "@/pages/Chat";
import { cn } from "@/lib/utils";
import { User, Bot } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ChatMessagesProps {
  messages: Message[];
}

export default function ChatMessages({ messages }: ChatMessagesProps) {
  return (
    <div className="px-4 py-8 space-y-6">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "flex gap-3 max-w-3xl mx-auto",
            message.role === "user" ? "justify-end" : "justify-start"
          )}
        >
          {message.role === "assistant" && (
            <Avatar className="h-8 w-8 bg-gradient-primary">
              <AvatarFallback className="bg-gradient-primary text-white">
                <Bot className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          )}
          
          <div
            className={cn(
              "px-4 py-2 rounded-2xl max-w-[80%] break-words",
              message.role === "user"
                ? "bg-primary text-primary-foreground"
                : "bg-muted"
            )}
          >
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          </div>
          
          {message.role === "user" && (
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      ))}
    </div>
  );
}