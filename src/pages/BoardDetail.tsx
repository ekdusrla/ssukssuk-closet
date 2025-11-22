"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search, ArrowLeft, Plus } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import PostListItem from "@/components/board/PostListItem";
import { Button } from "@/components/ui/button";
import TopNav from "@/components/layout/TopNav";

type PostType = {
  id: number | string;
  writer?: string;
  likeCount: number;
  commentCount: number;
};

const BoardDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [posts, setPosts] = useState<PostType[]>([]);
  const [boardName, setBoardName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // 게시판 이름 가져오기
  useEffect(() => {
    const fetchBoardName = async () => {
      try {
        const res = await fetch("http://3.35.8.64/:8080/board/");
        const json = await res.json();
        if (json.code === 200 && Array.isArray(json.data)) {
          const board = json.data.find((b: any) => String(b.id) === id);
          setBoardName(board?.name || "게시판");
        } else {
          setBoardName("게시판");
        }
      } catch (err) {
        console.error("Failed to fetch boards:", err);
        setBoardName("게시판");
      }
    };
    fetchBoardName();
  }, [id]);

  // 게시판 글 목록 가져오기
  useEffect(() => {
  if (!boardName) return;

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://3.35.8.64:8080/board/info?board_name=${encodeURIComponent(boardName)}`
      );
      const json = await res.json();

      if (json.code === 200 && Array.isArray(json.data)) {
        // data 안에 posts 배열이 있다면
        const boardData = json.data.find((b: any) => b.name === boardName);
        const postsArray = boardData?.posts || [];

        setPosts(
          postsArray.map((item: any) => ({
            id: item.id,
            writer: item.writer || "작성자 없음",
            likeCount: item.liked || 0,
            commentCount: item.comments || 0,
          }))
        );
      } else {
        setPosts([]);
      }
    } catch (err) {
      console.error("Failed to fetch posts:", err);
      setPosts([]);
    }
    setLoading(false);
  };

  fetchPosts();
}, [boardName]);


  const filteredPosts = posts.filter(
    (post) =>
      post.writer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(post.id).includes(searchQuery)
  );

  if (!boardName) return <p className="text-center py-6">로딩 중...</p>;

  return (
    <div className="min-h-screen bg-background pt-16">
      <TopNav />

      <div className="max-w-lg mx-auto px-6 py-4 border-b">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate("/board")} className="hover:opacity-70">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">{boardName}</h1>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              size={20}
            />
            <Input
              placeholder="작성자, ID 검색"
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            size="icon"
            className="flex-shrink-0"
            onClick={() => navigate(`/board/${id}/write`)}
          >
            <Plus size={20} />
          </Button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-6 py-4">
        {loading ? (
          <p>로딩 중...</p>
        ) : filteredPosts.length === 0 ? (
          <p>글이 없습니다.</p>
        ) : (
          <div className="space-y-2">
            {filteredPosts.map((post) => (
              <PostListItem
                key={post.id}
                boardId={id || "1"}
                post={{
                  id: post.id,
                  title: `#${post.id} 글`,
                  likeCount: post.likeCount,
                  commentCount: post.commentCount,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BoardDetail;
