import TopNav from "@/components/layout/TopNav";
import { ArrowLeft, Heart, Send } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import CommentItem from "@/components/board/CommentItem";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

// 임시 데이터
const postData: { [key: string]: any } = {
  "1": {
    title: "100 사이즈 겨울 옷 나눔합니다",
    content: "아이가 빨리 커서 거의 새 옷인데 못 입게 되었어요. 필요하신 분께 나눔하고 싶습니다. 댓글 남겨주세요!",
    likeCount: 24,
    isLiked: false,
  },
  "2": {
    title: "아이 옷 사이즈 교환 가능하신 분?",
    content: "90 사이즈를 100 사이즈로 교환하고 싶어요. 거의 새 것이고 브랜드 옷입니다.",
    likeCount: 15,
    isLiked: false,
  },
};

const comments = [
  { id: "1", author: "엄마1", content: "저 관심있어요! 연락주세요~", time: "5분 전" },
  { id: "2", author: "육아맘", content: "좋은 나눔 감사합니다 ㅎㅎ", time: "10분 전" },
  { id: "3", author: "아빠조아", content: "혹시 아직 가능할까요?", time: "15분 전" },
];

const BoardPost = () => {
  const navigate = useNavigate();
  const { boardId, postId } = useParams();
  const post = postData[postId || "1"] || postData["1"];
  
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [comment, setComment] = useState("");

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  const handleCommentSubmit = () => {
    if (comment.trim()) {
      // 댓글 추가 로직 (추후 구현)
      setComment("");
    }
  };

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
          <button
            onClick={handleLike}
            className="flex items-center gap-1 hover:opacity-70"
          >
            <Heart
              size={24}
              className={isLiked ? "text-primary fill-primary" : "text-muted-foreground"}
            />
            <span className="text-sm">{likeCount}</span>
          </button>
        </div>
      </div>

      {/* 본문 */}
      <div className="max-w-lg mx-auto px-6 py-6">
        <div className="p-4 bg-card rounded-lg mb-6">
          <p className="text-foreground leading-relaxed">{post.content}</p>
        </div>

        {/* 댓글 섹션 */}
        <div>
          <h2 className="text-lg font-semibold mb-4">
            댓글 {comments.length}
          </h2>
          <div className="divide-y">
            {comments.map((commentItem) => (
              <div key={commentItem.id} className="py-3 first:pt-0">
                <CommentItem comment={commentItem} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 댓글 입력 영역 (하단 고정) */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t">
        <div className="max-w-lg mx-auto px-6 py-3">
          <div className="flex gap-2 items-end">
            <Textarea
              placeholder="댓글을 입력하세요"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="flex-1 h-[44px] min-h-[44px] max-h-[100px] resize-none py-3"
            />
            <Button
              onClick={handleCommentSubmit}
              size="icon"
              className="h-[44px] w-[44px] flex-shrink-0"
              disabled={!comment.trim()}
            >
              <Send size={18} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardPost;
