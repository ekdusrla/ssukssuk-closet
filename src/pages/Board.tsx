"use client";

import TopNav from "@/components/layout/TopNav";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import BoardListItem from "@/components/board/BoardListItem";
import { useState, useEffect } from "react";

interface Board {
  id: string;
  name: string;
  memberCount: number;
}

const Board = () => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // --- 서버에서 게시판 데이터 가져오기 ---
  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const res = await fetch("/board");
        const json = await res.json();

        if (json.code === 200 && Array.isArray(json.data)) {
          const boards: Board[] = json.data.map((name, idx) => ({
            id: String(idx + 1),
            name,
            memberCount: Math.floor(Math.random() * 1000),
          }));

          setBoards(boards);
        }
      } catch (err) {
        console.error("Failed to fetch boards:", err);
      }
    };

    fetchBoards();
  }, []);

  // --- 검색 필터링 ---
  const filteredBoards = boards.filter((b) =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <div className="space-y-2">
          {filteredBoards.map((board) => (
            <BoardListItem key={board.id} board={board} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Board;
