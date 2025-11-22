import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ChatListItemProps {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  unreadCount?: number;
  timestamp: string;
  onClick: () => void;
}

const ChatListItem = ({
  name,
  avatar,
  lastMessage,
  unreadCount,
  timestamp,
  onClick,
}: ChatListItemProps) => {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 p-4 hover:bg-muted/50 active:bg-muted transition-colors cursor-pointer border-b border-border"
    >
      <Avatar className="w-12 h-12 flex-shrink-0">
        <AvatarImage src={avatar} alt={name} />
        <AvatarFallback>{name[0]}</AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="font-semibold text-foreground truncate">{name}</span>
          <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">{timestamp}</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className={cn(
            "text-sm truncate",
            unreadCount ? "font-medium text-foreground" : "text-muted-foreground"
          )}>
            {lastMessage}
          </p>
          {unreadCount && unreadCount > 0 && (
            <Badge className="bg-primary text-primary-foreground rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 flex-shrink-0">
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatListItem;
