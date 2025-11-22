"use client";

import TopNav from "@/components/layout/TopNav";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";

const postSchema = z.object({
  title: z.string().trim().min(1).max(100),
  content: z.string().trim().min(1).max(5000),
});

type PostFormValues = z.infer<typeof postSchema>;

const BoardWrite = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: { title: "", content: "" },
  });

  const onSubmit = async (data: PostFormValues) => {
    try {
      await fetch("http://localhost:8080/board/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          writer: "테스트유저",
          board: id,
          date: new Date().toISOString().split("T")[0],
        }),
      });
      toast.success("게시글이 작성되었습니다");
      navigate(`/board/${id}`);
    } catch (err) {
      toast.error("게시글 작성 실패");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-16">
      <TopNav />

      <div className="max-w-lg mx-auto px-6 py-4 border-b">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(`/board/${id}`)} className="hover:opacity-70">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">글쓰기</h1>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-6 py-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>제목</FormLabel>
                  <FormControl>
                    <Input placeholder="제목을 입력하세요" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>본문</FormLabel>
                  <FormControl>
                    <Textarea placeholder="내용을 입력하세요" className="min-h-[300px] resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">작성하기</Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default BoardWrite;
