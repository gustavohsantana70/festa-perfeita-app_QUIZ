import { useState } from 'react';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Edit2,
  PieChart,
  DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppLayout } from '@/components/layout/AppLayout';
import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#8B5CF6', '#F97316', '#EC4899', '#6B7280', '#F59E0B'];

export default function Budget() {
  const { user, budgetCategories, updateBudgetCategory, updateUserProfile } = useStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [budgetDialogOpen, setBudgetDialogOpen] = useState(false);
  const [newBudget, setNewBudget] = useState(user?.totalBudget?.toString() || '');
  const [categoryBudget, setCategoryBudget] = useState({ planned: '', spent: '' });



  const totalPlanned = budgetCategories.reduce((sum, cat) => sum + cat.planned, 0);
  const totalSpent = budgetCategories.reduce((sum, cat) => sum + cat.spent, 0);
  const totalBudget = user?.totalBudget || 0;
  const remaining = totalBudget - totalSpent;
  const percentUsed = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  const isOverBudget = totalSpent > totalBudget;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const pieData = budgetCategories
    .filter(cat => cat.spent > 0)
    .map((cat, index) => ({
      name: cat.category,
      value: cat.spent,
      color: COLORS[index % COLORS.length],
    }));

  const handleEditCategory = (category: string) => {
    const cat = budgetCategories.find(c => c.category === category);
    if (cat) {
      setCategoryBudget({
        planned: cat.planned.toString(),
        spent: cat.spent.toString(),
      });
      setEditingCategory(category);
      setDialogOpen(true);
    }
  };

  const handleSaveCategory = () => {
    if (editingCategory) {
      updateBudgetCategory(editingCategory, {
        planned: parseFloat(categoryBudget.planned) || 0,
        spent: parseFloat(categoryBudget.spent) || 0,
      });
      toast.success('Categoria atualizada!');
      setDialogOpen(false);
    }
  };

  const handleUpdateTotalBudget = () => {
    updateUserProfile({ totalBudget: parseFloat(newBudget) || 0 });
    toast.success('Orçamento atualizado!');
    setBudgetDialogOpen(false);
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold">Orçamento</h1>
            <p className="text-muted-foreground mt-1">
              Controle seus gastos e mantenha-se no orçamento
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setNewBudget(user?.totalBudget?.toString() || '');
              setBudgetDialogOpen(true);
            }}
          >
            <Edit2 className="w-4 h-4" />
            Editar Orçamento Total
          </Button>
        </div>

        {/* Main stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className={cn(
            "lg:col-span-2",
            isOverBudget && "border-destructive"
          )}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Orçamento Total</p>
                  <p className="text-4xl font-bold">{formatCurrency(totalBudget)}</p>
                </div>
                <div className={cn(
                  "p-3 rounded-xl",
                  isOverBudget ? "bg-destructive/10" : "bg-success/10"
                )}>
                  <Wallet className={cn(
                    "w-8 h-8",
                    isOverBudget ? "text-destructive" : "text-success"
                  )} />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Gasto até agora</span>
                  <span className={cn("font-bold", isOverBudget && "text-destructive")}>
                    {formatCurrency(totalSpent)} ({Math.round(percentUsed)}%)
                  </span>
                </div>
                <Progress
                  value={Math.min(percentUsed, 100)}
                  className={cn("h-4", isOverBudget && "[&>div]:bg-destructive")}
                />

                {isOverBudget && (
                  <div className="flex items-center gap-2 p-3 bg-destructive/10 rounded-lg text-destructive">
                    <AlertTriangle className="w-5 h-5 shrink-0" />
                    <p className="text-sm font-medium">
                      Você ultrapassou o orçamento em {formatCurrency(Math.abs(remaining))}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-success/10">
                    <TrendingDown className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Restante</p>
                    <p className={cn(
                      "text-2xl font-bold",
                      remaining < 0 ? "text-destructive" : "text-success"
                    )}>
                      {formatCurrency(remaining)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-warning/10">
                    <TrendingUp className="w-5 h-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Planejado</p>
                    <p className="text-2xl font-bold">{formatCurrency(totalPlanned)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chart and Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Gastos por Categoria
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                    />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center">
                  <p className="text-muted-foreground">Nenhum gasto registrado ainda</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Categories list */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Categorias
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {budgetCategories.map((cat, index) => {
                  const percentage = cat.planned > 0 ? (cat.spent / cat.planned) * 100 : 0;
                  const isOver = cat.spent > cat.planned && cat.planned > 0;

                  return (
                    <div key={cat.category} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="font-medium">{cat.category}</span>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditCategory(cat.category)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {formatCurrency(cat.spent)} de {formatCurrency(cat.planned)}
                        </span>
                        <span className={cn(
                          "font-medium",
                          isOver ? "text-destructive" : "text-muted-foreground"
                        )}>
                          {Math.round(percentage)}%
                        </span>
                      </div>
                      <Progress
                        value={Math.min(percentage, 100)}
                        className={cn("h-2", isOver && "[&>div]:bg-destructive")}
                      />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Edit Category Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display">
                Editar {editingCategory}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Planejado (R$)</label>
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  value={categoryBudget.planned}
                  onChange={(e) => setCategoryBudget({ ...categoryBudget, planned: e.target.value })}
                  placeholder="0,00"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Gasto (R$)</label>
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  value={categoryBudget.spent}
                  onChange={(e) => setCategoryBudget({ ...categoryBudget, spent: e.target.value })}
                  placeholder="0,00"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button className="flex-1" onClick={handleSaveCategory}>
                  Salvar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Total Budget Dialog */}
        <Dialog open={budgetDialogOpen} onOpenChange={setBudgetDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display">
                Editar Orçamento Total
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Novo orçamento (R$)</label>
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  value={newBudget}
                  onChange={(e) => setNewBudget(e.target.value)}
                  placeholder="0,00"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setBudgetDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button className="flex-1" onClick={handleUpdateTotalBudget}>
                  Salvar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
