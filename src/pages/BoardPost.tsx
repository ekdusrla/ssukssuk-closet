"use client";

import TopNav from "@/components/layout/TopNav";
import { ArrowLeft, Heart, Send, MessageCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const BoardPost = () => {
  const navigate = useNavigate();
  const { postId, boardId } = useParams();
  const [post, setPost] = useState<any>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comment, setComment] = useState("");

  // 글 내용 가져오기
  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) return;
      try {
        const res = await fetch(`http://localhost:8080/board/content?board_id=${postId}`);
        const json = await res.json();
        if (json.code === 200) {
          setPost(json.data);
          setIsLiked(false);
          setLikeCount(json.data.liked || 0);
        }
      } catch (err) {
        console.error("Failed to fetch post content:", err);
      }
    };
    fetchPost();
  }, [postId]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  const handleCommentSubmit = () => {
    if (comment.trim()) {
      // TODO: 댓글 등록 API 호출
      setComment("");
    }
  };

  if (!post) return <p className="text-center py-6">로딩 중...</p>;

  return (
    <div className="min-h-screen bg-background pt-16 pb-20">
      <TopNav />

      {/* 헤더 */}
      <div className="max-w-lg mx-auto px-6 py-4 border-b">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(`/board/${boardId}`)} className="hover:opacity-70">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold flex-1">{post.title}</h1>
          <button onClick={handleLike} className="flex items-center gap-1 hover:opacity-70">
            <Heart size={24} className={isLiked ? "text-primary fill-primary" : "text-muted-foreground"} />
            <span className="text-sm">{likeCount}</span>
          </button>
        </div>
      </div>

      {/* 본문 */}
      <div className="max-w-lg mx-auto px-6 py-6">
        <div className="p-4 bg-card rounded-lg mb-6">
          <p className="text-foreground leading-relaxed mb-4">{post.content}</p>

          {/* 작성자 정보 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>{post.writer[0]}</AvatarFallback>
              </Avatar>
              <span className="font-semibold text-sm">{post.writer}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/chat/1')}
              className="gap-2"
            >
              <MessageCircle size={16} />
              채팅하기
            </Button>
          </div>
        </div>

        {/* 댓글 섹션 */}
        <div>
          <h2 className="text-lg font-semibold mb-4">댓글</h2>
          {/* 댓글 목록 API 연결 필요 */}
          <p className="text-sm text-muted-foreground">댓글 기능은 추후 구현 예정</p>
        </div>
      </div>

      {/* 댓글 입력 */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t">
        <div className="max-w-lg mx-auto px-6 py-3">
          <div className="flex gap-2 items-end">
            <Textarea
              placeholder="댓글을 입력하세요"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="flex-1 h-[44px] min-h-[44px] max-h-[100px] resize-none py-3"
            />
            <Button onClick={handleCommentSubmit} size="icon" className="h-[44px] w-[44px] flex-shrink-0" disabled={!comment.trim()}>
              <Send size={18} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardPost;
