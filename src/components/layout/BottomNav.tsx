import { NavLink } from "@/components/NavLink";
import { Users, ShoppingBag, MessageCircle, LayoutGrid, User } from "lucide-react";

const BottomNav = () => {
  const navItems = [
    { to: "/people", icon: Users, label: "사람 추천" },
    { to: "/products", icon: ShoppingBag, label: "상품 추천" },
    { to: "/chat", icon: MessageCircle, label: "채팅" },
    { to: "/board", icon: LayoutGrid, label: "게시판" },
    { to: "/mypage", icon: User, label: "마이페이지" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="max-w-lg mx-auto flex justify-around items-center h-16 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className="flex flex-col items-center justify-center flex-1 py-2 text-muted-foreground transition-colors"
            activeClassName="text-primary"
          >
            <item.icon className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
