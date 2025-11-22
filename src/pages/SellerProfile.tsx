import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TopNav from "@/components/layout/TopNav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ArrowLeft, MessageCircle } from "lucide-react";

// TypeScript 인터페이스
interface Child {
  id: number;
  gender: string;
  birthdate: string;
  height: number;
  weight: number;
  tags: string[];
}

interface Product {
  id: number;
  title: string;
  image: string;
}

interface Seller {
  id: string;
  nickname: string;
  avatar: string;
  location?: string;
  bio?: string;
  childrenTags: string[];
  children: Child[];
  products: Product[];
}

const SellerProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [seller, setSeller] = useState<Seller | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSeller = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:8080/user/get_sellers");
        const json = await res.json();
        if (json.code === 200) {
          // id에 맞는 판매자 선택
          const foundSeller = json.data.find((s: any) => s.id === id);
          if (foundSeller) {
            // children이 없는 경우 초기화
            foundSeller.children = foundSeller.children || [];
            setSeller(foundSeller);
          } else {
            setSeller(null);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSeller();
  }, [id]);

  const handleChatClick = () => {
    navigate(`/chat/${id}`);
  };

  const handleProductClick = (productId: number) => {
    navigate(`/products/${productId}`);
  };

  const calculateAge = (birthdate: string) => {
    const today = new Date();
    const birth = new Date(birthdate);
    return today.getFullYear() - birth.getFullYear();
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>;
  if (!seller) return <div className="min-h-screen flex items-center justify-center">판매자를 찾을 수 없습니다.</div>;

  // children tags 합치기
  const allChildrenTags = Array.from(new Set(seller.children.flatMap(child => child.tags)));

  return (
    <div className="min-h-screen bg-background pt-16 pb-20">
      <TopNav />
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">판매자 정보</h1>
        </div>

        <div className="p-4 space-y-6">
          {/* Seller Profile */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <Avatar className="h-20 w-20 flex-shrink-0">
                  <AvatarImage src={seller.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{seller.nickname.charAt(0)}</AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-2">
                  <div>
                    <h2 className="font-semibold text-lg">{seller.nickname}</h2>
                    {seller.location && <p className="text-xs text-muted-foreground mt-0.5">{seller.location}</p>}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {allChildrenTags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button size="sm" onClick={handleChatClick} className="flex-shrink-0">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  채팅하기
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Bio Section */}
          {seller.bio && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">소개</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {seller.bio}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Children Section */}
          <div>
            <h3 className="font-semibold mb-3">아이 정보</h3>
            <div className="space-y-3">
              {seller.children.map(child => (
                <Card key={child.id}>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {child.gender} · {calculateAge(child.birthdate)}세
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {child.height}cm · {child.weight}kg
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {child.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Products Section */}
          <div>
            <h3 className="font-semibold mb-3">판매 상품</h3>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4" style={{ scrollbarWidth: 'thin' }}>
              {seller.products.map(product => (
                <Card
                  key={product.id}
                  className="flex-shrink-0 w-36 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleProductClick(product.id)}
                >
                  <CardContent className="p-0">
                    <AspectRatio ratio={1}>
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    </AspectRatio>
                  </CardContent>
                  <div className="p-3">
                    <p className="text-xs font-medium line-clamp-2">{product.title}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerProfile;
