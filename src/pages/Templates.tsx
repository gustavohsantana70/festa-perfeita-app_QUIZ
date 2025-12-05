import { useState } from 'react';
import { 
  Sparkles,
  UtensilsCrossed,
  Palette,
  Music,
  CheckSquare,
  Loader2,
  Copy,
  Check,
  Crown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppLayout } from '@/components/layout/AppLayout';
import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const templateTypes = [
  { 
    type: 'cardapio', 
    label: 'Cardápio', 
    icon: UtensilsCrossed, 
    color: 'text-orange-500 bg-orange-500/10',
    description: 'Sugestões de pratos e bebidas',
  },
  { 
    type: 'decoracao', 
    label: 'Decoração', 
    icon: Palette, 
    color: 'text-pink-500 bg-pink-500/10',
    description: 'Ideias criativas de decoração',
  },
  { 
    type: 'playlist', 
    label: 'Playlist & Atividades', 
    icon: Music, 
    color: 'text-purple-500 bg-purple-500/10',
    description: 'Músicas e brincadeiras',
  },
  { 
    type: 'checklist', 
    label: 'Checklist Final', 
    icon: CheckSquare, 
    color: 'text-green-500 bg-green-500/10',
    description: 'Lista de verificação completa',
  },
] as const;

const templateContents: Record<string, Record<string, string>> = {
  natal: {
    cardapio: `# 🎄 Cardápio de Natal

## Entrada
- Bruschetta de tomate seco com rúcula
- Canapés de salmão defumado
- Tábua de queijos e frios

## Prato Principal
- Peru assado com molho de laranja
- Tender com abacaxi caramelizado
- Arroz à grega
- Farofa de bacon e castanhas
- Salada tropical

## Sobremesas
- Rabanada tradicional
- Pavê de chocolate branco
- Frutas da estação

## Bebidas
- Vinho tinto e branco
- Espumante para o brinde
- Suco de uva integral
- Água aromatizada com frutas`,

    decoracao: `# 🎨 Decoração de Natal

## Cores
- Vermelho, verde e dourado
- Detalhes em branco para neve

## Mesa
- Toalha vermelha ou branca
- Centro de mesa com velas e pinhas
- Guardanapos dobrados em forma de árvore
- Porta-guardanapos com laços dourados

## Ambiente
- Árvore de Natal iluminada
- Guirlanda na porta
- Luzes pisca-pisca nas janelas
- Meias penduradas na lareira

## DIY Fácil
- Estrelas de papel para pendurar
- Garrafas decoradas com glitter
- Mini árvores com pinhas`,

    playlist: `# 🎵 Playlist & Atividades

## Músicas
1. "All I Want for Christmas Is You" - Mariah Carey
2. "Jingle Bells" - Frank Sinatra
3. "Last Christmas" - Wham!
4. "Happy Xmas" - John Lennon
5. "Noite Feliz" - Simone
6. "Então é Natal" - Simone

## Brincadeiras
- Amigo secreto
- Karaokê de músicas natalinas
- Bingo de Natal
- Quem sou eu? (personagens natalinos)
- Corrida do embrulho

## Para crianças
- Carta para o Papai Noel
- Pintura de desenhos natalinos
- Caça ao presente`,

    checklist: `# ✅ Checklist Final de Natal

## 1 Semana Antes
- [ ] Confirmar lista de convidados
- [ ] Comprar ingredientes não perecíveis
- [ ] Testar luzes e decoração
- [ ] Preparar playlist

## 3 Dias Antes
- [ ] Comprar carnes e perecíveis
- [ ] Montar decoração
- [ ] Preparar sobremesas que podem ser congeladas

## 1 Dia Antes
- [ ] Temperar carnes
- [ ] Organizar mesa e cadeiras
- [ ] Fazer compras de última hora
- [ ] Preparar entrada

## No Dia
- [ ] Acordar cedo para assar
- [ ] Montar a mesa
- [ ] Gelar bebidas
- [ ] Tirar sobremesas do freezer
- [ ] Receber convidados com sorriso!`,
  },
  reveillon: {
    cardapio: `# 🎆 Cardápio de Réveillon

## Entrada
- Canapés variados
- Carpaccio com rúcula e parmesão
- Camarões ao alho

## Prato Principal
- Bacalhau à Gomes de Sá
- Pernil assado
- Arroz com lentilha (para sorte!)
- Salada Caesar
- Salpicão

## Sobremesas
- Romã (para prosperidade)
- Uvas (12 para dar sorte!)
- Mousse de maracujá
- Sorvete com frutas

## Bebidas
- Champanhe para a virada
- Coquetéis tropicais
- Água de coco
- Sucos naturais`,

    decoracao: `# 🎨 Decoração de Réveillon

## Cores
- Branco (paz)
- Dourado (prosperidade)
- Azul ou prata (detalhes)

## Mesa
- Toalha branca
- Detalhes dourados
- Flores brancas no centro
- Taças de champanhe preparadas

## Ambiente
- Balões metalizados
- Cortina de estrelas
- Luzes brancas
- Relógio decorativo para contagem

## Elementos de Sorte
- Romãs na mesa
- Lentilhas em potinhos
- Uvas para cada convidado`,

    playlist: `# 🎵 Playlist & Atividades

## Músicas (Antes da Virada)
1. "Celebration" - Kool & The Gang
2. "Dancing Queen" - ABBA
3. "I Gotta Feeling" - Black Eyed Peas
4. "Uptown Funk" - Bruno Mars
5. "Evidências" - Chitãozinho & Xororó

## Músicas (Virada)
1. "Auld Lang Syne" - Tradicional
2. "Happy" - Pharrell Williams
3. "Let's Get Loud" - Jennifer Lopez

## Atividades
- Escrever desejos para o ano novo
- Retrospectiva do ano (fotos)
- Brinde coletivo
- Pular 7 ondas (se tiver praia!)
- Queima de fogos

## Tradições
- Comer lentilha
- Usar branco
- Comer 12 uvas à meia-noite`,

    checklist: `# ✅ Checklist Final de Réveillon

## 1 Semana Antes
- [ ] Confirmar convidados
- [ ] Comprar decoração
- [ ] Planejar cardápio
- [ ] Reservar champanhe

## 3 Dias Antes
- [ ] Comprar ingredientes
- [ ] Preparar playlist
- [ ] Testar som e luzes
- [ ] Comprar fogos (se permitido)

## 1 Dia Antes
- [ ] Montar decoração
- [ ] Preparar pratos que podem
- [ ] Gelar bebidas
- [ ] Separar roupas brancas

## No Dia
- [ ] Finalizar pratos
- [ ] Montar mesa
- [ ] Preparar taças de champanhe
- [ ] Distribuir uvas
- [ ] Preparar câmera para fotos
- [ ] Curtir muito! 🎉`,
  },
};

