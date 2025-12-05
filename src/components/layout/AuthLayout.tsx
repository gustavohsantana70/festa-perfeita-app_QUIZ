import { ReactNode } from 'react';
import { Sparkles, PartyPopper } from 'lucide-react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 gradient-festive relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-primary-foreground">
          <div className="animate-bounce-gentle mb-8">
            <PartyPopper className="w-20 h-20" />
          </div>
          <h1 className="font-display text-5xl font-bold mb-4 text-center">
            Festa Perfeita
          </h1>
          <p className="text-xl text-center opacity-90 max-w-md">
            Planeje sua festa de Natal ou Réveillon em poucos minutos, sem stress!
          </p>
          <div className="mt-12 flex gap-4">
            <Sparkles className="w-8 h-8 animate-sparkle" />
            <Sparkles className="w-6 h-6 animate-sparkle" style={{ animationDelay: '0.5s' }} />
            <Sparkles className="w-8 h-8 animate-sparkle" style={{ animationDelay: '1s' }} />
          </div>
        </div>
        {/* Decorative circles */}
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary-foreground/10 rounded-full blur-3xl" />
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary-foreground/10 rounded-full blur-3xl" />
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex flex-col items-center mb-8">
            <div className="gradient-festive p-4 rounded-2xl mb-4">
              <PartyPopper className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="font-display text-2xl font-bold text-gradient-festive">
              Festa Perfeita
            </h1>
          </div>

          <div className="text-center mb-8">
            <h2 className="font-display text-3xl font-bold text-foreground mb-2">
              {title}
            </h2>
            {subtitle && (
              <p className="text-muted-foreground">{subtitle}</p>
            )}
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
