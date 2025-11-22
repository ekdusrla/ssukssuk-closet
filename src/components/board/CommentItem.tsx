interface CommentItemProps {
  comment: {
    id: string;
    author: string;
    content: string;
    time: string;
  };
}

const CommentItem = ({ comment }: CommentItemProps) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-sm">{comment.author}</span>
        <span className="text-xs text-muted-foreground">{comment.time}</span>
      </div>
      <p className="text-sm text-foreground">{comment.content}</p>
    </div>
  );
};

export default CommentItem;