export default function Templates() {
  const { user, templates, addTemplate, setShowPremiumPopup } = useStore();
  const [loading, setLoading] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<Record<string, string>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const partyType = user?.partyType || 'natal';
  const partyTypeColor = partyType === 'natal' ? 'christmas' : 'reveillon';

  const handleGenerate = async (type: string) => {
    setLoading(type);

    // Simulate AI generation - In production, this would call the AI API
    setTimeout(() => {
      const content = templateContents[partyType]?.[type] || 'Conteúdo não disponível';
      setGeneratedContent(prev => ({ ...prev, [type]: content }));
      addTemplate({ type: type as any, content });
      toast.success('Template gerado com sucesso! ✨');
      setLoading(null);
    }, 2000);
  };

  const handleCopy = async (type: string) => {
    const content = generatedContent[type];
    if (content) {
      await navigator.clipboard.writeText(content);
      setCopiedId(type);
      toast.success('Copiado para a área de transferência!');
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold flex items-center gap-3">
              <Sparkles className={cn(
                "w-8 h-8",
                partyTypeColor === 'christmas' ? "text-christmas" : "text-reveillon"
              )} />
              Templates IA
            </h1>
            <p className="text-muted-foreground mt-1">
              Gere conteúdo personalizado para sua festa com IA
            </p>
          </div>
          <Button 
            variant="gold"
            onClick={() => setShowPremiumPopup(true)}
          >
            <Crown className="w-4 h-4" />
            Desbloquear Premium
          </Button>
        </div>

        {/* Template cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {templateTypes.map(template => {
            const content = generatedContent[template.type];
            const isLoading = loading === template.type;

            return (
              <Card key={template.type} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-lg", template.color)}>
                      <template.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-display text-lg">{template.label}</p>
                      <p className="text-sm font-normal text-muted-foreground">
                        {template.description}
                      </p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {content ? (
                    <div className="space-y-4">
                      <div className="bg-muted/50 rounded-lg p-4 max-h-64 overflow-y-auto">
                        <pre className="whitespace-pre-wrap text-sm font-sans">
                          {content}
                        </pre>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleCopy(template.type)}
                        >
                          {copiedId === template.type ? (
                            <>
                              <Check className="w-4 h-4" />
                              Copiado!
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              Copiar
                            </>
                          )}
                        </Button>
                        <Button
                          variant={partyTypeColor === 'christmas' ? 'christmas' : 'reveillon'}
                          className="flex-1"
                          onClick={() => handleGenerate(template.type)}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Gerando...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4" />
                              Gerar Novo
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      variant={partyTypeColor === 'christmas' ? 'christmas' : 'reveillon'}
                      className="w-full"
                      onClick={() => handleGenerate(template.type)}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Gerando com IA...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          Gerar {template.label}
                        </>
                      )}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Info card */}
        <Card className="gradient-gold border-0">
          <CardContent className="p-6 text-accent-foreground">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-accent-foreground/20 rounded-xl shrink-0">
                <Crown className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold mb-2">
                  Versão Premium
                </h3>
                <p className="opacity-80 mb-4">
                  Desbloqueie templates ilimitados, personalização avançada e muito mais por apenas R$ 9,90!
                </p>
                <Button
                  variant="outline"
                  className="bg-accent-foreground/10 border-accent-foreground/20 hover:bg-accent-foreground/20"
                  onClick={() => setShowPremiumPopup(true)}
                >
                  Saiba mais
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
