import { ReactNode, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Wallet,
  Sparkles,
  MessageCircle,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  PartyPopper,
  Crown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { PremiumPopup } from '@/components/PremiumPopup';
import { getPartyTheme } from '@/lib/theme';

interface AppLayoutProps {
  children: ReactNode;
}

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/guests', label: 'Convidados', icon: Users },
  { path: '/shopping-list', label: 'Compras', icon: ShoppingCart },
  { path: '/budget', label: 'Orçamento', icon: Wallet },
  { path: '/templates', label: 'Templates IA', icon: Sparkles },
  { path: '/chat', label: 'Chat IA', icon: MessageCircle },
  { path: '/summary', label: 'Resumo', icon: FileText },
  { path: '/settings', label: 'Configurações', icon: Settings },
];

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, showPremiumPopup, setShowPremiumPopup } = useStore();
  const theme = getPartyTheme(user?.partyType);

  useEffect(() => {
    // Show premium popup after 30 seconds
    const timer = setTimeout(() => {
      setShowPremiumPopup(true);
    }, 30000);
    return () => clearTimeout(timer);
  }, [setShowPremiumPopup]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border h-16 flex items-center justify-between px-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
          <div className={cn(
            "p-2 rounded-lg",
            theme.gradient
          )}>
            <theme.icon className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold">Festa Perfeita</span>
        </div>
        <div className="w-10" />
      </header>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-foreground/50 z-50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-72 bg-card border-r border-border z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-lg",
                theme.gradient
              )}>
                <theme.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-display text-lg font-bold">Festa Perfeita</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User info */}
          <div className="p-4 border-b border-border">
            <p className="font-medium truncate">{user?.name || 'Usuário'}</p>
            <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
            {user?.partyType && (
              <span className={cn(
                "inline-flex items-center gap-1 mt-2 text-xs font-medium px-2 py-1 rounded-full",
                `bg-${theme.color}/10 text-${theme.color}`
              )}>
                {theme.emoji} {theme.label}
              </span>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                    isActive
                      ? `bg-${theme.color} text-primary-foreground shadow-glow`
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Premium banner */}
          <div className="p-4 border-t border-border">
            <button
              onClick={() => setShowPremiumPopup(true)}
              className="w-full gradient-gold text-accent-foreground rounded-xl p-4 text-left hover:opacity-90 transition-opacity"
            >
              <div className="flex items-center gap-2 mb-1">
                <Crown className="w-5 h-5" />
                <span className="font-bold">Versão Premium</span>
              </div>
              <p className="text-sm opacity-80">Desbloqueie recursos exclusivos</p>
            </button>
          </div>

          {/* Logout */}
          <div className="p-4 border-t border-border">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5" />
              Sair
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:ml-72 pt-16 lg:pt-0 min-h-screen">
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>

      {/* Premium popup */}
      <PremiumPopup
        open={showPremiumPopup}
        onClose={() => setShowPremiumPopup(false)}
      />
    </div>
  );
}
