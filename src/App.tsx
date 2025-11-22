import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Chat from "./pages/Chat";
import ChatRoom from "./pages/ChatRoom";
import People from "./pages/People";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Board from "./pages/Board";
import BoardDetail from "./pages/BoardDetail";
import BoardPost from "./pages/BoardPost";
import BoardWrite from "./pages/BoardWrite";
import MyPage from "./pages/MyPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SignupAdditional from "./pages/SignupAdditional";
import SignupChildren from "./pages/SignupChildren";
import SignupChildInfo from "./pages/SignupChildInfo";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/chat" replace />} />
          <Route path="/people" element={<People />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/chat/:id" element={<ChatRoom />} />
          <Route path="/board" element={<Board />} />
          <Route path="/board/:id" element={<BoardDetail />} />
          <Route path="/board/:id/write" element={<BoardWrite />} />
          <Route path="/board/:boardId/post/:postId" element={<BoardPost />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signup/additional" element={<SignupAdditional />} />
          <Route path="/signup/children" element={<SignupChildren />} />
          <Route path="/signup/child-info" element={<SignupChildInfo />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
