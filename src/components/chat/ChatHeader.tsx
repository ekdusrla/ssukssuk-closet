import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MoreVertical } from "lucide-react";

interface ChatHeaderProps {
  name: string;
  avatar: string;
  onBack: () => void;
}

const ChatHeader = ({ name, avatar, onBack }: ChatHeaderProps) => {
  return (
    <div className="fixed top-0 left-0 right-0 bg-card border-b border-border z-50">
      <div className="max-w-lg mx-auto flex items-center justify-between px-4 h-14">
        <Button variant="ghost" size="icon" onClick={onBack} className="flex-shrink-0">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        
        <div className="flex items-center gap-2 flex-1 min-w-0 mx-3">
          <Avatar className="w-9 h-9 flex-shrink-0">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback>{name[0]}</AvatarFallback>
          </Avatar>
          <span className="font-semibold text-foreground truncate">{name}</span>
        </div>

        <Button variant="ghost" size="icon" className="flex-shrink-0">
          <MoreVertical className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
