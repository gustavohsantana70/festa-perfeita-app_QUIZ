import { useState } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Calendar,
  Users,
  Wallet,
  Save,
  LogOut,
  Trash2,
  AlertTriangle,
  Crown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AppLayout } from '@/components/layout/AppLayout';
import { useStore, PartyType } from '@/lib/store';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getPartyTheme, PARTY_OPTIONS } from '@/lib/theme';

export default function Settings() {
  const navigate = useNavigate();
  const { user, updateUserProfile, logout, setShowPremiumPopup } = useStore();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    partyType: user?.partyType || 'natal',
    partyDate: user?.partyDate || '',
    expectedGuests: user?.expectedGuests?.toString() || '',
    totalBudget: user?.totalBudget?.toString() || '',
  });

  const theme = getPartyTheme(user?.partyType);

  const handleSave = () => {
    updateUserProfile({
      name: formData.name,
      email: formData.email,
      partyType: formData.partyType as PartyType,
      partyDate: formData.partyDate,
      expectedGuests: parseInt(formData.expectedGuests) || 0,
      totalBudget: parseFloat(formData.totalBudget) || 0,
    });
    toast.success('Configurações salvas!');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Até logo!');
  };

  const handleDeleteAccount = () => {
    // In production, this would delete the user account
    logout();
    navigate('/login');
    toast.success('Conta excluída com sucesso');
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in max-w-2xl">
        {/* Header */}
        <div>
          <h1 className="font-display text-3xl font-bold flex items-center gap-3">
            <SettingsIcon className={cn(
              "w-8 h-8",
              `text-${theme.color}`
            )} />
            Configurações
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie sua conta e preferências
          </p>
        </div>

        {/* Premium card */}
        <Card className="gradient-gold border-0">
          <CardContent className="p-6 text-accent-foreground">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-accent-foreground/20 rounded-xl">
                  <Crown className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold">Versão Gratuita</p>
                  <p className="text-sm opacity-80">Atualize para Premium por R$ 9,90</p>
                </div>
              </div>
              <Button
                variant="outline"
                className="bg-accent-foreground/10 border-accent-foreground/20 hover:bg-accent-foreground/20 shrink-0"
                onClick={() => setShowPremiumPopup(true)}
              >
                Atualizar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Perfil
            </CardTitle>
            <CardDescription>
              Suas informações pessoais
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Seu nome"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="seu@email.com"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Party settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Festa
            </CardTitle>
            <CardDescription>
              Configurações da sua festa
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo de Festa</label>
                <Select
                  value={formData.partyType}
                  onValueChange={(v) => setFormData({ ...formData, partyType: v as PartyType })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PARTY_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Data da Festa</label>
                <Input
                  type="date"
                  value={formData.partyDate}
                  onChange={(e) => setFormData({ ...formData, partyDate: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Convidados Esperados
                </label>
                <Input
                  type="number"
                  min={1}
                  value={formData.expectedGuests}
                  onChange={(e) => setFormData({ ...formData, expectedGuests: e.target.value })}
                  placeholder="20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Wallet className="w-4 h-4" />
                  Orçamento Total (R$)
                </label>
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  value={formData.totalBudget}
                  onChange={(e) => setFormData({ ...formData, totalBudget: e.target.value })}
                  placeholder="1000"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save button */}
        <Button
          className={cn("w-full", `bg-${theme.color} hover:bg-${theme.color}/90 text-primary-foreground`)}
          size="lg"
          onClick={handleSave}
        >
          <Save className="w-4 h-4" />
          Salvar Alterações
        </Button>

        {/* Danger zone */}
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              Zona de Perigo
            </CardTitle>
            <CardDescription>
              Ações irreversíveis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-4 p-4 bg-muted rounded-lg">
              <div>
                <p className="font-medium">Sair da conta</p>
                <p className="text-sm text-muted-foreground">
                  Você pode fazer login novamente depois
                </p>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
                Sair
              </Button>
            </div>
            <div className="flex items-center justify-between gap-4 p-4 bg-destructive/10 rounded-lg">
              <div>
                <p className="font-medium text-destructive">Excluir conta</p>
                <p className="text-sm text-muted-foreground">
                  Esta ação não pode ser desfeita
                </p>
              </div>
              <Button
                variant="destructive"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 className="w-4 h-4" />
                Excluir
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Delete confirmation dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="w-5 h-5" />
                Excluir Conta
              </DialogTitle>
              <DialogDescription>
                Tem certeza que deseja excluir sua conta? Todos os seus dados serão perdidos permanentemente.
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setDeleteDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={handleDeleteAccount}
              >
                Sim, excluir
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
