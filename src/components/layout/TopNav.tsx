import { NavLink } from "@/components/NavLink";
import { User } from "lucide-react";
import logo from "@/assets/logo.png";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const TopNav = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const navItems = [
    { to: "/people", label: "사람 추천" },
    { to: "/products", label: "상품 추천" },
    { to: "/chat", label: "채팅" },
    { to: "/board", label: "게시판" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-card border-b border-border z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-6">
        {/* 로고 */}
        <NavLink to="/chat" className="flex-shrink-0">
          <img src={logo} alt="쑥쑥마켓" className="h-20" />
        </NavLink>

        {/* 중앙 네비게이션 */}
        <div className="flex items-center gap-8">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className="text-foreground/70 font-medium transition-colors hover:text-foreground py-2 border-b-2 border-transparent"
              activeClassName="text-primary border-primary"
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* 마이페이지 / 로그인 */}
        {isAuthenticated ? (
          <NavLink
            to="/mypage"
            className="flex items-center gap-2 text-foreground/70 font-medium transition-colors hover:text-foreground"
            activeClassName="text-primary"
          >
            <User className="w-5 h-5" />
            <span>마이페이지</span>
          </NavLink>
        ) : (
          <Button variant="outline" onClick={() => navigate("/login")}>
            로그인
          </Button>
        )}
      </div>
    </nav>
  );
};

export default TopNav;
