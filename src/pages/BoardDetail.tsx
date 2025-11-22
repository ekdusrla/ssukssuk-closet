import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search, ArrowLeft, Plus } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import PostListItem from "@/components/board/PostListItem";
import { Button } from "@/components/ui/button";
import TopNav from "@/components/layout/TopNav";

type PostType = {
  id: number;
  writer: string;
  liked: number;
  comments: number;
  title?: string;
};

const BoardDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [posts, setPosts] = useState<PostType[]>([]);
  const [boardName, setBoardName] = useState("게시판");
  const [loading, setLoading] = useState(true);

  // 게시판 이름 가져오기
  useEffect(() => {
    const fetchBoardName = async () => {
      const res = await fetch(`http://localhost:8080/board/`);
      const json = await res.json();
      if (json.code === 200) {
        const boards: string[] = json.data;
        const idx = Number(id) - 1;
        setBoardName(boards[idx] || "게시판");
      }
    };
    fetchBoardName();
  }, [id]);

  // 게시판 글 목록 가져오기
  useEffect(() => {
    if (!boardName) return;

    const fetchPosts = async () => {
      setLoading(true);
      const res = await fetch(`http://localhost:8080/board/info?board_name=${encodeURIComponent(boardName)}`);
      const json = await res.json();
      if (json.code === 200) {
        setPosts(json.data);
      }
      setLoading(false);
    };
    fetchPosts();
  }, [boardName]);

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
            <Input placeholder="제목, 내용 검색" className="pl-10" />
          </div>
          <Button size="icon" className="flex-shrink-0" onClick={() => navigate(`/board/${id}/write`)}>
            <Plus size={20} />
          </Button>
        </div>
      </div>

      {/* 글 목록 */}
      <div className="max-w-lg mx-auto px-6 py-4">
        {loading ? (
          <p>로딩 중...</p>
        ) : posts.length === 0 ? (
          <p>글이 없습니다.</p>
        ) : (
          <div className="space-y-2">
            {posts.map((post) => (
              <PostListItem key={post.id} post={post} boardId={id || "1"} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BoardDetail;
