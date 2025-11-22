import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, MessageCircle } from "lucide-react";
import TopNav from "@/components/layout/TopNav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useState } from "react";

// Mock product data - would come from API/database
const MOCK_PRODUCT = {
  id: 1,
  title: "귀여운 후드 티셔츠",
  price: 25000,
  image: "/placeholder.svg",
  tags: ["활동적인", "사교적인", "편안한"],
  description: "부드러운 면 소재로 만든 아이들을 위한 편안한 후드 티셔츠입니다. 활동적인 아이들에게 딱 맞는 디자인으로 제작되었습니다.",
  seller: {
    id: "seller1",
    nickname: "엄마손",
    avatar: "/placeholder.svg",
  },
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);

  const handleBuyClick = () => {
    // Navigate to chat with seller
    navigate(`/chat/${MOCK_PRODUCT.seller.id}`);
  };

  const handleSellerClick = () => {
    // Navigate to seller's page (would be implemented later)
    navigate(`/seller/${MOCK_PRODUCT.seller.id}`);
  };

  return (
    <div className="min-h-screen bg-background pt-16 pb-20">
      <TopNav />
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">상품 상세</h1>
        </div>

        <div className="p-4 space-y-6">
          {/* Product Image and Info */}
          <div className="flex gap-4">
            {/* Image */}
            <div className="flex-shrink-0 w-32">
              <AspectRatio ratio={1}>
                <img
                  src={MOCK_PRODUCT.image}
                  alt={MOCK_PRODUCT.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              </AspectRatio>
            </div>

            {/* Info */}
            <div className="flex-1 space-y-2">
              <h2 className="font-semibold text-lg">{MOCK_PRODUCT.title}</h2>
              <p className="text-xl font-bold text-primary">
                {MOCK_PRODUCT.price.toLocaleString()}원
              </p>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {MOCK_PRODUCT.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsLiked(!isLiked)}
                  className={isLiked ? "text-red-500" : ""}
                >
                  <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
                </Button>
                <Button
                  onClick={handleBuyClick}
                  className="flex-1"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  구매하기
                </Button>
              </div>
            </div>
          </div>

          {/* Product Description */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">상품 설명</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {MOCK_PRODUCT.description}
              </p>
            </CardContent>
          </Card>

          {/* Seller Info */}
          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={handleSellerClick}
          >
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">판매자 정보</h3>
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={MOCK_PRODUCT.seller.avatar} />
                  <AvatarFallback>
                    {MOCK_PRODUCT.seller.nickname.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{MOCK_PRODUCT.seller.nickname}</p>
                  <p className="text-sm text-muted-foreground">판매자 프로필 보기</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
