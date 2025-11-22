import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  message: string;
  isMine: boolean;
  timestamp: string;
}

const MessageBubble = ({ message, isMine, timestamp }: MessageBubbleProps) => {
  return (
    <div className={cn("flex mb-4", isMine ? "justify-end" : "justify-start")}>
      <div className={cn("flex flex-col max-w-[75%]", isMine ? "items-end" : "items-start")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-2.5 shadow-sm",
            isMine
              ? "bg-secondary text-foreground rounded-br-md"
              : "bg-muted text-foreground rounded-bl-md"
          )}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message}</p>
        </div>
        <span className="text-xs text-muted-foreground mt-1 px-1">{timestamp}</span>
      </div>
    </div>
  );
};

export default MessageBubble;
