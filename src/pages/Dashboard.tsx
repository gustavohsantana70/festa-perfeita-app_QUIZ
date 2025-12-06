import { Link } from 'react-router-dom';
import {
  Users,
  ShoppingCart,
  Wallet,
  CheckCircle2,
  ArrowRight,
  Calendar,
  TrendingUp,
  MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AppLayout } from '@/components/layout/AppLayout';
import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { getPartyTheme } from '@/lib/theme';

export default function Dashboard() {
  const { user, guests, shoppingList, budgetCategories } = useStore();
  const theme = getPartyTheme(user?.partyType);
  const PartyIcon = theme.icon;

  const confirmedGuests = guests.filter(g => g.confirmed).length;
  const totalGuests = guests.length;

  const purchasedItems = shoppingList.filter(i => i.purchased).length;
  const totalItems = shoppingList.length;

  const totalSpent = budgetCategories.reduce((sum, cat) => sum + cat.spent, 0);
  const budgetUsed = user?.totalBudget ? (totalSpent / user.totalBudget) * 100 : 0;

  const daysUntilParty = user?.partyDate
    ? Math.ceil((new Date(user.partyDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };

  // Calculate overall progress
  const guestsProgress = totalGuests > 0 ? (confirmedGuests / totalGuests) * 100 : 0;
  const shoppingProgress = totalItems > 0 ? (purchasedItems / totalItems) * 100 : 0;
  const overallProgress = (guestsProgress + shoppingProgress + Math.min(budgetUsed, 100)) / 3;

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold">
              Olá, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              Veja como está o planejamento da sua festa
            </p>
          </div>
          {daysUntilParty !== null && daysUntilParty > 0 && (
            <div className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl",
              `bg-${theme.color}/10`
            )}>
              <Calendar className={cn(
                "w-5 h-5",
                `text-${theme.color}`
              )} />
              <div>
                <p className={cn(
                  "font-bold text-lg",
                  `text-${theme.color}`
                )}>
                  {daysUntilParty} dias
                </p>
                <p className="text-xs text-muted-foreground">para a festa</p>
              </div>
            </div>
          )}
        </div>

        {/* Party info banner */}
        {user?.partyDate && (
          <Card className={cn(
            "border-0 overflow-hidden",
            theme.gradient
          )}>
            <CardContent className="p-6 text-primary-foreground">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-sm opacity-80 mb-1">
                    {theme.emoji} Festa de {theme.label}
                  </p>
                  <p className="font-display text-xl font-bold capitalize">
                    {formatDate(user.partyDate)}
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{user.expectedGuests || 0}</p>
                    <p className="text-xs opacity-80">convidados esperados</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{formatCurrency(user.totalBudget || 0)}</p>
                    <p className="text-xs opacity-80">orçamento total</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Progress overview */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="w-5 h-5 text-success" />
              Progresso Geral
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Preparação da festa</span>
                <span className="font-medium">{Math.round(overallProgress)}%</span>
              </div>
              <Progress value={overallProgress} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/guests" className="group">
            <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={cn(
                    "p-3 rounded-xl",
                    `bg-${theme.color}/10`
                  )}>
                    <Users className={cn(
                      "w-6 h-6",
                      `text-${theme.color}`
                    )} />
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-3xl font-bold mb-1">{confirmedGuests}/{totalGuests}</p>
                <p className="text-sm text-muted-foreground">Convidados confirmados</p>
                <Progress value={guestsProgress} className="h-2 mt-3" />
              </CardContent>
            </Card>
          </Link>

          <Link to="/shopping-list" className="group">
            <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-gold/10">
                    <ShoppingCart className="w-6 h-6 text-gold" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-3xl font-bold mb-1">{purchasedItems}/{totalItems}</p>
                <p className="text-sm text-muted-foreground">Itens comprados</p>
                <Progress value={shoppingProgress} className="h-2 mt-3" />
              </CardContent>
            </Card>
          </Link>

          <Link to="/budget" className="group">
            <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-success/10">
                    <Wallet className="w-6 h-6 text-success" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-3xl font-bold mb-1">{formatCurrency(totalSpent)}</p>
                <p className="text-sm text-muted-foreground">
                  de {formatCurrency(user?.totalBudget || 0)}
                </p>
                <Progress
                  value={Math.min(budgetUsed, 100)}
                  className={cn("h-2 mt-3", budgetUsed > 100 && "[&>div]:bg-destructive")}
                />
              </CardContent>
            </Card>
          </Link>

          <Link to="/templates" className="group">
            <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-secondary/20">
                    <PartyIcon className="w-6 h-6 text-secondary" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-xl font-bold mb-1">Templates IA</p>
                <p className="text-sm text-muted-foreground">Gere cardápios, decoração e mais</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Quick actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link to="/guests">
                <Button variant="outline" className="w-full justify-start gap-3 h-auto py-4">
                  <Users className="w-5 h-5 text-muted-foreground" />
                  <div className="text-left">
                    <p className="font-medium">Adicionar convidado</p>
                    <p className="text-xs text-muted-foreground">Convide mais pessoas</p>
                  </div>
                </Button>
              </Link>
              <Link to="/shopping-list">
                <Button variant="outline" className="w-full justify-start gap-3 h-auto py-4">
                  <CheckCircle2 className="w-5 h-5 text-muted-foreground" />
                  <div className="text-left">
                    <p className="font-medium">Ver lista de compras</p>
                    <p className="text-xs text-muted-foreground">Organize suas compras</p>
                  </div>
                </Button>
              </Link>
              <Link to="/chat">
                <Button variant="outline" className="w-full justify-start gap-3 h-auto py-4">
                  <MessageCircle className="w-5 h-5 text-muted-foreground" />
                  <div className="text-left">
                    <p className="font-medium">Chat com IA</p>
                    <p className="text-xs text-muted-foreground">Tire suas dúvidas</p>
                  </div>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
