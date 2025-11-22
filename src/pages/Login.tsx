import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import logo from "@/assets/logo.png";
import { useAuth } from "@/hooks/useAuth";

const loginSchema = z.object({
  nickname: z
    .string()
    .trim()
    .min(1, { message: "닉네임을 입력해주세요" })
    .max(50, { message: "닉네임은 50자 이내로 입력해주세요" }),
  pw: z
    .string()
    .min(1, { message: "비밀번호를 입력해주세요" })
    .max(100, { message: "비밀번호는 100자 이내로 입력해주세요" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      nickname: "",
      pw: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {

      const response = await fetch("http://localhost:8080/sign/in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname: data.nickname, pw: data.pw }),
        credentials: "include",
      });


      const result = await response.json();

      if (result.code === 200) {
        login(data.nickname);
        toast.success("로그인 성공!");
        navigate("/people");
      } else {
        toast.error(result.message || "로그인에 실패했습니다");
      }
    } catch (error) {
      toast.error("로그인 중 오류가 발생했습니다");
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

      {/* 로고 */}
      <div className="flex justify-center pt-2 -mb-8">
        <img src={logo} alt="쑥쑥마켓" className="h-72" />
      </div>

      {/* 로그인 폼 */}
      <div className="flex-1 flex items-start justify-center px-6">
        <div className="w-full max-w-sm">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="nickname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>닉네임</FormLabel>
                    <FormControl>
                      <Input placeholder="닉네임을 입력하세요" {...field} />
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
                      <Input type="password" placeholder="비밀번호를 입력하세요" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                로그인하기
              </Button>
            </form>
          </Form>
        </div>
      </div>

      {/* 회원가입 버튼 */}
      <div className="absolute bottom-8 right-8">
        <Button variant="outline" onClick={() => navigate("/signup")}>
          회원가입
        </Button>
      </div>
    </div>
  );
};

export default Login;
