import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  ChevronLeft,
  PartyPopper,
  Calendar,
  Users,
  Wallet,
  Loader2,
  TreePine,
  Sparkles,
  Cake,
  Heart,
  GraduationCap,
  Baby,
  UtensilsCrossed,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useStore, PartyType } from '@/lib/store';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

import { getPartyTheme, PARTY_OPTIONS } from '@/lib/theme';

const steps = [
  { id: 1, title: 'Tipo de Festa', icon: PartyPopper },
  { id: 2, title: 'Data', icon: Calendar },
  { id: 3, title: 'Convidados', icon: Users },
  { id: 4, title: 'Orçamento', icon: Wallet },
];

const partyTypes = PARTY_OPTIONS.map(option => {
  const theme = getPartyTheme(option.value as PartyType);
  return {
    id: option.value as PartyType,
    name: theme.label,
    icon: theme.icon,
    emoji: theme.emoji,
    date: option.value === 'natal' ? '25 de Dezembro' : option.value === 'reveillon' ? '31 de Dezembro' : '',
    description: theme.description,
    color: theme.color
  };
});

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [partyType, setPartyType] = useState<PartyType | null>(null);
  const [partyDate, setPartyDate] = useState('');
  const [expectedGuests, setExpectedGuests] = useState('');
  const [totalBudget, setTotalBudget] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { updateUserProfile } = useStore();

  const handleNext = () => {
    if (currentStep === 1 && !partyType) {
      toast.error('Selecione o tipo de festa');
      return;
    }
    if (currentStep === 2 && !partyDate) {
      toast.error('Selecione a data da festa');
      return;
    }
    if (currentStep === 3 && (!expectedGuests || parseInt(expectedGuests) < 1)) {
      toast.error('Informe o número de convidados');
      return;
    }
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    if (!totalBudget || parseFloat(totalBudget) < 1) {
      toast.error('Informe o orçamento previsto');
      return;
    }

    setLoading(true);

    try {
      const { supabase } = await import('@/lib/supabase');
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) {
        console.error('Sessão não encontrada');
        toast.error('Sessão expirada. Faça login novamente.');
        setLoading(false);
        window.location.href = '/login';
        return;
      }

      const userId = session.user.id;
      console.log('Salvando perfil para usuário:', userId);

      // Save directly to database
      const { error } = await supabase
        .from('profiles')
        .update({
          party_type: partyType!,
          party_date: partyDate,
          expected_guests: parseInt(expectedGuests),
          total_budget: parseFloat(totalBudget),
          onboarding_complete: true,
        })
        .eq('id', userId);

      if (error) {
        console.error('Erro ao salvar:', error);
        toast.error('Erro ao salvar configurações: ' + error.message);
        setLoading(false);
        return;
      }

      console.log('Perfil salvo com sucesso!');
      toast.success('Configuração concluída! 🎉');

      // Wait a bit then redirect
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 500);
    } catch (error: any) {
      console.error('Error completing onboarding:', error);
      toast.error('Erro: ' + (error.message || 'Erro desconhecido'));
      setLoading(false);
    }
  };

  const selectedPartyConfig = partyTypes.find(p => p.id === partyType);

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="font-display text-2xl font-bold mb-2">
                Qual é o tipo da sua festa?
              </h2>
              <p className="text-muted-foreground">
                Escolha o tema para personalizarmos sua experiência
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-2">
              {partyTypes.map((party) => (
                <button
                  key={party.id}
                  onClick={() => setPartyType(party.id)}
                  className={cn(
                    "p-4 rounded-xl border-2 transition-all duration-300 text-left hover:scale-105",
                    partyType === party.id
                      ? `border-${party.color} bg-${party.color}/10 shadow-lg`
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={cn(
                      "p-2 rounded-lg",
                      partyType === party.id ? `bg-${party.color}` : "bg-muted"
                    )}>
                      <party.icon className={cn(
                        "w-5 h-5",
                        partyType === party.id ? "text-white" : "text-muted-foreground"
                      )} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{party.name}</h3>
                      {party.date && (
                        <p className="text-xs text-muted-foreground">{party.emoji} {party.date}</p>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {party.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="font-display text-2xl font-bold mb-2">
                Quando será a festa?
              </h2>
              <p className="text-muted-foreground">
                Selecione a data da sua celebração
              </p>
            </div>
            <div className="max-w-xs mx-auto">
              <Input
                type="date"
                value={partyDate}
                onChange={(e) => setPartyDate(e.target.value)}
                className="text-center text-lg h-14"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="font-display text-2xl font-bold mb-2">
                Quantos convidados?
              </h2>
              <p className="text-muted-foreground">
                Informe o número aproximado de pessoas
              </p>
            </div>
            <div className="max-w-xs mx-auto">
              <div className="relative">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="number"
                  placeholder="Ex: 20"
                  value={expectedGuests}
                  onChange={(e) => setExpectedGuests(e.target.value)}
                  className="pl-12 text-center text-lg h-14"
                  min={1}
                />
              </div>
              <p className="text-center text-sm text-muted-foreground mt-2">
                Isso nos ajuda a calcular as quantidades
              </p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="font-display text-2xl font-bold mb-2">
                Qual é o orçamento?
              </h2>
              <p className="text-muted-foreground">
                Defina um valor estimado para sua festa
              </p>
            </div>
            <div className="max-w-xs mx-auto">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                  R$
                </span>
                <Input
                  type="number"
                  placeholder="1000"
                  value={totalBudget}
                  onChange={(e) => setTotalBudget(e.target.value)}
                  className="pl-12 text-center text-lg h-14"
                  min={1}
                  step="0.01"
                />
              </div>
              <p className="text-center text-sm text-muted-foreground mt-2">
                Você poderá ajustar isso depois
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress bar */}
      <div className="bg-card border-b border-border">
        <div className="container max-w-2xl py-4">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                  currentStep >= step.id
                    ? selectedPartyConfig?.color === 'reveillon'
                      ? "gradient-reveillon text-secondary-foreground"
                      : "gradient-christmas text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}>
                  <step.icon className="w-5 h-5" />
                </div>
                {index < steps.length - 1 && (
                  <div className={cn(
                    "w-8 sm:w-16 h-1 mx-2 rounded-full transition-all duration-300",
                    currentStep > step.id
                      ? selectedPartyConfig?.color === 'reveillon'
                        ? "bg-reveillon"
                        : "bg-christmas"
                      : "bg-muted"
                  )} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Passo {currentStep} de {steps.length}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-3xl animate-fade-in">
          {renderStepContent()}
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-card border-t border-border">
        <div className="container max-w-2xl py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="w-4 h-4" />
            Voltar
          </Button>

          {currentStep < 4 ? (
            <Button
              variant={selectedPartyConfig?.color === 'reveillon' ? 'reveillon' : 'christmas'}
              onClick={handleNext}
            >
              Próximo
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              variant={selectedPartyConfig?.color === 'reveillon' ? 'reveillon' : 'christmas'}
              onClick={handleComplete}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Finalizando...
                </>
              ) : (
                <>
                  Começar a planejar
                  <PartyPopper className="w-4 h-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
