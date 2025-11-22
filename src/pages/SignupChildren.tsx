import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useEffect } from "react";

const SignupChildren = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { nickname, pw, city, district, bio } = location.state || {};

  useEffect(() => {
    if (!nickname || !pw || !city || !district || !bio) {
      toast.error("회원가입 처음부터 진행해주세요");
      navigate("/signup");
    }
  }, [nickname, pw, city, district, bio, navigate]);

  const handleYes = () => {
    navigate("/signup/child-info", {
      state: {
        nickname,
        pw,
        city,
        district,
        bio,
      },
    });
  };

  const handleNo = async () => {
    try {
      const response = await fetch("http://3.35.8.64/board/up", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          nickname,
          pw,
        }),
      });

      const result = await response.json();

      if (result.code === 200) {
        toast.success("회원가입이 완료되었습니다!");
        navigate("/login");
      } else {
        toast.error("회원가입에 실패했습니다");
      }
    } catch (error) {
      toast.error("회원가입 중 오류가 발생했습니다");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* 뒤로가기 버튼 */}
      <div className="absolute top-6 left-6">
        <button onClick={() => navigate(-1)} className="hover:opacity-70">
          <ArrowLeft size={24} />
        </button>
      </div>

      {/* 콘텐츠 */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm text-center">
          <h1 className="text-3xl font-bold mb-12">자녀가 있나요?</h1>

          <div className="space-y-4">
            <Button onClick={handleYes} className="w-full h-14 text-lg">
              예
            </Button>
            <Button onClick={handleNo} variant="outline" className="w-full h-14 text-lg">
              아니오
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupChildren;
