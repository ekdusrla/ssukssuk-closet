import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";

const Signup = () => {
  const navigate = useNavigate();

  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    navigate("/signup/additional", { state: data });
  };

  return (
    <div className="min-h-screen p-8">
      <button onClick={() => navigate(-1)}>
        <ArrowLeft />
      </button>

      <h1 className="text-2xl font-bold mt-6 mb-8 text-center">회원가입</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-sm mx-auto">
        <Input placeholder="닉네임" {...register("nickname")} />
        <Input type="password" placeholder="비밀번호" {...register("pw")} />
        <Input type="password" placeholder="비밀번호 확인" {...register("pwConfirm")} />

        <Button type="submit" className="w-full">다음 단계</Button>
      </form>
    </div>
  );
};

export default Signup;
