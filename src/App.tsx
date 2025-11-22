import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Chat from "./pages/Chat";
import ChatRoom from "./pages/ChatRoom";
import People from "./pages/People";
import Products from "./pages/Products";
import Board from "./pages/Board";
import BoardDetail from "./pages/BoardDetail";
import BoardPost from "./pages/BoardPost";
import MyPage from "./pages/MyPage";
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
          <Route path="/chat" element={<Chat />} />
          <Route path="/chat/:id" element={<ChatRoom />} />
          <Route path="/board" element={<Board />} />
          <Route path="/board/:id" element={<BoardDetail />} />
          <Route path="/board/:boardId/post/:postId" element={<BoardPost />} />
          <Route path="/mypage" element={<MyPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
