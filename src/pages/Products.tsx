import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopNav from "@/components/layout/TopNav";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { SlidersHorizontal } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const CATEGORIES = [
  "상의",
  "아우터",
  "신발",
  "바지",
  "원피스/스커트",
  "세트 의류",
  "12개월 이하",
  "잠옷",
  "기타 악세서리",
];

const HASHTAGS = [
  "활동적인",
  "조용한",
  "사교적인",
  "내성적인",
  "호기심많은",
  "신중한",
  "감성적인",
  "논리적인",
  "창의적인",
  "분석적인",
  "리더십",
  "협동적인",
  "독립적인",
  "의존적인",
  "낙천적인",
  "신중한",
  "모험적인",
  "안정적인",
  "예민한",
  "둔감한",
];

// Mock product data
const MOCK_PRODUCTS = [
  { id: 1, title: "귀여운 후드 티셔츠", image: "/placeholder.svg", category: "상의", tags: ["활동적인", "사교적인"] },
  { id: 2, title: "편안한 트레이닝 바지", image: "/placeholder.svg", category: "바지", tags: ["편안한", "활동적인"] },
  { id: 3, title: "따뜻한 패딩 점퍼", image: "/placeholder.svg", category: "아우터", tags: ["따뜻한", "모험적인"] },
  { id: 4, title: "귀여운 원피스", image: "/placeholder.svg", category: "원피스/스커트", tags: ["감성적인", "창의적인"] },
  { id: 5, title: "편안한 운동화", image: "/placeholder.svg", category: "신발", tags: ["활동적인", "독립적인"] },
  { id: 6, title: "아기 우주복", image: "/placeholder.svg", category: "12개월 이하", tags: ["편안한", "귀여운"] },
  { id: 7, title: "부드러운 잠옷세트", image: "/placeholder.svg", category: "잠옷", tags: ["편안한", "안정적인"] },
  { id: 8, title: "귀여운 모자", image: "/placeholder.svg", category: "기타 악세서리", tags: ["사교적인", "창의적인"] },
];

const Products = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const toggleKeyword = (keyword: string) => {
    setSelectedKeywords((prev) =>
      prev.includes(keyword)
        ? prev.filter((k) => k !== keyword)
        : [...prev, keyword]
    );
  };

  // Group products by keywords
  const getProductsByKeyword = (keyword: string) => {
    return MOCK_PRODUCTS.filter((product) => {
      const categoryMatch = !selectedCategory || product.category === selectedCategory;
      const keywordMatch = product.tags.includes(keyword);
      return categoryMatch && keywordMatch;
    });
  };

  // Get keywords that have products
  const displayKeywords = selectedKeywords.length > 0 ? selectedKeywords : HASHTAGS;
  const activeKeywords = displayKeywords.filter((keyword) => 
    getProductsByKeyword(keyword).length > 0
  );

  return (
    <div className="min-h-screen bg-background pt-16 pb-20">
      <TopNav />
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">상품 추천</h1>
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <SlidersHorizontal className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col">
              <SheetHeader>
                <SheetTitle>필터 옵션</SheetTitle>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto mt-6 space-y-6 pr-2">
                {/* Category Selection */}
                <div>
                  <h3 className="font-semibold mb-3">의류 종류</h3>
                  <RadioGroup value={selectedCategory} onValueChange={setSelectedCategory}>
                    <div className="space-y-2">
                      {CATEGORIES.map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                          <RadioGroupItem value={category} id={category} />
                          <Label htmlFor={category} className="cursor-pointer">
                            {category}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                  {selectedCategory && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedCategory("")}
                      className="mt-2"
                    >
                      선택 해제
                    </Button>
                  )}
                </div>

                {/* Keyword Selection */}
                <div>
                  <h3 className="font-semibold mb-3">키워드 선택</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {HASHTAGS.map((tag) => (
                      <div key={tag} className="flex items-center space-x-2">
                        <Checkbox
                          id={tag}
                          checked={selectedKeywords.includes(tag)}
                          onCheckedChange={() => toggleKeyword(tag)}
                        />
                        <Label htmlFor={tag} className="cursor-pointer">
                          #{tag}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {selectedKeywords.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedKeywords([])}
                      className="mt-2"
                    >
                      전체 해제
                    </Button>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button
                  onClick={() => setIsFilterOpen(false)}
                  className="w-full"
                >
                  적용하기
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Keyword Sections */}
        <div className="space-y-8">
          {activeKeywords.map((keyword) => {
            const products = getProductsByKeyword(keyword);
            const halfLength = Math.ceil(products.length / 2);
            const firstRow = products.slice(0, halfLength);
            const secondRow = products.slice(halfLength);
            
            return (
              <div key={keyword}>
                <h2 className="text-lg font-semibold mb-4">#{keyword}</h2>
                <div className="space-y-3">
                  {/* First Row */}
                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {firstRow.map((product) => (
                      <Card 
                        key={product.id} 
                        className="flex-shrink-0 w-36 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => navigate(`/products/${product.id}`)}
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
                        <CardFooter className="p-3">
                          <p className="text-xs font-medium line-clamp-2">{product.title}</p>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                  {/* Second Row */}
                  {secondRow.length > 0 && (
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                      {secondRow.map((product) => (
                        <Card 
                          key={product.id} 
                          className="flex-shrink-0 w-36 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                          onClick={() => navigate(`/products/${product.id}`)}
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
                          <CardFooter className="p-3">
                            <p className="text-xs font-medium line-clamp-2">{product.title}</p>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {activeKeywords.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            조건에 맞는 상품이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
