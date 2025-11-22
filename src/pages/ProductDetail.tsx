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
  const { sellerId, productIdx } = useParams<{ sellerId: string; productIdx: string }>();
  const navigate = useNavigate();
  const [seller, setSeller] = useState<SellerType | null>(null);
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchSellerAndProduct = async () => {
      setLoading(true);
      try {
        // 판매자 정보 가져오기
        const res = await fetch(`http://localhost:8080/product`);
        const json = await res.json();

        if (json.code === 200) {
          // nickname 기준으로 판매자 찾기
          const foundSeller = json.data.find((s: SellerType) => s.nickname === sellerId);
          if (!foundSeller) {
            setSeller(null);
            setProduct(null);
            return;
          }
          setSeller(foundSeller);

          // 상품 배열 인덱스로 찾기
          const idx = productIdx ? parseInt(productIdx, 10) : 0;
          const foundProduct = foundSeller.products[idx] || null;
          setProduct(foundProduct);
        } else {
          console.error(json.message);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSellerAndProduct();
  }, [sellerId, productIdx]);

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
