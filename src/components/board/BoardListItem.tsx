import { Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BoardListItemProps {
  board: {
    id: string;
    name: string;
    memberCount: number;
  };
}

const BoardListItem = ({ board }: BoardListItemProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/board/${board.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="flex items-center justify-between p-4 bg-card rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
    >
      <div className="flex-1">
        <h3 className="font-semibold text-foreground mb-1">{board.name}</h3>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Users size={14} />
          <span>{board.memberCount.toLocaleString()}명</span>
        </div>
      </div>
    </div>
  );
};

export default BoardListItem;
