import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Paperclip } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSendMessage, disabled }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t bg-background p-4">
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
        <div className="relative flex items-end gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="mb-1"
            disabled={disabled}
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="min-h-[44px] max-h-[200px] resize-none pr-12 py-3"
            rows={1}
            disabled={disabled}
          />
          
          <Button
            type="submit"
            size="icon"
            className="mb-1 bg-gradient-primary hover:opacity-90 transition-opacity"
            disabled={disabled || !message.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground text-center mt-2">
          Press Enter to send, Shift + Enter for new line
        </p>
      </form>
    </div>
  );
}