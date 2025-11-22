import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, MessageCircle } from "lucide-react";
import TopNav from "@/components/layout/TopNav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useState, useEffect } from "react";

type SellerType = {
  id: string;
  nickname: string;
  avatar: string;
  bio: string;
  childrenTags: string[];
  products: ProductType[];
};

type ProductType = {
  title: string;
  picture: string;
  price: number;
  size: number;
  content: string;
  tags: string[];
};

const ProductDetail = () => {
  const { sellerId, productIdx } = useParams(); // productIdx는 선택된 상품 인덱스
  const navigate = useNavigate();
  const [seller, setSeller] = useState<SellerType | null>(null);
  const [product, setProduct] = useState<ProductType | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sellerId) return;

    const fetchSeller = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:8080/user/get_sellers`);
        const json = await res.json();
        if (json.code === 200) {
          const foundSeller = json.data.find((s: SellerType) => s.nickname === sellerId);
          if (foundSeller) {
            setSeller(foundSeller);
            const idx = productIdx ? parseInt(productIdx, 10) : 0;
            setProduct(foundSeller.products[idx] || null);
          }
        } else {
          console.error(json.message);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSeller();
  }, [sellerId, productIdx]);

  if (loading) return <p className="pt-16 text-center">로딩 중...</p>;
  if (!seller || !product) return <p className="pt-16 text-center">상품을 찾을 수 없습니다.</p>;

  const handleBuyClick = () => navigate(`/chat/${seller.id}`);
  const handleSellerClick = () => navigate(`/seller/${seller.id}`);

  return (
    <div className="min-h-screen bg-background pt-16 pb-20">
      <TopNav />
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">상품 상세</h1>
        </div>

        <div className="p-4 space-y-6">
          {/* Product Info */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-48">
              <AspectRatio ratio={1}>
                <img
                  src={product.picture}
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
                    <Badge key={tag} variant="secondary" className="text-xs">
                      #{tag}
                    </Badge>
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
          <Card
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={handleSellerClick}
          >
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">판매자 정보</h3>
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={seller.avatar} />
                  <AvatarFallback>{seller.nickname.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{seller.nickname}</p>
                  <p className="text-sm text-muted-foreground">{seller.bio}</p>
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
