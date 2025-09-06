import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Plus, MoreVertical, Trash2, Edit, LogOut, MessageSquare } from "lucide-react";
import { Chat } from "@/pages/Chat";

interface ChatSidebarProps {
  chats: Chat[];
  currentChat: Chat | null;
  onNewChat: () => void;
  onSelectChat: (chat: Chat) => void;
  onDeleteChat: (chatId: string) => void;
  onRenameChat: (chatId: string, newTitle: string) => void;
  onSignOut: () => void;
  user: User | null;
}

export default function ChatSidebar({
  chats,
  currentChat,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  onRenameChat,
  onSignOut,
  user,
}: ChatSidebarProps) {
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const handleRename = (chatId: string) => {
    if (editTitle.trim()) {
      onRenameChat(chatId, editTitle.trim());
      setEditingChatId(null);
      setEditTitle("");
    }
  };

  const startEditing = (chat: Chat) => {
    setEditingChatId(chat.id);
    setEditTitle(chat.title);
  };

  return (
    <div className="w-80 bg-card border-r flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b">
        <Button 
          onClick={onNewChat} 
          className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Chat
        </Button>
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1 px-2 py-2">
        <div className="space-y-1">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                currentChat?.id === chat.id
                  ? "bg-accent"
                  : "hover:bg-accent/50"
              }`}
              onClick={() => onSelectChat(chat)}
            >
              <MessageSquare className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              
              {editingChatId === chat.id ? (
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onBlur={() => handleRename(chat.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleRename(chat.id);
                    } else if (e.key === "Escape") {
                      setEditingChatId(null);
                    }
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 h-7 text-sm"
                  autoFocus
                />
              ) : (
                <span className="flex-1 text-sm truncate">{chat.title}</span>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => startEditing(chat)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Rename
                  </DropdownMenuItem>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Chat</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this chat? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDeleteChat(chat.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* User Profile */}
      <div className="p-4 border-t">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start p-2">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback>
                  {user?.email?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm truncate">
                {user?.user_metadata?.full_name || user?.email}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem disabled>
              <span className="text-xs text-muted-foreground">
                {user?.email}
              </span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}