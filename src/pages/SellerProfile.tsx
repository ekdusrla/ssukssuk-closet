import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MessageCircle } from "lucide-react";
import TopNav from "@/components/layout/TopNav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AspectRatio } from "@/components/ui/aspect-ratio";

// Mock data
const MOCK_SELLER = {
  id: "seller1",
  nickname: "엄마손",
  avatar: "/placeholder.svg",
  location: "서울시 강남구",
  bio: "두 아이를 키우는 엄마입니다. 우리 아이들이 입던 깨끗한 옷들을 합리적인 가격에 나눔합니다 😊",
  tags: ["활동적인", "사교적인", "편안한"],
  children: [
    {
      id: 1,
      gender: "남",
      birthdate: "2020-05-15",
      height: 110,
      weight: 18,
      tags: ["활동적인", "호기심많은", "사교적인"],
    },
    {
      id: 2,
      gender: "여",
      birthdate: "2022-08-20",
      height: 95,
      weight: 14,
      tags: ["조용한", "신중한", "예민한"],
    },
  ],
  products: [
    { id: 1, title: "귀여운 후드 티셔츠", image: "/placeholder.svg" },
    { id: 2, title: "편안한 트레이닝 바지", image: "/placeholder.svg" },
    { id: 3, title: "따뜻한 패딩 점퍼", image: "/placeholder.svg" },
    { id: 4, title: "귀여운 원피스", image: "/placeholder.svg" },
  ],
};

const SellerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Combine all children's tags
  const allChildrenTags = Array.from(
    new Set(MOCK_SELLER.children.flatMap((child) => child.tags))
  );

  const handleChatClick = () => {
    navigate(`/chat/${id}`);
  };

  const handleProductClick = (productId: number) => {
    navigate(`/products/${productId}`);
  };

  const calculateAge = (birthdate: string) => {
    const today = new Date();
    const birth = new Date(birthdate);
    const age = today.getFullYear() - birth.getFullYear();
    return age;
  };

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
                  <AvatarImage src={MOCK_SELLER.avatar} />
                  <AvatarFallback>{MOCK_SELLER.nickname.charAt(0)}</AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-2">
                  <div>
                    <h2 className="font-semibold text-lg">{MOCK_SELLER.nickname}</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">{MOCK_SELLER.location}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {allChildrenTags.map((tag) => (
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
          {MOCK_SELLER.bio && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">소개</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {MOCK_SELLER.bio}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Children Section */}
          <div>
            <h3 className="font-semibold mb-3">아이 정보</h3>
            <div className="space-y-3">
              {MOCK_SELLER.children.map((child) => (
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
                        {child.tags.map((tag) => (
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
              {MOCK_SELLER.products.map((product) => (
                <Card
                  key={product.id}
                  className="flex-shrink-0 w-36 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleProductClick(product.id)}
                >
                  <CardContent className="p-0">
                    <AspectRatio ratio={1}>
                      <img
                        src={product.image}
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
