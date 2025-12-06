import { useState } from 'react';
import {
  Plus,
  Search,
  ShoppingCart,
  Trash2,
  Edit2,
  Check,
  Wine,
  UtensilsCrossed,
  Cake,
  Package,
  Sparkles,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppLayout } from '@/components/layout/AppLayout';
import { useStore, ShoppingItem } from '@/lib/store';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { getPartyTheme } from '@/lib/theme';

const categories = [
  { value: 'bebidas', label: 'Bebidas', icon: Wine, color: 'text-purple-500 bg-purple-500/10' },
  { value: 'comidas', label: 'Comidas', icon: UtensilsCrossed, color: 'text-orange-500 bg-orange-500/10' },
  { value: 'doces', label: 'Doces', icon: Cake, color: 'text-pink-500 bg-pink-500/10' },
  { value: 'descartaveis', label: 'Descartáveis', icon: Package, color: 'text-gray-500 bg-gray-500/10' },
  { value: 'decoracao', label: 'Decoração', icon: Sparkles, color: 'text-gold bg-gold/10' },
] as const;

export default function ShoppingList() {
  const { user, shoppingList, addShoppingItem, updateShoppingItem, removeShoppingItem } = useStore();
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ShoppingItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'bebidas' as ShoppingItem['category'],
    quantity: 1,
    unit: 'un',
    estimatedPrice: 0,
  });

  const theme = getPartyTheme(user?.partyType);

  const filteredItems = shoppingList.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const groupedItems = categories.map(cat => ({
    ...cat,
    items: filteredItems.filter(item => item.category === cat.value),
  }));

  const totalEstimated = shoppingList.reduce((sum, item) => sum + item.estimatedPrice * item.quantity, 0);
  const totalPurchased = shoppingList
    .filter(i => i.purchased)
    .reduce((sum, item) => sum + (item.actualPrice || item.estimatedPrice) * item.quantity, 0);
  const purchasedCount = shoppingList.filter(i => i.purchased).length;
  const progress = shoppingList.length > 0 ? (purchasedCount / shoppingList.length) * 100 : 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleOpenDialog = (item?: ShoppingItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        category: item.category,
        quantity: item.quantity,
        unit: item.unit,
        estimatedPrice: item.estimatedPrice,
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        category: 'bebidas',
        quantity: 1,
        unit: 'un',
        estimatedPrice: 0,
      });
    }
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Nome é obrigatório');
      return;
    }

    if (editingItem) {
      updateShoppingItem(editingItem.id, formData);
      toast.success('Item atualizado!');
    } else {
      addShoppingItem({ ...formData, purchased: false });
      toast.success('Item adicionado!');
    }

    setDialogOpen(false);
  };

  const handleTogglePurchased = (item: ShoppingItem) => {
    updateShoppingItem(item.id, { purchased: !item.purchased });
    if (!item.purchased) {
      toast.success('Item marcado como comprado! ✓');
    }
  };

  const handleDelete = (id: string) => {
    removeShoppingItem(id);
    toast.success('Item removido');
  };

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.value === category);
    return cat?.icon || Package;
  };

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.value === category);
    return cat?.color || 'text-gray-500 bg-gray-500/10';
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold">Lista de Compras</h1>
            <p className="text-muted-foreground mt-1">
              Organize tudo que você precisa comprar
            </p>
          </div>
          <Button
            className={cn(`bg-${theme.color} hover:bg-${theme.color}/90 text-primary-foreground`)}
            onClick={() => handleOpenDialog()}
          >
            <Plus className="w-4 h-4" />
            Adicionar Item
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Progresso</span>
                <span className="font-bold">{purchasedCount}/{shoppingList.length}</span>
              </div>
              <Progress value={progress} className="h-2" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-1">Total Estimado</p>
              <p className="text-2xl font-bold">{formatCurrency(totalEstimated)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-1">Total Comprado</p>
              <p className="text-2xl font-bold text-success">{formatCurrency(totalPurchased)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Buscar itens..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas categorias</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Shopping list by category */}
        {filteredItems.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <ShoppingCart className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-display text-xl font-bold mb-2">
                {search || filterCategory !== 'all' ? 'Nenhum item encontrado' : 'Lista vazia'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {search || filterCategory !== 'all'
                  ? 'Tente outra busca ou filtro'
                  : 'Comece adicionando itens à sua lista'}
              </p>
              {!search && filterCategory === 'all' && (
                <Button onClick={() => handleOpenDialog()}>
                  <Plus className="w-4 h-4" />
                  Adicionar primeiro item
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {groupedItems.filter(g => g.items.length > 0).map(group => (
              <Card key={group.value}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className={cn("p-2 rounded-lg", group.color)}>
                      <group.icon className="w-5 h-5" />
                    </div>
                    {group.label}
                    <span className="text-sm font-normal text-muted-foreground">
                      ({group.items.length})
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {group.items.map(item => (
                      <div
                        key={item.id}
                        className={cn(
                          "flex items-center gap-4 p-3 rounded-lg border transition-all",
                          item.purchased
                            ? "bg-success/5 border-success/20"
                            : "bg-card border-border hover:border-primary/30"
                        )}
                      >
                        <Checkbox
                          checked={item.purchased}
                          onCheckedChange={() => handleTogglePurchased(item)}
                          className="shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className={cn(
                            "font-medium",
                            item.purchased && "line-through text-muted-foreground"
                          )}>
                            {item.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {item.quantity} {item.unit} • {formatCurrency(item.estimatedPrice * item.quantity)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleOpenDialog(item)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDelete(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Add/Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display">
                {editingItem ? 'Editar item' : 'Novo item'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome *</label>
                <Input
                  placeholder="Ex: Cerveja, Refrigerante..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Categoria</label>
                <Select
                  value={formData.category}
                  onValueChange={(v) => setFormData({ ...formData, category: v as ShoppingItem['category'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Quantidade</label>
                  <Input
                    type="number"
                    min={1}
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Unidade</label>
                  <Select
                    value={formData.unit}
                    onValueChange={(v) => setFormData({ ...formData, unit: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="un">Unidade</SelectItem>
                      <SelectItem value="kg">Kg</SelectItem>
                      <SelectItem value="g">Gramas</SelectItem>
                      <SelectItem value="L">Litros</SelectItem>
                      <SelectItem value="ml">ml</SelectItem>
                      <SelectItem value="cx">Caixa</SelectItem>
                      <SelectItem value="pct">Pacote</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Preço estimado (R$)</label>
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  placeholder="0,00"
                  value={formData.estimatedPrice || ''}
                  onChange={(e) => setFormData({ ...formData, estimatedPrice: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1">
                  {editingItem ? 'Salvar' : 'Adicionar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
