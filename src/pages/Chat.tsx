import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import ChatListItem from "@/components/chat/ChatListItem";
import BottomNav from "@/components/layout/BottomNav";
import TopNav from "@/components/layout/TopNav";

// 임시 데이터
const mockChats = [
  {
    id: "1",
    name: "민지엄마",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
    lastMessage: "네 좋아요! 내일 2시에 만나요~",
    unreadCount: 2,
    timestamp: "오후 3:24",
  },
  {
    id: "2",
    name: "서준이네",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
    lastMessage: "사진 보내드릴게요",
    unreadCount: 0,
    timestamp: "오전 11:15",
  },
  {
    id: "3",
    name: "하윤맘",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
    lastMessage: "아이 옷 너무 예뻐요 ㅎㅎ",
    unreadCount: 1,
    timestamp: "어제",
  },
  {
    id: "4",
    name: "지우아빠",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=4",
    lastMessage: "감사합니다!",
    unreadCount: 0,
    timestamp: "일요일",
  },
];

const Chat = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const filteredChats = mockChats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pb-16 pt-16">
      <TopNav />
      
      {/* 검색 영역 */}
      <div className="sticky top-16 bg-card border-b border-border z-40">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="채팅 상대방 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-input border-0 rounded-full"
            />
          </div>
        </div>
      </div>

      {/* 채팅 목록 */}
      <div className="max-w-lg mx-auto">
        {filteredChats.length > 0 ? (
          filteredChats.map((chat) => (
            <ChatListItem
              key={chat.id}
              {...chat}
              onClick={() => navigate(`/chat/${chat.id}`, { state: { chat } })}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <p>검색 결과가 없습니다</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Chat;
