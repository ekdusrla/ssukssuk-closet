import BottomNav from "@/components/layout/BottomNav";
import TopNav from "@/components/layout/TopNav";

const Board = () => {
  return (
    <div className="min-h-screen bg-background pb-16 pt-16">
      <TopNav />
      <div className="max-w-lg mx-auto px-4 py-6">
        <p className="text-muted-foreground">게시판 페이지 준비중입니다.</p>
      </div>
      <BottomNav />
    </div>
  );
};

export default Board;
