import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Plus } from "lucide-react";
import ChatHeader from "@/components/chat/ChatHeader";
import MessageBubble from "@/components/chat/MessageBubble";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface Message {
  id: string;
  text: string;
  isMine: boolean;
  timestamp: string;
}

interface ChatLog {
  who: string;
  when: string;
  content: string;
}

const ChatRoom = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams(); // id는 상대방 nickname
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { nickname, isAuthenticated } = useAuth();

  // 채팅 목록에서 전달받은 데이터 또는 기본값
  const chatData = location.state?.chat || {
    name: id || "사용자",
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${id || 'default'}`,
  };

  // 메시지 로드
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const fetchMessages = async () => {
      try {
        const response = await fetch('http://localhost:8080/chat/chat', {
          credentials: 'include',
        });

        const result = await response.json();

        if (result.code === 200 && result.data) {
          // 현재 채팅방의 메시지만 필터링
          const currentChat = result.data.find((chat: any) => chat.with === id);
          
          if (currentChat && currentChat.log) {
            const formattedMessages: Message[] = currentChat.log.map((msg: ChatLog, index: number) => ({
              id: `${msg.when}-${index}`,
              text: msg.content,
              isMine: msg.who === nickname,
              timestamp: formatTimestamp(msg.when),
            }));
            setMessages(formattedMessages);
          }
        }
      } catch (error) {
        console.error('메시지 로딩 실패:', error);
        toast.error('메시지를 불러오지 못했습니다');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [id, nickname, isAuthenticated, navigate]);

  // 메시지가 추가될 때마다 스크롤을 맨 아래로
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTimestamp = (when: string) => {
    // "2025-11-22/16:03" 형식을 "오후 4:03" 형식으로 변환
    const [date, time] = when.split('/');
    const [hour, minute] = time.split(':');
    const hourNum = parseInt(hour);
    const period = hourNum >= 12 ? '오후' : '오전';
    const displayHour = hourNum > 12 ? hourNum - 12 : hourNum === 0 ? 12 : hourNum;
    return `${period} ${displayHour}:${minute}`;
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() && id) {
      const messageText = newMessage.trim();
      
      try {
        const response = await fetch(`http://3.35.8.64/chat/send?other_user=${encodeURIComponent(id)}&content=${encodeURIComponent(messageText)}`, {
          method: 'POST',
          credentials: 'include',
        });

        const result = await response.json();

        if (result.code === 200 || result.code === 201) {
          // 메시지를 로컬 상태에 추가
          const now = new Date();
          const hour = now.getHours();
          const minute = now.getMinutes().toString().padStart(2, "0");
          const period = hour >= 12 ? '오후' : '오전';
          const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
          const timestamp = `${period} ${displayHour}:${minute}`;

          setMessages([
            ...messages,
            {
              id: Date.now().toString(),
              text: messageText,
              isMine: true,
              timestamp,
            },
          ]);
          setNewMessage("");
          
          // 텍스트 영역 높이 초기화
          if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
          }
        } else {
          toast.error('메시지 전송에 실패했습니다');
        }
      } catch (error) {
        console.error('메시지 전송 실패:', error);
        toast.error('메시지 전송 중 오류가 발생했습니다');
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

  const handleAttachFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        // 여기서 이미지를 처리할 수 있습니다
        toast.success("사진이 첨부되었습니다");
        // TODO: 실제 이미지 업로드 및 메시지 전송 로직 구현
      } else {
        toast.error("이미지 파일만 첨부 가능합니다");
      }
    }
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
          {loading ? (
            <div className="flex items-center justify-center py-20 text-muted-foreground">
              <p>로딩 중...</p>
            </div>
          ) : messages.length > 0 ? (
            messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg.text} isMine={msg.isMine} timestamp={msg.timestamp} />
            ))
          ) : (
            <div className="flex items-center justify-center py-20 text-muted-foreground">
              <p>메시지가 없습니다. 첫 메시지를 보내보세요!</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 메시지 입력 영역 */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-end gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <Button
            onClick={handleAttachFile}
            variant="ghost"
            size="icon"
            className="flex-shrink-0 w-11 h-11"
          >
            <Plus className="w-5 h-5" />
          </Button>
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
