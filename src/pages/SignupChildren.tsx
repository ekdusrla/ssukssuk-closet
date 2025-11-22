import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const SignupChildren = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const handleNo = async () => {
    try {
      // 1) 회원가입
      await fetch("http://backend:8080/sign/up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nickname: state.nickname,
          pw: state.pw
        }),
      });

      // 2) 로그인 → session 쿠키 획득
      await fetch("http://backend:8080/sign/in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          nickname: state.nickname,
          pw: state.pw
        }),
      });

      // 3) bio 업데이트
      await fetch("http://backend:8080/user/update_basic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ key: "bio", val: state.bio })
      });

      // 4) location 업데이트
      await fetch("http://backend:8080/user/update_location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ si: state.si, gu: state.gu })
      });

      toast.success("회원가입 완료!");
      navigate("/login");
    } catch (e) {
      toast.error("오류 발생");
    }
  };

  const handleYes = () => {
    navigate("/signup/child-info", { state });
  };

  return (
    <div className="min-h-screen p-8 flex flex-col items-center justify-center">
      <button className="absolute top-6 left-6" onClick={() => navigate(-1)}>
        <ArrowLeft />
      </button>

      <h1 className="text-3xl font-bold mb-12">자녀가 있나요?</h1>

      <div className="space-y-4 w-full max-w-sm">
        <Button className="w-full h-14 text-lg" onClick={handleYes}>예</Button>
        <Button className="w-full h-14 text-lg" variant="outline" onClick={handleNo}>아니오</Button>
      </div>
    </div>
  );
};

export default SignupChildren;
