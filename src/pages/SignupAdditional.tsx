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
  city: z.string()
    .trim()
    .min(1, { message: "시를 입력해주세요" })
    .max(50, { message: "시는 50자 이내로 입력해주세요" }),
  district: z.string()
    .trim()
    .min(1, { message: "구를 입력해주세요" })
    .max(50, { message: "구는 50자 이내로 입력해주세요" }),
  bio: z.string()
    .trim()
    .min(1, { message: "자기소개를 입력해주세요" })
    .max(200, { message: "자기소개는 200자 이내로 입력해주세요" }),
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
      city: "",
      district: "",
      bio: "",
    },
  });

  const onSubmit = (data: AdditionalInfoFormValues) => {
    // 다음 단계로 이동하면서 모든 정보 전달
    navigate("/signup/children", {
      state: {
        nickname,
        pw,
        city: data.city,
        district: data.district,
        bio: data.bio,
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
          <h1 className="text-2xl font-bold text-center mb-2">추가 정보 입력</h1>
          <p className="text-sm text-muted-foreground text-center mb-8">
            서비스 이용을 위한 추가 정보를 입력해주세요
          </p>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>시</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="예: 서울특별시"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="district"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>구</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="예: 강남구"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>짧은 자기소개</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="자기소개를 입력하세요"
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

export default SignupAdditional;
