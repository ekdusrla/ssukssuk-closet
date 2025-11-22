import { Heart, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PostListItemProps {
  post: {
    id: number | string;      // number도 받을 수 있도록 변경
    title: string;
    likeCount: number;
    commentCount: number;
  };
  boardId: string;
}

const PostListItem = ({ post, boardId }: PostListItemProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/board/${boardId}/post/${post.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="p-4 bg-card rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
    >
      <h3 className="font-medium text-foreground mb-3">{post.title}</h3>
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Heart size={16} />
          <span>{post.likeCount}</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageCircle size={16} />
          <span>{post.commentCount}</span>
        </div>
      </div>
    </div>
  );
};

export default PostListItem;
