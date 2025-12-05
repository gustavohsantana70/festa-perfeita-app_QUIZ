import { Link } from 'react-router-dom';
import { PartyPopper, Sparkles, Users, ShoppingCart, Wallet, MessageCircle, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  { icon: Users, title: 'Convidados', description: 'Gerencie sua lista com RSVP' },
  { icon: ShoppingCart, title: 'Lista Inteligente', description: 'Compras calculadas por IA' },
  { icon: Wallet, title: 'Orçamento', description: 'Controle seus gastos' },
  { icon: MessageCircle, title: 'Chat IA', description: 'Tire dúvidas em tempo real' },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-festive opacity-10" />
        <nav className="container py-4 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2">
            <div className="gradient-festive p-2 rounded-xl">
              <PartyPopper className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold">Festa Perfeita</span>
          </div>
          <div className="flex gap-2">
            <Link to="/login">
              <Button variant="ghost">Entrar</Button>
            </Link>
            <Link to="/register">
              <Button variant="festive">Começar Grátis</Button>
            </Link>
          </div>
        </nav>

        <div className="container py-20 md:py-32 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-gold/10 text-gold px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Planeje sua festa em minutos
          </div>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Sua <span className="text-gradient-festive">Festa Perfeita</span><br />
            de Natal ou Réveillon
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Organize convidados, compras e orçamento com ajuda de IA. Sem stress, só celebração! 🎉
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button variant="festive" size="xl">
                Começar Agora
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="xl">Já tenho conta</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Features */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-12">
            Tudo que você precisa
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-card p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 gradient-festive rounded-xl flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-display text-xl font-bold mb-2">{f.title}</h3>
                <p className="text-muted-foreground">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container">
          <div className="gradient-festive rounded-3xl p-8 md:p-12 text-center text-primary-foreground">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Pronto para sua festa perfeita?
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">
              Comece grátis e tenha tudo organizado em poucos minutos.
            </p>
            <Link to="/register">
              <Button variant="gold" size="xl">
                Criar Minha Festa
                <PartyPopper className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2024 Festa Perfeita. Feito com ❤️ para suas celebrações.</p>
        </div>
      </footer>
    </div>
  );
}
