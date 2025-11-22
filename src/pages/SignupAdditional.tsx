import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";

const SignupAdditional = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const prev = location.state;

  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    navigate("/signup/children", {
      state: { ...prev, ...data }
    });
  };

  return (
    <div className="min-h-screen p-8">
      <button onClick={() => navigate(-1)}>
        <ArrowLeft />
      </button>

      <h1 className="text-2xl font-bold mt-6 mb-8 text-center">추가 정보 입력</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-sm mx-auto">
        <Input placeholder="시" {...register("si")} />
        <Input placeholder="구" {...register("gu")} />
        <Input placeholder="자기소개" {...register("bio")} />

        <Button type="submit" className="w-full">다음 단계</Button>
      </form>
    </div>
  );
};

export default SignupAdditional;
