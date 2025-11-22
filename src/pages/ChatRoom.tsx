import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import ChatHeader from "@/components/chat/ChatHeader";
import MessageBubble from "@/components/chat/MessageBubble";

interface Message {
  id: string;
  text: string;
  isMine: boolean;
  timestamp: string;
}

// 임시 메시지 데이터
const mockMessages: Message[] = [
  {
    id: "1",
    text: "안녕하세요! 올려주신 아이 옷 아직 있나요?",
    isMine: false,
    timestamp: "오후 2:10",
  },
  {
    id: "2",
    text: "네 있어요! 관심 가져주셔서 감사해요 ☺️",
    isMine: true,
    timestamp: "오후 2:12",
  },
  {
    id: "3",
    text: "95 사이즈 맞나요? 우리 아이한테 딱 맞을 것 같아서요",
    isMine: false,
    timestamp: "오후 2:15",
  },
  {
    id: "4",
    text: "네 맞아요! 실측 사진 보내드릴까요?",
    isMine: true,
    timestamp: "오후 2:16",
  },
  {
    id: "5",
    text: "아 그럼 좋겠어요!",
    isMine: false,
    timestamp: "오후 2:20",
  },
  {
    id: "6",
    text: "네 좋아요! 내일 2시에 만나요~",
    isMine: true,
    timestamp: "오후 3:24",
  },
];

const ChatRoom = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 채팅 목록에서 전달받은 데이터 또는 기본값
  const chatData = location.state?.chat || {
    name: "사용자",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=default",
  };

  // 메시지가 추가될 때마다 스크롤을 맨 아래로
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const now = new Date();
      const timestamp = `오후 ${now.getHours()}:${now.getMinutes().toString().padStart(2, "0")}`;

      setMessages([
        ...messages,
        {
          id: Date.now().toString(),
          text: newMessage,
          isMine: true,
          timestamp,
        },
      ]);
      setNewMessage("");
      
      // 텍스트 영역 높이 초기화
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value);
    
    // 자동 높이 조절
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* 헤더 */}
      <ChatHeader
        name={chatData.name}
        avatar={chatData.avatar}
        onBack={() => navigate("/chat")}
      />

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto pt-14 pb-20 px-4">
        <div className="max-w-lg mx-auto py-4">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg.text} isMine={msg.isMine} timestamp={msg.timestamp} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 메시지 입력 영역 */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-end gap-2">
          <Textarea
            ref={textareaRef}
            value={newMessage}
            onChange={handleTextareaChange}
            onKeyPress={handleKeyPress}
            placeholder="메시지를 입력하세요"
            className="flex-1 min-h-[44px] max-h-[120px] resize-none rounded-2xl border-input focus-visible:ring-primary"
            rows={1}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            size="icon"
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full w-11 h-11 flex-shrink-0"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
