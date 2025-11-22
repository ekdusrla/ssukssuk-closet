"use client";

import TopNav from "@/components/layout/TopNav";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Product {
  title: string;
  picture: string;
  price: number;
  size: number;
  content: string;
  tags: string[];
}

interface Seller {
  id: string;
  nickname: string;
  avatar: string;
  bio: string;
  childrenTags: string[];
  products: Product[];
}

const People = () => {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [productDetailDialog, setProductDetailDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const res = await fetch("http://localhost:8080/user/get_sellers");
        const data = await res.json();
        if (data.code === 200 && data.data) setSellers(data.data);
        else console.error("Failed to fetch sellers:", data.message);
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

  const openSellerDialog = (seller: Seller) => {
    setSelectedSeller(seller);
    setDialogOpen(true);
  };

  const openProductDetailDialog = async (product: Product) => {
    // FastAPI에서 상세 정보 가져오기
    const res = await fetch(
      `http://localhost:8080/product/title?ti=${encodeURIComponent(product.title)}`
    );
    const data = await res.json();
    if (data.code === 200) {
      setSelectedProduct(data.data);
      setProductDetailDialog(true);
    } else {
      console.error("상품 불러오기 실패", data);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-16 pb-20">
      <TopNav />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">판매자 추천</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sellers.map((seller) => (
            <Card
              key={seller.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => openSellerDialog(seller)}
            >
              <CardContent className="p-4">
                <div className="flex gap-3 mb-3">
                  <Avatar className="h-12 w-12 flex-shrink-0">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seller.nickname}`}
                    />
                    <AvatarFallback>{seller.nickname.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap mb-1">
                      <h3 className="font-semibold text-base">{seller.nickname}</h3>
                      {getRandomTags(seller.childrenTags).map((tag, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="text-[10px] px-1.5 py-0"
                        >
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
                  {seller.products.map((product, idx) => (
                    <div
                      key={idx}
                      className="aspect-square rounded-md overflow-hidden bg-muted cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation(); // 부모 클릭 방지
                        openProductDetailDialog(product);
                      }}
                    >
                      <img
                        src={product.picture}
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

      {/* --- 판매자 다이얼로그 --- */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          {selectedSeller && (
            <>
              <div className="flex justify-between items-center mb-4">
                <DialogTitle className="text-lg font-semibold">
                  {selectedSeller.nickname}
                </DialogTitle>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(`/chat/${selectedSeller.nickname}`)}
                >
                  대화하기
                </Button>
              </div>

              <div className="flex gap-4 items-center mb-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedSeller.nickname}`}
                  />
                  <AvatarFallback>{selectedSeller.nickname.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <p className="text-xs text-muted-foreground">{selectedSeller.bio}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedSeller.childrenTags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">판매 상품</h3>
                <div className="grid grid-cols-2 gap-3">
                  {selectedSeller.products.map((product, idx) => (
                    <Card
                      key={idx}
                      className="cursor-pointer"
                      onClick={() => openProductDetailDialog(product)}
                    >
                      <CardContent className="p-0">
                        <AspectRatio ratio={1}>
                          <img
                            src={product.picture}
                            alt="상품"
                            className="w-full h-full object-cover"
                          />
                        </AspectRatio>
                      </CardContent>
                      <div className="p-2">
                        <p className="text-xs font-medium line-clamp-2">
                          {product.title}
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  닫기
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* --- 상품 상세 모달 --- */}
      <Dialog
        open={productDetailDialog}
        onOpenChange={setProductDetailDialog}
      >
        <DialogContent className="max-w-2xl">
          {selectedProduct && (
            <div className="flex gap-6">
              {/* 왼쪽 이미지 */}
              <div className="flex-1">
                <img
                  src={selectedProduct.picture}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
              {/* 오른쪽 정보 */}
              <div className="flex-1 flex flex-col gap-2">
                <h2 className="text-xl font-bold">{selectedProduct.title}</h2>
                <p className="text-lg font-semibold">가격: {selectedProduct.price}</p>
                <p>사이즈: {selectedProduct.size}</p>
                <p className="text-sm">{selectedProduct.content}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedProduct.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-gray-200 px-2 py-1 rounded text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setProductDetailDialog(false)}
            >
              닫기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default People;
