import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useState } from "react";

const HASHTAGS = ["활동적인","조용한","사교적인","내성적인","호기심많은","신중한","감성적인","논리적인"];

const SignupChildInfo = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { register, handleSubmit } = useForm();
  const [tags, setTags] = useState([]);

  const toggle = (x) =>
    setTags((prev) => prev.includes(x) ? prev.filter(t => t !== x) : [...prev, x]);

  const onSubmit = async (data) => {
    try {
      // 1) 회원가입
      await fetch("http://3.35.8.64:8080/sign/up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname: state.nickname, pw: state.pw }),
      });

      // 2) 로그인
      await fetch("http://3.35.8.64:8080/sign/in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ nickname: state.nickname, pw: state.pw })
      });

      // 3) bio 업데이트
      await fetch("http://3.35.8.64:8080/user/update_basic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ key: "bio", val: state.bio })
      });

      // 4) location 업데이트
      await fetch("http://3.35.8.64:8080/user/update_location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ si: state.si, gu: state.gu })
      });

      // 5) baby 업데이트
      await fetch("http://3.35.8.64:8080/user/update_baby", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          birth: data.birth,
          height: Number(data.height),
          weight: Number(data.weight),
          sex: Number(data.sex),
          tags,
          idx: -1
        })
      });

      toast.success("회원가입 완료!");
      navigate("/login");
    } catch (e) {
      toast.error("서버 오류");
    }
  };

  return (
    <div className="min-h-screen p-8">
      <button onClick={() => navigate(-1)}>
        <ArrowLeft />
      </button>

      <h1 className="text-2xl font-bold mt-6 mb-6">자녀 정보 입력</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-sm mx-auto">
        <Input placeholder="생년월일 (YYYY-MM-DD)" {...register("birth")} />
        <Input placeholder="키(cm)" {...register("height")} />
        <Input placeholder="몸무게(kg)" {...register("weight")} />
        <Input placeholder="성별 (0=여아, 1=남아)" {...register("sex")} />

        <div className="flex flex-wrap gap-2 mt-4">
          {HASHTAGS.map((t) => (
            <button
              type="button"
              className={`px-3 py-1 border rounded ${
                tags.includes(t) ? "bg-black text-white" : ""
              }`}
              onClick={() => toggle(t)}
              key={t}
            >
              {t}
            </button>
          ))}
        </div>

        <Button type="submit" className="w-full mt-4">가입 완료</Button>
      </form>
    </div>
  );
};

export default SignupChildInfo;
