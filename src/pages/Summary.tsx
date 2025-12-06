import {
  FileText,
  Users,
  ShoppingCart,
  Wallet,
  Calendar,
  Check,
  Clock,
  Download,
  Share2,
  PartyPopper
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppLayout } from '@/components/layout/AppLayout';
import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
import { getPartyTheme } from '@/lib/theme';

export default function Summary() {
  const { user, guests, shoppingList, budgetCategories, templates } = useStore();
  const theme = getPartyTheme(user?.partyType);
  const PartyIcon = theme.icon;

  const confirmedGuests = guests.filter(g => g.confirmed).length;
  const purchasedItems = shoppingList.filter(i => i.purchased).length;
  const totalSpent = budgetCategories.reduce((sum, cat) => sum + cat.spent, 0);

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
      month: 'long',
      year: 'numeric'
    });
  };

  const daysUntilParty = user?.partyDate
    ? Math.ceil((new Date(user.partyDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const overallProgress = (() => {
    const guestsProgress = guests.length > 0 ? (confirmedGuests / guests.length) * 100 : 0;
    const shoppingProgress = shoppingList.length > 0 ? (purchasedItems / shoppingList.length) * 100 : 0;
    const budgetProgress = user?.totalBudget ? Math.min((totalSpent / user.totalBudget) * 100, 100) : 0;
    return (guestsProgress + shoppingProgress + budgetProgress) / 3;
  })();

  const handleShare = async () => {
    const text = `🎉 Minha Festa de ${theme.label}
📅 ${user?.partyDate ? formatDate(user.partyDate) : 'Data não definida'}
👥 ${confirmedGuests} convidados confirmados
🛒 ${purchasedItems}/${shoppingList.length} itens comprados
💰 ${formatCurrency(totalSpent)} gastos

Organizado com o app Festa Perfeita! 🎊`;

    if (navigator.share) {
      await navigator.share({ text });
    } else {
      await navigator.clipboard.writeText(text);
      toast.success('Resumo copiado para a área de transferência!');
    }
  };

  const handleExport = () => {
    toast.info('Exportação em PDF disponível na versão Premium! 👑');
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold flex items-center gap-3">
              <FileText className={cn(
                "w-8 h-8",
                `text-${theme.color}`
              )} />
              Resumo da Festa
            </h1>
            <p className="text-muted-foreground mt-1">
              Visão completa do planejamento
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleShare}>
              <Share2 className="w-4 h-4" />
              Compartilhar
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4" />
              Exportar PDF
            </Button>
          </div>
        </div>

        {/* Party header card */}
        <Card className={cn(
          "border-0 overflow-hidden",
          theme.gradient
        )}>
          <CardContent className="p-8 text-primary-foreground">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-primary-foreground/20 rounded-2xl">
                  <PartyIcon className="w-10 h-10" />
                </div>
                <div>
                  <h2 className="font-display text-3xl font-bold">
                    {theme.emoji} Festa de {theme.label}
                  </h2>
                  {user?.partyDate && (
                    <p className="text-lg opacity-90 capitalize">
                      {formatDate(user.partyDate)}
                    </p>
                  )}
                </div>
              </div>
              {daysUntilParty !== null && daysUntilParty > 0 && (
                <div className="text-center md:text-right">
                  <p className="text-5xl font-bold">{daysUntilParty}</p>
                  <p className="text-sm opacity-80">dias restantes</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Progresso Geral
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Preparação concluída</span>
                <span className="font-bold">{Math.round(overallProgress)}%</span>
              </div>
              <Progress value={overallProgress} className="h-4" />
            </div>
          </CardContent>
        </Card>

        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className={cn(
                  "w-5 h-5",
                  partyTypeColor === 'christmas' ? "text-christmas" : "text-reveillon"
                )} />
                Convidados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-3xl font-bold">{confirmedGuests}</p>
                  <p className="text-sm text-muted-foreground">
                    de {guests.length} confirmados
                  </p>
                </div>
                <Progress
                  value={guests.length > 0 ? (confirmedGuests / guests.length) * 100 : 0}
                  className="h-2"
                />
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Esperados</span>
                    <span>{user?.expectedGuests || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pendentes</span>
                    <span>{guests.length - confirmedGuests}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <ShoppingCart className="w-5 h-5 text-gold" />
                Lista de Compras
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-3xl font-bold">{purchasedItems}</p>
                  <p className="text-sm text-muted-foreground">
                    de {shoppingList.length} itens comprados
                  </p>
                </div>
                <Progress
                  value={shoppingList.length > 0 ? (purchasedItems / shoppingList.length) * 100 : 0}
                  className="h-2"
                />
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total estimado</span>
                    <span>{formatCurrency(shoppingList.reduce((sum, i) => sum + i.estimatedPrice * i.quantity, 0))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Faltam</span>
                    <span>{shoppingList.length - purchasedItems} itens</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Wallet className="w-5 h-5 text-success" />
                Orçamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-3xl font-bold">{formatCurrency(totalSpent)}</p>
                  <p className="text-sm text-muted-foreground">
                    de {formatCurrency(user?.totalBudget || 0)}
                  </p>
                </div>
                <Progress
                  value={user?.totalBudget ? Math.min((totalSpent / user.totalBudget) * 100, 100) : 0}
                  className={cn(
                    "h-2",
                    totalSpent > (user?.totalBudget || 0) && "[&>div]:bg-destructive"
                  )}
                />
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Restante</span>
                    <span className={cn(
                      (user?.totalBudget || 0) - totalSpent < 0 && "text-destructive"
                    )}>
                      {formatCurrency((user?.totalBudget || 0) - totalSpent)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Usado</span>
                    <span>{Math.round(user?.totalBudget ? (totalSpent / user.totalBudget) * 100 : 0)}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Budget breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Gastos por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {budgetCategories.map(cat => (
                <div key={cat.category} className="flex items-center gap-4">
                  <div className="w-24 text-sm font-medium truncate">{cat.category}</div>
                  <div className="flex-1">
                    <Progress
                      value={cat.planned > 0 ? Math.min((cat.spent / cat.planned) * 100, 100) : 0}
                      className="h-2"
                    />
                  </div>
                  <div className="w-32 text-right text-sm">
                    <span className="font-medium">{formatCurrency(cat.spent)}</span>
                    <span className="text-muted-foreground"> / {formatCurrency(cat.planned)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Guests list */}
        {guests.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Lista de Convidados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {guests.map(guest => (
                  <div
                    key={guest.id}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg",
                      guest.confirmed ? "bg-success/10" : "bg-muted"
                    )}
                  >
                    {guest.confirmed ? (
                      <Check className="w-4 h-4 text-success shrink-0" />
                    ) : (
                      <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
                    )}
                    <span className="truncate">{guest.name}</span>
                    {guest.plusOne && (
                      <span className="text-xs text-muted-foreground">+1</span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
