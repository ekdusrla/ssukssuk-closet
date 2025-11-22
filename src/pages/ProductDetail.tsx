import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, MessageCircle } from "lucide-react";
import TopNav from "@/components/layout/TopNav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface ProductType {
  title: string;
  picture: string;
  price: number;
  size: number;
  content: string;
  tags: string[];
}

interface SellerType {
  nickname: string;
  avatar: string;
  bio: string;
  products: ProductType[];
}

const ProductDetail = () => {
  const { productIdx } = useParams<{ productIdx: string }>();
  const navigate = useNavigate();
  const [seller, setSeller] = useState<SellerType | null>(null);
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    // 임시 데이터
    const mockProducts: ProductType[] = [
      { title: "귀여운 아기 원피스", picture: "/placeholder.svg", price: 25000, size: 100, content: "상태 좋은 원피스입니다. 몇 번 입지 않아서 거의 새것이에요!", tags: ["원피스/스커트", "활동적인", "사교적인"] },
      { title: "여름 반팔티", picture: "/placeholder.svg", price: 15000, size: 90, content: "시원한 여름 티셔츠. 통풍이 잘 되는 면 소재입니다.", tags: ["상의", "활동적인", "낙천적인"] },
      { title: "아기 운동화", picture: "/placeholder.svg", price: 30000, size: 110, content: "편한 운동화. 발바닥이 부드럽고 쿠션감이 좋아요.", tags: ["신발", "활동적인", "모험적인"] },
      { title: "겨울 패딩", picture: "/placeholder.svg", price: 45000, size: 100, content: "따뜻한 겨울 패딩. 오리털 충전재로 보온성이 우수합니다.", tags: ["아우터", "신중한", "안정적인"] },
      { title: "청바지", picture: "/placeholder.svg", price: 20000, size: 100, content: "편한 청바지. 신축성이 좋아서 활동하기 편해요.", tags: ["바지", "활동적인", "사교적인"] },
      { title: "잠옷 세트", picture: "/placeholder.svg", price: 18000, size: 90, content: "부드러운 잠옷. 면 소재로 피부에 자극이 없습니다.", tags: ["잠옷", "조용한", "감성적인"] },
      { title: "세트 의류", picture: "/placeholder.svg", price: 35000, size: 100, content: "상하의 세트. 코디 걱정 없이 입히기 좋아요.", tags: ["세트 의류", "창의적인", "사교적인"] },
      { title: "모자", picture: "/placeholder.svg", price: 8000, size: 50, content: "귀여운 모자. 햇빛 차단 효과도 좋습니다.", tags: ["기타 악세서리", "호기심많은", "낙천적인"] },
      { title: "유아복 로퍼", picture: "/placeholder.svg", price: 12000, size: 70, content: "12개월 이하 아기용. 부드러운 소재로 제작되었습니다.", tags: ["12개월 이하", "내성적인", "안정적인"] },
      { title: "꽃무늬 원피스", picture: "/placeholder.svg", price: 28000, size: 110, content: "예쁜 꽃무늬. 봄, 여름에 입기 좋은 디자인입니다.", tags: ["원피스/스커트", "감성적인", "창의적인"] },
      { title: "티셔츠", picture: "/placeholder.svg", price: 12000, size: 100, content: "기본 티셔츠. 어떤 옷과도 잘 어울려요.", tags: ["상의", "독립적인", "논리적인"] },
      { title: "후드티", picture: "/placeholder.svg", price: 22000, size: 110, content: "따뜻한 후드티. 안감이 기모로 되어 있습니다.", tags: ["상의", "리더십", "협동적인"] },
    ];

    const mockSeller: SellerType = {
      nickname: "엄마123",
      avatar: "/placeholder.svg",
      bio: "아이 옷 판매합니다. 깨끗하고 상태 좋은 제품만 올려요!",
      products: mockProducts
    };

    const idx = productIdx ? parseInt(productIdx, 10) : 0;
    const foundProduct = mockProducts[idx] || null;

    setSeller(mockSeller);
    setProduct(foundProduct);
    setLoading(false);
  }, [productIdx]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>;
  if (!seller || !product) return <div className="min-h-screen flex items-center justify-center">상품을 찾을 수 없습니다.</div>;

  const handleBuyClick = () => navigate(`/chat/${seller.nickname}`);
  const handleSellerClick = () => navigate(`/seller/${seller.nickname}`);

  return (
    <div className="min-h-screen bg-background pt-16 pb-20">
      <TopNav />
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-3 px-4 py-3 border-b">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">상품 상세</h1>
        </div>

        <div className="p-4 space-y-6">
          {/* Product Image and Info */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-48">
              <AspectRatio ratio={1}>
                <img
                  src={product.picture || "/placeholder.svg"}
                  alt={product.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              </AspectRatio>
            </div>

            <div className="flex-1 flex flex-col">
              <div className="space-y-2">
                <h2 className="font-semibold text-lg">{product.title}</h2>
                <p className="text-xl font-bold text-primary">{product.price.toLocaleString()}원</p>
                <div className="flex flex-wrap gap-1.5">
                  {product.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">#{tag}</Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 mt-auto">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsLiked(!isLiked)}
                  className={isLiked ? "text-red-500" : ""}
                >
                  <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
                </Button>
                <Button onClick={handleBuyClick} className="flex-1">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  구매하기
                </Button>
              </div>
            </div>
          </div>

          {/* Product Description */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">상품 설명</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{product.content}</p>
            </CardContent>
          </Card>

          {/* Seller Info */}
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleSellerClick}>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">판매자 정보</h3>
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={seller.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{seller.nickname.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{seller.nickname}</p>
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
