import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Plus, X, Upload } from "lucide-react";
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

// Available hashtags
const HASHTAGS = [
  "활동적인", "조용한", "사교적인", "신중한", "호기심많은",
  "편안한", "예민한", "긍정적인", "창의적인", "논리적인",
  "감성적인", "독립적인", "협동적인", "리더십", "배려심많은",
  "꼼꼼한", "자유로운", "계획적인", "즉흥적인", "차분한"
];

// Mock data
const MOCK_USER = {
  id: "user1",
  nickname: "엄마손",
  avatar: "/placeholder.svg",
  location: "서울시 강남구",
  bio: "두 아이를 키우는 엄마입니다. 우리 아이들이 입던 깨끗한 옷들을 합리적인 가격에 나눔합니다 😊",
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
    { id: 1, title: "귀여운 후드 티셔츠", image: "/placeholder.svg", price: 15000, tags: ["상의", "캐주얼"], description: "상태 좋은 후드 티셔츠입니다." },
    { id: 2, title: "편안한 트레이닝 바지", image: "/placeholder.svg", price: 12000, tags: ["하의", "운동복"], description: "편안한 트레이닝 바지입니다." },
    { id: 3, title: "따뜻한 패딩 점퍼", image: "/placeholder.svg", price: 35000, tags: ["아우터", "겨울"], description: "따뜻한 패딩입니다." },
    { id: 4, title: "귀여운 원피스", image: "/placeholder.svg", price: 18000, tags: ["원피스", "여아"], description: "귀여운 원피스입니다." },
  ],
  posts: [
    { id: 1, board: "자유게시판", title: "아이 옷 정리 팁 공유해요" },
    { id: 2, board: "거래후기", title: "좋은 거래 감사합니다" },
    { id: 3, board: "자유게시판", title: "키즈카페 추천 부탁드려요" },
  ],
};

