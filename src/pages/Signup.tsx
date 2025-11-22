import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";


const signupSchema = z.object({
  nickname: z.string()
    .trim()
    .min(1, { message: "닉네임을 입력해주세요" })
    .max(50, { message: "닉네임은 50자 이내로 입력해주세요" }),
  pw: z.string()
    .min(4, { message: "비밀번호는 최소 4자 이상이어야 합니다" })
    .max(100, { message: "비밀번호는 100자 이내로 입력해주세요" }),
  pwConfirm: z.string()
    .min(1, { message: "비밀번호 확인을 입력해주세요" }),
}).refine((data) => data.pw === data.pwConfirm, {
  message: "비밀번호가 일치하지 않습니다",
  path: ["pwConfirm"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

const Signup = () => {
  const navigate = useNavigate();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      nickname: "",
      pw: "",
      pwConfirm: "",
    },
  });

  const onSubmit = (data: SignupFormValues) => {
    // 다음 단계로 이동하면서 입력한 정보 전달
    navigate("/signup/additional", {
      state: {
        nickname: data.nickname,
        pw: data.pw,
      }
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* 뒤로가기 버튼 */}
      <div className="absolute top-6 left-6">
        <button onClick={() => navigate(-1)} className="hover:opacity-70">
          <ArrowLeft size={24} />
        </button>
      </div>

      {/* 회원가입 폼 */}
      <div className="flex-1 flex items-start justify-center px-6 pt-20">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold text-center mb-8">회원가입</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="nickname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>닉네임</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="닉네임을 입력하세요"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pw"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>비밀번호</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="비밀번호를 입력하세요"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pwConfirm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>비밀번호 확인</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="비밀번호를 다시 입력하세요"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                다음 단계
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
