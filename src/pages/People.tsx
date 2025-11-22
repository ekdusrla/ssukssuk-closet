import { useNavigate } from "react-router-dom";
import TopNav from "@/components/layout/TopNav";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// Mock sellers data
const MOCK_SELLERS = [
  {
    id: "seller1",
    nickname: "엄마손",
    avatar: "/placeholder.svg",
    bio: "두 아이를 키우는 엄마입니다. 깨끗한 옷들을 합리적인 가격에 나눔합니다",
    childrenTags: ["활동적인", "호기심많은", "사교적인", "조용한", "신중한"],
    products: [
      { id: 1, image: "/placeholder.svg" },
      { id: 2, image: "/placeholder.svg" },
      { id: 3, image: "/placeholder.svg" },
    ],
  },
  {
    id: "seller2",
    nickname: "아빠손길",
    avatar: "/placeholder.svg",
    bio: "세 아이 아빠입니다. 아이들 장난감과 책을 판매합니다",
    childrenTags: ["독서좋아하는", "창의적인", "활발한"],
    products: [
      { id: 4, image: "/placeholder.svg" },
      { id: 5, image: "/placeholder.svg" },
      { id: 6, image: "/placeholder.svg" },
    ],
  },
  {
    id: "seller3",
    nickname: "귀요미맘",
    avatar: "/placeholder.svg",
    bio: "딸바보 엄마예요. 여아 의류 위주로 판매합니다",
    childrenTags: ["예쁜거좋아하는", "소심한", "섬세한"],
    products: [
      { id: 7, image: "/placeholder.svg" },
      { id: 8, image: "/placeholder.svg" },
      { id: 9, image: "/placeholder.svg" },
    ],
  },
  {
    id: "seller4",
    nickname: "쑥쑥이네",
    avatar: "/placeholder.svg",
    bio: "아이와 함께 성장하는 부모입니다. 양질의 상품만 올립니다",
    childrenTags: ["꼼꼼한", "차분한", "책임감있는"],
    products: [
      { id: 10, image: "/placeholder.svg" },
      { id: 11, image: "/placeholder.svg" },
      { id: 12, image: "/placeholder.svg" },
    ],
  },
  {
    id: "seller5",
    nickname: "사랑둥이맘",
    avatar: "/placeholder.svg",
    bio: "남아 엄마입니다. 활동적인 아이 옷과 용품 판매해요",
    childrenTags: ["운동좋아하는", "씩씩한", "장난스러운"],
    products: [
      { id: 13, image: "/placeholder.svg" },
      { id: 14, image: "/placeholder.svg" },
      { id: 15, image: "/placeholder.svg" },
    ],
  },
  {
    id: "seller6",
    nickname: "행복한가족",
    avatar: "/placeholder.svg",
    bio: "쌍둥이 부모입니다. 다양한 유아용품을 저렴하게 판매합니다",
    childrenTags: ["똑똑한", "밝은", "친화적인", "모험적인"],
    products: [
      { id: 16, image: "/placeholder.svg" },
      { id: 17, image: "/placeholder.svg" },
      { id: 18, image: "/placeholder.svg" },
    ],
  },
];

const People = () => {
  const navigate = useNavigate();

  const handleSellerClick = (sellerId: string) => {
    navigate(`/seller/${sellerId}`);
  };

  const getRandomTags = (tags: string[]) => {
    const count = Math.floor(Math.random() * 2) + 2; // 2 or 3 tags
    const shuffled = [...tags].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, tags.length));
  };

  return (
    <div className="min-h-screen bg-background pt-16 pb-20">
      <TopNav />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">판매자 추천</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_SELLERS.map((seller) => (
            <Card
              key={seller.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleSellerClick(seller.id)}
            >
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
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {seller.bio}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  {seller.products.map((product) => (
                    <div
                      key={product.id}
                      className="aspect-square rounded-md overflow-hidden bg-muted"
                    >
                      <img
                        src={product.image}
                        alt="상품"
                        className="w-full h-full object-cover"
                      />
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