const MyPage = () => {
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);
  const [userData, setUserData] = useState(MOCK_USER);
  
  // Dialog states
  const [addChildDialog, setAddChildDialog] = useState(false);
  const [editProductDialog, setEditProductDialog] = useState(false);
  const [addProductDialog, setAddProductDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  
  // Form states for new child
  const [newChild, setNewChild] = useState({
    gender: "남",
    birthdate: "",
    height: "",
    weight: "",
    tags: [] as string[],
  });
  
  // Form states for product
  const [productForm, setProductForm] = useState({
    title: "",
    price: "",
    tags: [] as string[],
    description: "",
    image: "/placeholder.svg",
  });

  const allChildrenTags = Array.from(
    new Set(userData.children.flatMap((child) => child.tags))
  );

  const calculateAge = (birthdate: string) => {
    const today = new Date();
    const birth = new Date(birthdate);
    const age = today.getFullYear() - birth.getFullYear();
    return age;
  };

  const toggleChildTag = (childId: number, tag: string) => {
    setUserData({
      ...userData,
      children: userData.children.map((child) =>
        child.id === childId
          ? {
              ...child,
              tags: child.tags.includes(tag)
                ? child.tags.filter((t) => t !== tag)
                : [...child.tags, tag],
            }
          : child
      ),
    });
  };

  const updateChildInfo = (childId: number, field: string, value: any) => {
    setUserData({
      ...userData,
      children: userData.children.map((child) =>
        child.id === childId ? { ...child, [field]: value } : child
      ),
    });
  };

  const handleAddChild = () => {
    if (!newChild.birthdate || !newChild.height || !newChild.weight || newChild.tags.length === 0) {
      alert("모든 필드를 입력해주세요.");
      return;
    }
    
    const child = {
      id: Date.now(),
      ...newChild,
      height: parseInt(newChild.height),
      weight: parseInt(newChild.weight),
    };
    
    setUserData({
      ...userData,
      children: [...userData.children, child],
    });
    
    setNewChild({
      gender: "남",
      birthdate: "",
      height: "",
      weight: "",
      tags: [],
    });
    setAddChildDialog(false);
  };

  const toggleNewChildTag = (tag: string) => {
    setNewChild({
      ...newChild,
      tags: newChild.tags.includes(tag)
        ? newChild.tags.filter((t) => t !== tag)
        : [...newChild.tags, tag],
    });
  };

  const handleEditProduct = (product: any) => {
    setSelectedProduct(product);
    setProductForm({
      title: product.title,
      price: product.price.toString(),
      tags: product.tags,
      description: product.description,
      image: product.image,
    });
    setEditProductDialog(true);
  };

  const handleUpdateProduct = () => {
    if (!productForm.title || !productForm.price || productForm.tags.length === 0 || !productForm.description) {
      alert("모든 필드를 입력해주세요.");
      return;
    }
    
    if (productForm.tags.length > 3) {
      alert("해시태그는 최대 3개까지 선택할 수 있습니다.");
      return;
    }
    
    setUserData({
      ...userData,
      products: userData.products.map((p) =>
        p.id === selectedProduct.id
          ? { ...p, ...productForm, price: parseInt(productForm.price) }
          : p
      ),
    });
    
    setEditProductDialog(false);
    setSelectedProduct(null);
  };

  const handleDeleteProduct = () => {
    if (confirm("정말 이 상품을 삭제하시겠습니까?")) {
      setUserData({
        ...userData,
        products: userData.products.filter((p) => p.id !== selectedProduct.id),
      });
      setEditProductDialog(false);
      setSelectedProduct(null);
    }
  };

  const handleAddProduct = () => {
    if (!productForm.title || !productForm.price || productForm.tags.length === 0 || !productForm.description) {
      alert("모든 필드를 입력해주세요.");
      return;
    }
    
    if (productForm.tags.length > 3) {
      alert("해시태그는 최대 3개까지 선택할 수 있습니다.");
      return;
    }
    
    const product = {
      id: Date.now(),
      ...productForm,
      price: parseInt(productForm.price),
    };
    
    setUserData({
      ...userData,
      products: [...userData.products, product],
    });
    
    setProductForm({
      title: "",
      price: "",
      tags: [],
      description: "",
      image: "/placeholder.svg",
    });
    setAddProductDialog(false);
  };

  const toggleProductTag = (tag: string) => {
    if (productForm.tags.includes(tag)) {
      setProductForm({
        ...productForm,
        tags: productForm.tags.filter((t) => t !== tag),
      });
    } else if (productForm.tags.length < 3) {
      setProductForm({
        ...productForm,
        tags: [...productForm.tags, tag],
      });
    }
  };

  const openAddProductDialog = () => {
    setProductForm({
      title: "",
      price: "",
      tags: [],
      description: "",
      image: "/placeholder.svg",
    });
    setAddProductDialog(true);
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
          <h1 className="text-lg font-semibold">마이페이지</h1>
        </div>

        <div className="p-4 space-y-6">
          {/* User Profile */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="relative">
                  <Avatar className="h-20 w-20 flex-shrink-0">
                    <AvatarImage src={userData.avatar} />
                    <AvatarFallback>{userData.nickname.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {isEditMode && (
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full"
                    >
                      <Upload className="h-3 w-3" />
                    </Button>
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <div>
                    <h2 className="font-semibold text-lg">{userData.nickname}</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">{userData.location}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {allChildrenTags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button
                  size="sm"
                  onClick={() => setIsEditMode(!isEditMode)}
                  className="flex-shrink-0"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  {isEditMode ? "완료" : "수정하기"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Bio Section */}
          {userData.bio && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">소개</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {userData.bio}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Children Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">아이 정보</h3>
              {isEditMode && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setAddChildDialog(true)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  추가하기
                </Button>
              )}
            </div>
            <div className="space-y-3">
              {userData.children.map((child) => (
                <Card key={child.id}>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      {isEditMode ? (
                        <>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label className="text-xs">성별</Label>
                              <Input
                                value={child.gender}
                                onChange={(e) =>
                                  updateChildInfo(child.id, "gender", e.target.value)
                                }
                                className="h-8"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">키(cm)</Label>
                              <Input
                                type="number"
                                value={child.height}
                                onChange={(e) =>
                                  updateChildInfo(child.id, "height", parseInt(e.target.value))
                                }
                                className="h-8"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">몸무게(kg)</Label>
                              <Input
                                type="number"
                                value={child.weight}
                                onChange={(e) =>
                                  updateChildInfo(child.id, "weight", parseInt(e.target.value))
                                }
                                className="h-8"
                              />
                            </div>
                          </div>
                          <div>
                            <Label className="text-xs mb-2 block">해시태그</Label>
                            <div className="flex flex-wrap gap-1.5">
                              {HASHTAGS.map((tag) => (
                                <Badge
                                  key={tag}
                                  variant={child.tags.includes(tag) ? "default" : "outline"}
                                  className="text-xs cursor-pointer"
                                  onClick={() => toggleChildTag(child.id, tag)}
                                >
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
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
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Products Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">판매 상품</h3>
              {isEditMode && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={openAddProductDialog}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  추가하기
                </Button>
              )}
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4" style={{ scrollbarWidth: 'thin' }}>
              {userData.products.map((product) => (
                <Card
                  key={product.id}
                  className="flex-shrink-0 w-36 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => {
                    if (isEditMode) {
                      handleEditProduct(product);
                    } else {
                      navigate(`/products/${product.id}`);
                    }
                  }}
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

          {/* Posts Section */}
          <div>
            <h3 className="font-semibold mb-3">게시판 글</h3>
            <div className="space-y-2">
              {userData.posts.map((post) => (
                <Card
                  key={post.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate(`/board/${post.id}`)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="text-xs flex-shrink-0">
                        {post.board}
                      </Badge>
                      <p className="text-sm font-medium flex-1 truncate">{post.title}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Child Dialog */}
      <Dialog open={addChildDialog} onOpenChange={setAddChildDialog}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>아이 추가하기</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>성별</Label>
              <div className="flex gap-2 mt-1">
                <Button
                  type="button"
                  variant={newChild.gender === "남" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setNewChild({ ...newChild, gender: "남" })}
                >
                  남
                </Button>
                <Button
                  type="button"
                  variant={newChild.gender === "여" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setNewChild({ ...newChild, gender: "여" })}
                >
                  여
                </Button>
              </div>
            </div>
            <div>
              <Label>생년월일</Label>
              <Input
                type="date"
                value={newChild.birthdate}
                onChange={(e) => setNewChild({ ...newChild, birthdate: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>키(cm)</Label>
                <Input
                  type="number"
                  value={newChild.height}
                  onChange={(e) => setNewChild({ ...newChild, height: e.target.value })}
                />
              </div>
              <div>
                <Label>몸무게(kg)</Label>
                <Input
                  type="number"
                  value={newChild.weight}
                  onChange={(e) => setNewChild({ ...newChild, weight: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label>해시태그</Label>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {HASHTAGS.map((tag) => (
                  <Badge
                    key={tag}
                    variant={newChild.tags.includes(tag) ? "default" : "outline"}
                    className="text-xs cursor-pointer"
                    onClick={() => toggleNewChildTag(tag)}
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddChildDialog(false)}>
              취소
            </Button>
            <Button onClick={handleAddChild}>추가</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={editProductDialog} onOpenChange={setEditProductDialog}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>상품 수정하기</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>상품 이미지</Label>
              <div className="mt-2">
                <AspectRatio ratio={1} className="bg-muted rounded-md overflow-hidden">
                  <img src={productForm.image} alt="Product" className="w-full h-full object-cover" />
                </AspectRatio>
                <Button variant="outline" size="sm" className="mt-2 w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  이미지 변경
                </Button>
              </div>
            </div>
            <div>
              <Label>제목</Label>
              <Input
                value={productForm.title}
                onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
              />
            </div>
            <div>
              <Label>가격(원)</Label>
              <Input
                type="number"
                value={productForm.price}
                onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
              />
            </div>
            <div>
              <Label>해시태그 (최소 1개, 최대 3개)</Label>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {["상의", "하의", "아우터", "원피스", "신발", "모자", "캐주얼", "정장", "운동복", "여름", "겨울", "남아", "여아", "유아", "아동"].map((tag) => (
                  <Badge
                    key={tag}
                    variant={productForm.tags.includes(tag) ? "default" : "outline"}
                    className="text-xs cursor-pointer"
                    onClick={() => toggleProductTag(tag)}
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                선택됨: {productForm.tags.length}/3
              </p>
            </div>
            <div>
              <Label>상품 설명</Label>
              <Textarea
                value={productForm.description}
                onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="destructive" onClick={handleDeleteProduct}>
              삭제
            </Button>
            <Button variant="outline" onClick={() => setEditProductDialog(false)}>
              취소
            </Button>
            <Button onClick={handleUpdateProduct}>수정 완료</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Product Dialog */}
      <Dialog open={addProductDialog} onOpenChange={setAddProductDialog}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>상품 추가하기</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>상품 이미지</Label>
              <div className="mt-2">
                <AspectRatio ratio={1} className="bg-muted rounded-md overflow-hidden">
                  <img src={productForm.image} alt="Product" className="w-full h-full object-cover" />
                </AspectRatio>
                <Button variant="outline" size="sm" className="mt-2 w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  이미지 선택
                </Button>
              </div>
            </div>
            <div>
              <Label>제목</Label>
              <Input
                value={productForm.title}
                onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
              />
            </div>
            <div>
              <Label>가격(원)</Label>
              <Input
                type="number"
                value={productForm.price}
                onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
              />
            </div>
            <div>
              <Label>해시태그 (최소 1개, 최대 3개)</Label>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {["상의", "하의", "아우터", "원피스", "신발", "모자", "캐주얼", "정장", "운동복", "여름", "겨울", "남아", "여아", "유아", "아동"].map((tag) => (
                  <Badge
                    key={tag}
                    variant={productForm.tags.includes(tag) ? "default" : "outline"}
                    className="text-xs cursor-pointer"
                    onClick={() => toggleProductTag(tag)}
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                선택됨: {productForm.tags.length}/3
              </p>
            </div>
            <div>
              <Label>상품 설명</Label>
              <Textarea
                value={productForm.description}
                onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddProductDialog(false)}>
              취소
            </Button>
            <Button onClick={handleAddProduct}>상품 올리기</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyPage;
