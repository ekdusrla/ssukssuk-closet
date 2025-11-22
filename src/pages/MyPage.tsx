import BottomNav from "@/components/layout/BottomNav";

const MyPage = () => {
  return (
    <div className="min-h-screen bg-background pb-16">
      <div className="max-w-lg mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-foreground mb-4">마이페이지</h1>
        <p className="text-muted-foreground">마이페이지 준비중입니다.</p>
      </div>
      <BottomNav />
    </div>
  );
};

export default MyPage;
