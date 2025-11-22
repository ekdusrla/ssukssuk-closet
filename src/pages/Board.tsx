import TopNav from "@/components/layout/TopNav";
import { Input } from "@/components/ui/input";
import { Search, Star } from "lucide-react";
import BoardListItem from "@/components/board/BoardListItem";
import { useState } from "react";

// 임시 데이터
const initialFavoriteBoards = [
  { id: "1", name: "유아복 교환", memberCount: 1234, isFavorite: true },
  { id: "2", name: "육아 꿀팁", memberCount: 5678, isFavorite: true },
];

const initialPopularBoards = [
  { id: "3", name: "유아용품 거래", memberCount: 9012, isFavorite: false },
  { id: "4", name: "육아 고민 상담", memberCount: 7890, isFavorite: false },
  { id: "5", name: "유아 간식 레시피", memberCount: 6543, isFavorite: false },
  { id: "6", name: "놀이터 정보", memberCount: 4321, isFavorite: false },
];

const Board = () => {
  const [favoriteBoards, setFavoriteBoards] = useState(initialFavoriteBoards);
  const [popularBoards, setPopularBoards] = useState(initialPopularBoards);

  const toggleFavorite = (boardId: string) => {
    // 즐겨찾기에서 찾기
    const favoriteBoard = favoriteBoards.find(b => b.id === boardId);
    
    if (favoriteBoard) {
      // 즐겨찾기에서 제거하고 둘러보기로 이동
      setFavoriteBoards(favoriteBoards.filter(b => b.id !== boardId));
      setPopularBoards([...popularBoards, { ...favoriteBoard, isFavorite: false }]);
    } else {
      // 둘러보기에서 찾아서 즐겨찾기로 이동
      const popularBoard = popularBoards.find(b => b.id === boardId);
      if (popularBoard) {
        setPopularBoards(popularBoards.filter(b => b.id !== boardId));
        setFavoriteBoards([...favoriteBoards, { ...popularBoard, isFavorite: true }]);
      }
    }
  };
  return (
    <div className="min-h-screen bg-background pt-16">
      <TopNav />
      
      {/* 검색 영역 */}
      <div className="max-w-lg mx-auto px-6 py-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
          <Input
            placeholder="게시판 이름 검색"
            className="pl-10"
          />
        </div>
      </div>

      {/* 게시판 목록 */}
      <div className="max-w-lg mx-auto px-6 pb-6">
        {/* 즐겨찾기 섹션 */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Star className="text-primary fill-primary" size={20} />
            <h2 className="text-lg font-semibold">즐겨찾기</h2>
          </div>
          <div className="space-y-2">
            {favoriteBoards.map((board) => (
              <BoardListItem key={board.id} board={board} onToggleFavorite={toggleFavorite} />
            ))}
          </div>
        </div>

        {/* 둘러보기 섹션 */}
        <div>
          <h2 className="text-lg font-semibold mb-4">둘러보기</h2>
          <div className="space-y-2">
            {popularBoards.map((board) => (
              <BoardListItem key={board.id} board={board} onToggleFavorite={toggleFavorite} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Board;
