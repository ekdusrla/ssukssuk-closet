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
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

const childInfoSchema = z.object({
  gender: z.enum(["male", "female"], {
    required_error: "성별을 선택해주세요",
  }),
  birthdate: z.string()
    .min(1, { message: "생년월일을 입력해주세요" }),
  height: z.string()
    .min(1, { message: "키를 입력해주세요" })
    .regex(/^\d+(\.\d+)?$/, { message: "숫자만 입력해주세요" }),
  weight: z.string()
    .min(1, { message: "몸무게를 입력해주세요" })
    .regex(/^\d+(\.\d+)?$/, { message: "숫자만 입력해주세요" }),
});

type ChildInfoFormValues = z.infer<typeof childInfoSchema>;

const HASHTAGS = [
  "활발함", "차분함", "호기심많음", "창의적", "사교적",
  "내성적", "운동좋아함", "독서좋아함", "음악좋아함", "미술좋아함",
  "게임좋아함", "동물좋아함", "요리좋아함", "춤추기좋아함", "노래부르기좋아함",
  "과학실험좋아함", "레고놀이좋아함", "야외활동좋아함", "실내활동좋아함", "친구많음"
];

const SignupChildInfo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { nickname, pw, city, district, bio } = location.state || {};
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    if (!nickname || !pw || !city || !district || !bio) {
      toast.error("회원가입 처음부터 진행해주세요");
      navigate("/signup");
    }
  }, [nickname, pw, city, district, bio, navigate]);

  const form = useForm<ChildInfoFormValues>({
    resolver: zodResolver(childInfoSchema),
    defaultValues: {
      gender: undefined,
      birthdate: "",
      height: "",
      weight: "",
    },
  });

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      } else if (prev.length < 3) {
        return [...prev, tag];
      } else {
        toast.error("최대 3개까지 선택 가능합니다");
        return prev;
      }
    });
  };

  const onSubmit = async (data: ChildInfoFormValues) => {
    if (selectedTags.length === 0) {
      toast.error("최소 1개의 해시태그를 선택해주세요");
      return;
    }

    try {
      const response = await fetch('/sign/up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
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

  const isFormValid = form.formState.isValid && selectedTags.length > 0;

  return (
    <div className="min-h-screen bg-background flex flex-col pb-8">
      {/* 뒤로가기 버튼 */}
      <div className="absolute top-6 left-6">
        <button onClick={() => navigate(-1)} className="hover:opacity-70">
          <ArrowLeft size={24} />
        </button>
      </div>

      {/* 아이 정보 폼 */}
      <div className="flex-1 flex items-start justify-center px-6 pt-20">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold text-center mb-2">아이 정보 입력</h1>
          <p className="text-sm text-muted-foreground text-center mb-8">
            자녀의 정보를 입력해주세요
          </p>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>성별</FormLabel>
                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        type="button"
                        variant={field.value === "male" ? "default" : "outline"}
                        onClick={() => field.onChange("male")}
                        className="w-full"
                      >
                        남
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === "female" ? "default" : "outline"}
                        onClick={() => field.onChange("female")}
                        className="w-full"
                      >
                        여
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="birthdate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>생년월일</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="height"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>키 (cm)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="예: 120"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>몸무게 (kg)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="예: 25"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-3">
                <FormLabel>해시태그 선택 (최소 1개, 최대 3개)</FormLabel>
                <div className="flex flex-wrap gap-2">
                  {HASHTAGS.map((tag) => (
                    <Badge
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer px-3 py-1"
                      onClick={() => toggleTag(tag)}
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  선택된 해시태그: {selectedTags.length}/3
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={!isFormValid}
              >
                가입하기
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default SignupChildInfo;
