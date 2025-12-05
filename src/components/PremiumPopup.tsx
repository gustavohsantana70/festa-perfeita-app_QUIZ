import { Crown, X, Check, Sparkles, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface PremiumPopupProps {
  open: boolean;
  onClose: () => void;
}

const features = [
  'Templates de IA ilimitados',
  'Chat com IA sem limites',
  'Exportar lista em PDF',
  'Sugestões personalizadas',
  'Sem anúncios',
  'Suporte prioritário',
];

export function PremiumPopup({ open, onClose }: PremiumPopupProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md overflow-hidden p-0">
        {/* Header with gradient */}
        <div className="gradient-gold p-6 text-accent-foreground relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full bg-accent-foreground/20 hover:bg-accent-foreground/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-accent-foreground/20 rounded-xl">
              <Crown className="w-8 h-8" />
            </div>
            <div>
              <DialogHeader>
                <DialogTitle className="text-2xl font-display font-bold text-accent-foreground">
                  Versão Premium
                </DialogTitle>
              </DialogHeader>
              <p className="text-sm opacity-80">Festa Perfeita Pro</p>
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold">R$ 9,90</span>
            <span className="text-sm opacity-80">pagamento único</span>
          </div>
        </div>

        {/* Features */}
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Gift className="w-5 h-5 text-primary" />
            <span className="font-medium">O que está incluso:</span>
          </div>
          <ul className="space-y-3 mb-6">
            {features.map((feature) => (
              <li key={feature} className="flex items-center gap-3">
                <div className="p-1 rounded-full bg-success/10">
                  <Check className="w-4 h-4 text-success" />
                </div>
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>

          <Button
            asChild
            variant="gold"
            size="xl"
            className="w-full"
          >
            <a
              href="https://pay.kiwify.com.br/Cn4U3SU"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Sparkles className="w-5 h-5" />
              Desbloquear Premium
            </a>
          </Button>

          <p className="text-center text-xs text-muted-foreground mt-4">
            Pagamento seguro via Kiwify • Acesso imediato
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
