import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
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
import { useEffect } from "react";

const additionalInfoSchema = z.object({
  name: z.string()
    .trim()
    .min(1, { message: "이름을 입력해주세요" })
    .max(50, { message: "이름은 50자 이내로 입력해주세요" }),
  email: z.string()
    .trim()
    .email({ message: "올바른 이메일 주소를 입력해주세요" })
    .max(100, { message: "이메일은 100자 이내로 입력해주세요" }),
  phone: z.string()
    .trim()
    .min(1, { message: "전화번호를 입력해주세요" })
    .regex(/^[0-9-]+$/, { message: "올바른 전화번호 형식을 입력해주세요" })
    .max(20, { message: "전화번호는 20자 이내로 입력해주세요" }),
});

type AdditionalInfoFormValues = z.infer<typeof additionalInfoSchema>;

const SignupAdditional = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { nickname, pw } = location.state || {};

  useEffect(() => {
    // 이전 단계에서 전달된 정보가 없으면 첫 단계로 리다이렉트
    if (!nickname || !pw) {
      toast.error("회원가입 첫 단계부터 진행해주세요");
      navigate("/signup");
    }
  }, [nickname, pw, navigate]);

  const form = useForm<AdditionalInfoFormValues>({
    resolver: zodResolver(additionalInfoSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = async (data: AdditionalInfoFormValues) => {
    try {
      // 실제 회원가입 API 호출
      const response = await fetch('/sign/up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          nickname: nickname,
          pw: pw,
          // 추가 정보는 필요시 API에 전달
          // name: data.name,
          // email: data.email,
          // phone: data.phone,
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

      {/* 회원가입 폼 */}
      <div className="flex-1 flex items-start justify-center px-6 pt-20">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold text-center mb-2">추가 정보 입력</h1>
          <p className="text-sm text-muted-foreground text-center mb-8">
            서비스 이용을 위한 추가 정보를 입력해주세요
          </p>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이름</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="이름을 입력하세요"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이메일</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="example@email.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>전화번호</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="010-0000-0000"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                가입하기
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default SignupAdditional;
