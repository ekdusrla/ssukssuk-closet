"use client";

import TopNav from "@/components/layout/TopNav";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

interface Seller {
  id: string;
  nickname: string;
  avatar: string;
  bio: string;
  childrenTags: string[];
  products: { id: number; image: string }[];
}

const People = () => {
  const [sellers, setSellers] = useState<Seller[]>([]);

  // --- 서버에서 유저/판매자 데이터 가져오기 ---
  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const res = await fetch("/user/get_sellers"); // FastAPI 엔드포인트
        const data = await res.json();
        if (data.code === 200 && data.data) {
          setSellers(data.data);
        } else {
          console.error("Failed to fetch sellers:", data.message);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchSellers();
  }, []);

  const getRandomTags = (tags: string[]) => {
    const shuffled = [...tags].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(2, tags.length));
  };

  return (
    <div className="min-h-screen bg-background pt-16 pb-20">
      <TopNav />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">판매자 추천</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sellers.map((seller) => (
            <Card key={seller.id} className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex gap-3 mb-3">
                  <Avatar className="h-12 w-12 flex-shrink-0">
                    <AvatarImage src={seller.avatar} />
                    <AvatarFallback>{seller.nickname.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap mb-1">
                      <h3 className="font-semibold text-base">{seller.nickname}</h3>
                      {getRandomTags(seller.childrenTags).map((tag, idx) => (
                        <Badge key={idx} variant="secondary" className="text-[10px] px-1.5 py-0">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{seller.bio}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {seller.products.map((product) => (
                    <div key={product.id} className="aspect-square rounded-md overflow-hidden bg-muted">
                      <img src={product.image} alt="상품" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default People;
