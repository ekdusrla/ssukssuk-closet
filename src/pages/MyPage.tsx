import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Plus, X, Upload, Trash2 } from "lucide-react";
import TopNav from "@/components/layout/TopNav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const HASHTAGS = [
  "활동적인", "조용한", "사교적인", "신중한", "호기심많은",
  "편안한", "예민한", "긍정적인", "창의적인", "논리적인",
  "감성적인", "독립적인", "협동적인", "리더십", "배려심많은",
  "꼼꼼한", "자유로운", "계획적인", "즉흥적인", "차분한"
];

type ProductType = {
  title: string;
  picture: string;
  price: number;
  size: number;
  content: string;
  tags: string[];
};

type SellerType = {
  id: string;
  nickname: string;
  avatar: string;
  bio: string;
  childrenTags: string[];
  products: ProductType[];
};

const MyPage = () => {
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);
  const [userData, setUserData] = useState<SellerType | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dialog states
  const [addProductDialog, setAddProductDialog] = useState(false);
  const [editProductDialog, setEditProductDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);

  // Product form
  const [productForm, setProductForm] = useState({
    title: "",
    price: "",
    tags: [] as string[],
    description: "",
    image: "/placeholder.svg",
    size: 0,
  });

  // 초기 데이터 fetch
  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("http://localhost:8080/user/get_sellers");
      const data = await res.json();
      // 예시로 첫 번째 사용자 로드
      setUserData(data.data[0]);
    };
    fetchUser();
  }, []);

  const handleProductUpdateAPI = async () => {
    if (!selectedProduct) return;

    const body = {
      title: productForm.title,
      picture: productForm.image,
      price: Number(productForm.price),
      size: productForm.size,
      content: productForm.description,
      tags: productForm.tags,
      idx: userData!.products.findIndex((p) => p.title === selectedProduct.title),
    };

    await fetch("http://localhost:8080/user/update_clothes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      credentials: "include",
    });

    // 로컬 업데이트
    const updatedProducts = userData!.products.map((p) =>
      p.title === selectedProduct.title ? { ...body } : p
    );
    setUserData({ ...userData!, products: updatedProducts });
    setEditProductDialog(false);
  };

  const handleAddProductAPI = async () => {
    const body = {
      title: productForm.title,
      picture: productForm.image,
      price: Number(productForm.price),
      size: productForm.size,
      content: productForm.description,
      tags: productForm.tags,
      idx: -1,
    };

    await fetch("http://localhost:8080/user/update_clothes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      credentials: "include",
    });

    setUserData({
      ...userData!,
      products: [...userData!.products, body],
    });
    setAddProductDialog(false);
  };

  const openEditProductDialog = (product: ProductType) => {
    setSelectedProduct(product);
    setProductForm({
      title: product.title,
      price: product.price.toString(),
      tags: product.tags,
      description: product.content,
      image: product.picture || "/placeholder.svg",
      size: product.size,
    });
    setEditProductDialog(true);
  };

  if (!userData) return <p>로딩 중...</p>;

  return (
    <div className="min-h-screen bg-background pt-16 pb-20">
      <TopNav />
      <div className="max-w-lg mx-auto p-4 space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">마이페이지</h1>
        </div>

        {/* User Info */}
        <Card>
          <CardContent className="flex gap-4 items-center">
            <Avatar
              className={`h-20 w-20 ${isEditMode ? "cursor-pointer ring-2 ring-primary" : ""}`}
              onClick={() => isEditMode && fileInputRef.current?.click()}
            >
              <AvatarImage src={userData.avatar} />
              <AvatarFallback>{userData.nickname[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <h2 className="font-semibold text-lg">{userData.nickname}</h2>
              <p className="text-xs text-muted-foreground">{userData.bio}</p>
              <div className="flex flex-wrap gap-1.5">
                {userData.childrenTags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
            <Button size="sm" onClick={() => setIsEditMode(!isEditMode)}>
              <Edit className="h-4 w-4 mr-1" />
              {isEditMode ? "완료" : "수정하기"}
            </Button>
          </CardContent>
        </Card>

        {/* Products */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">판매 상품</h3>
            {isEditMode && (
              <Button size="sm" variant="outline" onClick={() => setAddProductDialog(true)}>
                <Plus className="h-4 w-4 mr-1" /> 추가하기
              </Button>
            )}
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
            {userData.products.map((product) => (
              <Card
                key={product.title}
                className="flex-shrink-0 w-36 cursor-pointer"
                onClick={() =>
                  isEditMode ? openEditProductDialog(product) : navigate(`/products/${product.title}`)
                }
              >
                <CardContent className="p-0">
                  <AspectRatio ratio={1}>
                    <img src={product.picture || "/placeholder.svg"} className="w-full h-full object-cover" />
                  </AspectRatio>
                </CardContent>
                <div className="p-2">
                  <p className="text-xs font-medium line-clamp-2">{product.title}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Edit Product Dialog */}
        <Dialog open={editProductDialog} onOpenChange={setEditProductDialog}>
          <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>상품 수정</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Label>제목</Label>
              <Input value={productForm.title} onChange={(e) => setProductForm({ ...productForm, title: e.target.value })} />
              <Label>가격</Label>
              <Input value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} />
              <Label>설명</Label>
              <Textarea value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} />
            </div>
            <DialogFooter className="flex gap-2">
              <Button variant="outline" onClick={() => setEditProductDialog(false)}>취소</Button>
              <Button onClick={handleProductUpdateAPI}>수정 완료</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Product Dialog */}
        <Dialog open={addProductDialog} onOpenChange={setAddProductDialog}>
          <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>상품 추가</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Label>제목</Label>
              <Input value={productForm.title} onChange={(e) => setProductForm({ ...productForm, title: e.target.value })} />
              <Label>가격</Label>
              <Input value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} />
              <Label>설명</Label>
              <Textarea value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddProductDialog(false)}>취소</Button>
              <Button onClick={handleAddProductAPI}>상품 올리기</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default MyPage;
