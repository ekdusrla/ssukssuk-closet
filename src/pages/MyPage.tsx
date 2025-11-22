import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Plus } from "lucide-react";
import TopNav from "@/components/layout/TopNav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

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

  const [addProductDialog, setAddProductDialog] = useState(false);
  const [editProductDialog, setEditProductDialog] = useState(false);
  const [productDetailDialog, setProductDetailDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);

  const [productForm, setProductForm] = useState({
    title: "",
    price: "",
    tags: [] as string[],
    description: "",
    image: "/placeholder.svg",
    size: 0,
  });

  // 로그인한 유저 정보 가져오기
  useEffect(() => {
    const loadUser = async () => {
      const res = await fetch("http://localhost:8080/user/me", {
        credentials: "include",
      });
      const result = await res.json();
      if (result.code === 200) setUserData(result.data);
    };
    loadUser();
  }, []);

  // 상품 수정
  const handleProductUpdateAPI = async () => {
    if (!selectedProduct || !userData) return;
    const body = {
      title: productForm.title,
      picture: productForm.image,
      price: Number(productForm.price),
      size: productForm.size,
      content: productForm.description,
      tags: productForm.tags,
      idx: userData.products.findIndex((p) => p.title === selectedProduct.title),
    };

    await fetch("http://localhost:8080/user/update_clothes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      credentials: "include",
    });

    const updatedProducts = userData.products.map((p) =>
      p.title === selectedProduct.title ? body : p
    );
    setUserData({ ...userData, products: updatedProducts });
    setEditProductDialog(false);
  };

  // 상품 추가
  const handleAddProductAPI = async () => {
    if (!userData) return;
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
      ...userData,
      products: [...userData.products, body],
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

  const openProductDetailDialog = async (product: ProductType) => {
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

  if (!userData) return <p>로딩 중...</p>;

  return (
    <div className="min-h-screen bg-background pt-16 pb-20">
      <TopNav />
      <div className="max-w-lg mx-auto p-4 space-y-6">
        {/* 상단 네비 */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">마이페이지</h1>
        </div>

        {/* User Info */}
        <Card>
          <CardContent className="flex gap-4 items-center">
            <Avatar className="h-20 w-20">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.nickname}`}
                alt="avatar"
                className="h-full w-full object-cover rounded-full"
              />
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
              <Button
                size="sm"
                variant="outline"
                onClick={() => setAddProductDialog(true)}
              >
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
                  isEditMode
                    ? openEditProductDialog(product)
                    : openProductDetailDialog(product)
                }
              >
                <CardContent className="p-0">
                  <AspectRatio ratio={1}>
                    <img
                      src={product.picture}
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

        {/* 상품 상세 모달 */}
        <Dialog
          open={productDetailDialog}
          onOpenChange={setProductDetailDialog}
        >
          <DialogContent className="max-w-2xl">
            <div className="flex gap-6">
              {/* 왼쪽 이미지 */}
              <div className="flex-1">
                <img
                  src={selectedProduct?.picture}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
              {/* 오른쪽 정보 */}
              <div className="flex-1 flex flex-col gap-2">
                <h2 className="text-xl font-bold">
                  {selectedProduct?.title}
                </h2>
                <p className="text-lg font-semibold">
                  가격: {selectedProduct?.price}
                </p>
                <p>사이즈: {selectedProduct?.size}</p>
                <p className="text-sm">{selectedProduct?.content}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedProduct?.tags.map((tag) => (
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
            <DialogFooter>
              <Button variant="outline" onClick={() => setProductDetailDialog(false)}>
                닫기
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default MyPage;
