import TopNav from "@/components/layout/TopNav";
import { Input } from "@/components/ui/input";
import { Search, ArrowLeft, Plus } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import PostListItem from "@/components/board/PostListItem";
import { Button } from "@/components/ui/button";

// 임시 데이터
const posts = [
  { id: "1", title: "100 사이즈 겨울 옷 나눔합니다", likeCount: 24, commentCount: 8 },
  { id: "2", title: "아이 옷 사이즈 교환 가능하신 분?", likeCount: 15, commentCount: 12 },
  { id: "3", title: "유아복 정리하다가 나온 것들이에요", likeCount: 31, commentCount: 6 },
  { id: "4", title: "거의 새 옷인데 아이가 안 입어서요", likeCount: 18, commentCount: 5 },
];

const boardNames: { [key: string]: string } = {
  "1": "유아복 교환",
  "2": "육아 꿀팁",
  "3": "유아용품 거래",
  "4": "육아 고민 상담",
  "5": "유아 간식 레시피",
  "6": "놀이터 정보",
};

const BoardDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const boardName = boardNames[id || "1"] || "게시판";

  return (
    <div className="min-h-screen bg-background pt-16">
      <TopNav />
      
      {/* 헤더 */}
      <div className="max-w-lg mx-auto px-6 py-4 border-b">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate("/board")} className="hover:opacity-70">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">{boardName}</h1>
        </div>
        
        {/* 검색 영역 */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              placeholder="제목, 내용 검색"
              className="pl-10"
            />
          </div>
          <Button size="icon" className="flex-shrink-0" onClick={() => navigate(`/board/${id}/write`)}>
            <Plus size={20} />
          </Button>
        </div>
      </div>

      {/* 글 목록 */}
      <div className="max-w-lg mx-auto px-6 py-4">
        <div className="space-y-2">
          {posts.map((post) => (
            <PostListItem key={post.id} post={post} boardId={id || "1"} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BoardDetail;
