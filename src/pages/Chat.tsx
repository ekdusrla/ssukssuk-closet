import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import ChatListItem from "@/components/chat/ChatListItem";
import TopNav from "@/components/layout/TopNav";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface ChatRoom {
  with: string;
  last_message: {
    who: string;
    when: string;
    content: string;
  };
}

interface ChatListData {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  unreadCount: number;
  timestamp: string;
}

const Chat = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [chats, setChats] = useState<ChatListData[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { nickname, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const fetchChatRooms = async () => {
      try {
        const response = await fetch('http://localhost:8080/chat/chat/rooms', {
          credentials: 'include',
        });

        const result = await response.json();

        if (result.code === 200 && result.data) {
          const chatListData: ChatListData[] = result.data.map((room: ChatRoom, index: number) => ({
            id: room.with,
            name: room.with,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${room.with}`,
            lastMessage: room.last_message.content,
            unreadCount: 0,
            timestamp: formatTimestamp(room.last_message.when),
          }));
          setChats(chatListData);
        }
      } catch (error) {
        console.error('채팅방 목록 로딩 실패:', error);
        toast.error('채팅방 목록을 불러오지 못했습니다');
      } finally {
        setLoading(false);
      }
    };

    fetchChatRooms();
  }, [isAuthenticated, navigate]);

  const formatTimestamp = (when: string) => {
    // "2025-11-22/16:03" 형식을 "오후 4:03" 형식으로 변환
    const [date, time] = when.split('/');
    const [hour, minute] = time.split(':');
    const hourNum = parseInt(hour);
    const period = hourNum >= 12 ? '오후' : '오전';
    const displayHour = hourNum > 12 ? hourNum - 12 : hourNum;
    return `${period} ${displayHour}:${minute}`;
  };

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pt-16">
      <TopNav />
      
      {/* 검색 영역 */}
      <div className="max-w-lg mx-auto px-6 py-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
          <Input
            type="text"
            placeholder="채팅 검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* 채팅 목록 */}
      <div className="max-w-lg mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <p>로딩 중...</p>
          </div>
        ) : filteredChats.length > 0 ? (
          filteredChats.map((chat) => (
            <ChatListItem
              key={chat.id}
              {...chat}
              onClick={() => navigate(`/chat/${chat.id}`, { state: { chat } })}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <p>{searchQuery ? '검색 결과가 없습니다' : '채팅방이 없습니다'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
