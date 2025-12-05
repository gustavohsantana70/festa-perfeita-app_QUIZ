import { useState } from 'react';
import { 
  Plus, 
  Search, 
  UserCheck, 
  UserX, 
  Trash2, 
  Edit2,
  Users,
  Mail,
  Phone,
  X,
  Check,
  UserPlus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppLayout } from '@/components/layout/AppLayout';
import { useStore, Guest } from '@/lib/store';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';

export default function Guests() {
  const { user, guests, addGuest, updateGuest, removeGuest } = useStore();
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    plusOne: false,
  });

  const partyTypeColor = user?.partyType === 'natal' ? 'christmas' : 'reveillon';

  const filteredGuests = guests.filter(guest =>
    guest.name.toLowerCase().includes(search.toLowerCase()) ||
    guest.email?.toLowerCase().includes(search.toLowerCase())
  );

  const confirmedCount = guests.filter(g => g.confirmed).length;
  const pendingCount = guests.filter(g => !g.confirmed).length;

  const handleOpenDialog = (guest?: Guest) => {
    if (guest) {
      setEditingGuest(guest);
      setFormData({
        name: guest.name,
        email: guest.email || '',
        phone: guest.phone || '',
        plusOne: guest.plusOne,
      });
    } else {
      setEditingGuest(null);
      setFormData({ name: '', email: '', phone: '', plusOne: false });
    }
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Nome é obrigatório');
      return;
    }

    if (editingGuest) {
      updateGuest(editingGuest.id, formData);
      toast.success('Convidado atualizado!');
    } else {
      addGuest({ ...formData, confirmed: false });
      toast.success('Convidado adicionado!');
    }

    setDialogOpen(false);
    setFormData({ name: '', email: '', phone: '', plusOne: false });
  };

  const handleToggleConfirm = (guest: Guest) => {
    updateGuest(guest.id, { confirmed: !guest.confirmed });
    toast.success(guest.confirmed ? 'Presença removida' : 'Presença confirmada! 🎉');
  };

  const handleDelete = (id: string) => {
    removeGuest(id);
    toast.success('Convidado removido');
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold">Convidados</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie a lista de convidados da sua festa
            </p>
          </div>
          <Button 
            variant={partyTypeColor === 'christmas' ? 'christmas' : 'reveillon'}
            onClick={() => handleOpenDialog()}
          >
            <Plus className="w-4 h-4" />
            Adicionar
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className={cn(
                "p-3 rounded-xl",
                partyTypeColor === 'christmas' ? "bg-christmas/10" : "bg-reveillon/10"
              )}>
                <Users className={cn(
                  "w-6 h-6",
                  partyTypeColor === 'christmas' ? "text-christmas" : "text-reveillon"
                )} />
              </div>
              <div>
                <p className="text-2xl font-bold">{guests.length}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-success/10">
                <UserCheck className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{confirmedCount}</p>
                <p className="text-sm text-muted-foreground">Confirmados</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-warning/10">
                <UserX className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingCount}</p>
                <p className="text-sm text-muted-foreground">Pendentes</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Buscar convidados..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Guest list */}
        {filteredGuests.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <UserPlus className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-display text-xl font-bold mb-2">
                {search ? 'Nenhum convidado encontrado' : 'Nenhum convidado ainda'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {search ? 'Tente buscar por outro nome' : 'Comece adicionando seus convidados'}
              </p>
              {!search && (
                <Button onClick={() => handleOpenDialog()}>
                  <Plus className="w-4 h-4" />
                  Adicionar primeiro convidado
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3">
            {filteredGuests.map((guest) => (
              <Card key={guest.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shrink-0",
                        guest.confirmed
                          ? "bg-success/10 text-success"
                          : "bg-muted text-muted-foreground"
                      )}>
                        {guest.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium truncate">{guest.name}</p>
                          {guest.plusOne && (
                            <span className="text-xs bg-muted px-2 py-0.5 rounded-full shrink-0">
                              +1
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          {guest.email && (
                            <span className="flex items-center gap-1 truncate">
                              <Mail className="w-3 h-3 shrink-0" />
                              <span className="truncate">{guest.email}</span>
                            </span>
                          )}
                          {guest.phone && (
                            <span className="flex items-center gap-1 shrink-0">
                              <Phone className="w-3 h-3" />
                              {guest.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant={guest.confirmed ? "success" : "outline"}
                        onClick={() => handleToggleConfirm(guest)}
                      >
                        {guest.confirmed ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span className="hidden sm:inline">Confirmado</span>
                          </>
                        ) : (
                          <>
                            <UserCheck className="w-4 h-4" />
                            <span className="hidden sm:inline">Confirmar</span>
                          </>
                        )}
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleOpenDialog(guest)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(guest.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
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
                {editingGuest ? 'Editar convidado' : 'Novo convidado'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome *</label>
                <Input
                  placeholder="Nome completo"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  placeholder="email@exemplo.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Telefone</label>
                <Input
                  placeholder="(00) 00000-0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="plusOne"
                  checked={formData.plusOne}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, plusOne: checked as boolean })
                  }
                />
                <label htmlFor="plusOne" className="text-sm">
                  Vai levar acompanhante (+1)
                </label>
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
                  {editingGuest ? 'Salvar' : 'Adicionar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
