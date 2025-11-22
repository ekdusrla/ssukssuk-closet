import BottomNav from "@/components/layout/BottomNav";
import TopNav from "@/components/layout/TopNav";

const MyPage = () => {
  return (
    <div className="min-h-screen bg-background pb-16 pt-16">
      <TopNav />
      <div className="max-w-lg mx-auto px-4 py-6">
        <p className="text-muted-foreground">마이페이지 준비중입니다.</p>
      </div>
      <BottomNav />
    </div>
  );
};

export default MyPage;
