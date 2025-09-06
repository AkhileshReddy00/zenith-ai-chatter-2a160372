import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatMessages from "@/components/chat/ChatMessages";
import ChatInput from "@/components/chat/ChatInput";
import { User } from "@supabase/supabase-js";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export interface Chat {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  is_archived: boolean;
}

export interface Message {
  id: string;
  chat_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  created_at: string;
}

export default function ChatPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    checkUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      loadChats();
    }
  }, [user]);

  useEffect(() => {
    if (currentChat) {
      loadMessages(currentChat.id);
    }
  }, [currentChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    } else {
      setUser(session.user);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadChats = async () => {
    try {
      const { data, error } = await supabase
        .from("chats")
        .select("*")
        .eq("user_id", user?.id)
        .eq("is_archived", false)
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setChats(data || []);

      if (data && data.length > 0 && !currentChat) {
        setCurrentChat(data[0]);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load chats",
        variant: "destructive",
      });
    }
  };

  const loadMessages = async (chatId: string) => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("chat_id", chatId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setMessages((data as Message[]) || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load messages",
        variant: "destructive",
      });
    }
  };

  const createNewChat = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("chats")
        .insert([
          {
            user_id: user.id,
            title: "New Chat",
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setChats([data, ...chats]);
      setCurrentChat(data);
      setMessages([]);
      setSidebarOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create new chat",
        variant: "destructive",
      });
    }
  };

  const selectChat = (chat: Chat) => {
    setCurrentChat(chat);
    setSidebarOpen(false);
  };

  const deleteChat = async (chatId: string) => {
    try {
      const { error } = await supabase
        .from("chats")
        .delete()
        .eq("id", chatId);

      if (error) throw error;

      const updatedChats = chats.filter((chat) => chat.id !== chatId);
      setChats(updatedChats);
      
      if (currentChat?.id === chatId) {
        setCurrentChat(updatedChats[0] || null);
        setMessages([]);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete chat",
        variant: "destructive",
      });
    }
  };

  const renameChat = async (chatId: string, newTitle: string) => {
    try {
      const { error } = await supabase
        .from("chats")
        .update({ title: newTitle })
        .eq("id", chatId);

      if (error) throw error;

      setChats(chats.map((chat) => 
        chat.id === chatId ? { ...chat, title: newTitle } : chat
      ));
      
      if (currentChat?.id === chatId) {
        setCurrentChat({ ...currentChat, title: newTitle });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to rename chat",
        variant: "destructive",
      });
    }
  };

  const sendMessage = async (content: string) => {
    if (!currentChat || !user) return;

    setLoading(true);
    try {
      // Add user message
      const { data: userMessage, error: userError } = await supabase
        .from("messages")
        .insert([
          {
            chat_id: currentChat.id,
            role: "user",
            content,
          },
        ])
        .select()
        .single();

      if (userError) throw userError;
      setMessages([...messages, userMessage as Message]);

      // Simulate AI response (replace with actual AI API call)
      setTimeout(async () => {
        const aiResponse = "I'm a simulated AI response. Integrate with your preferred AI API for real responses!";
        
        const { data: assistantMessage, error: assistantError } = await supabase
          .from("messages")
          .insert([
            {
              chat_id: currentChat.id,
              role: "assistant",
              content: aiResponse,
            },
          ])
          .select()
          .single();

        if (assistantError) throw assistantError;
        
        setMessages((prev) => [...prev, assistantMessage as Message]);
        
        // Update chat title if it's still "New Chat"
        if (currentChat.title === "New Chat") {
          const newTitle = content.slice(0, 30) + (content.length > 30 ? "..." : "");
          await renameChat(currentChat.id, newTitle);
        }
        
        setLoading(false);
      }, 1000);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const sidebarContent = (
    <ChatSidebar
      chats={chats}
      currentChat={currentChat}
      onNewChat={createNewChat}
      onSelectChat={selectChat}
      onDeleteChat={deleteChat}
      onRenameChat={renameChat}
      onSignOut={signOut}
      user={user}
    />
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        {sidebarContent}
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-80">
          {sidebarContent}
        </SheetContent>
      </Sheet>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b">
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <h1 className="text-lg font-semibold">{currentChat?.title || "New Chat"}</h1>
          <div className="w-10" />
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center space-y-4 p-8">
                <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  How can I help you today?
                </h2>
                <p className="text-muted-foreground">
                  Start a conversation by typing a message below
                </p>
              </div>
            </div>
          ) : (
            <ChatMessages messages={messages} />
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <ChatInput onSendMessage={sendMessage} disabled={loading || !currentChat} />
      </div>
    </div>
  );
}