"use client";

import TopNav from "@/components/layout/TopNav";
import { Input } from "@/components/ui/input";
import { Search, Star } from "lucide-react";
import BoardListItem from "@/components/board/BoardListItem";
import { useState, useEffect } from "react";

interface Board {
  id: string;
  name: string;
  memberCount: number;
  isFavorite: boolean;
}

const Board = () => {
  const [favoriteBoards, setFavoriteBoards] = useState<Board[]>([]);
  const [popularBoards, setPopularBoards] = useState<Board[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // --- 서버에서 게시판 데이터 가져오기 ---
  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const res = await fetch("/board"); // FastAPI /board/ 엔드포인트
        const json = await res.json();

        if (json.code === 200 && Array.isArray(json.data)) {
          // 문자열 배열 → 객체 배열로 변환
          const boards: Board[] = json.data.map((name, idx) => ({
            id: String(idx + 1),
            name,
            memberCount: Math.floor(Math.random() * 1000), // 임시 회원 수
            isFavorite: false, // 초기값 false
          }));

          // 임의로 즐겨찾기/둘러보기 나누기 (짝수 → 즐겨찾기, 홀수 → 둘러보기)
          setFavoriteBoards(boards.filter((_, i) => i % 2 === 0));
          setPopularBoards(boards.filter((_, i) => i % 2 !== 0));
        }
      } catch (err) {
        console.error("Failed to fetch boards:", err);
      }
    };

    fetchBoards();
  }, []);

  // --- 검색 필터링 ---
  const filteredFavoriteBoards = favoriteBoards.filter((b) =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredPopularBoards = popularBoards.filter((b) =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- 즐겨찾기 토글 ---
  const toggleFavorite = (boardId: string) => {
    const fav = favoriteBoards.find((b) => b.id === boardId);
    if (fav) {
      setFavoriteBoards(favoriteBoards.filter((b) => b.id !== boardId));
      setPopularBoards([...popularBoards, { ...fav, isFavorite: false }]);
    } else {
      const pop = popularBoards.find((b) => b.id === boardId);
      if (pop) {
        setPopularBoards(popularBoards.filter((b) => b.id !== boardId));
        setFavoriteBoards([...favoriteBoards, { ...pop, isFavorite: true }]);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background pt-16">
      <TopNav />

      {/* 검색 영역 */}
      <div className="max-w-lg mx-auto px-6 py-4">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            size={20}
          />
          <Input
            placeholder="게시판 이름 검색"
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
            {filteredFavoriteBoards.map((board) => (
              <BoardListItem
                key={board.id}
                board={board}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        </div>

        {/* 둘러보기 섹션 */}
        <div>
          <h2 className="text-lg font-semibold mb-4">둘러보기</h2>
          <div className="space-y-2">
            {filteredPopularBoards.map((board) => (
              <BoardListItem
                key={board.id}
                board={board}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Board;
