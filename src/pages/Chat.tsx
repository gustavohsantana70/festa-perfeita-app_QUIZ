import { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  Loader2,
  Trash2,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { AppLayout } from '@/components/layout/AppLayout';
import { useStore, ChatMessage } from '@/lib/store';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { getPartyTheme } from '@/lib/theme';

const suggestedQuestions = [
  "Quantas bebidas devo comprar para 20 pessoas?",
  "Dicas de decoração econômica",
  "Como organizar a mesa de jantar?",
  "Ideias de brincadeiras para a festa",
];

const aiResponses: Record<string, string> = {
  bebidas: `Para **20 pessoas**, recomendo:

**Bebidas alcoólicas:**
- 🍺 24 cervejas (considere 1-2 por pessoa)
- 🍷 3 garrafas de vinho
- 🥂 2 garrafas de espumante

**Não alcoólicas:**
- 🥤 4L de refrigerante
- 🧃 2L de suco
- 💧 4L de água

**Dica:** Sempre tenha 20% a mais para emergências!`,

  decoracao: `Aqui vão **dicas econômicas** de decoração:

1. **DIY com materiais recicláveis**
   - Garrafas pintadas como vasos
   - Potes de vidro com velas

2. **Natureza**
   - Galhos secos com luzes
   - Flores do jardim
   - Pinhas e folhas

3. **Balões estratégicos**
   - Arcos na entrada
   - Centros de mesa

4. **Iluminação**
   - Pisca-pisca cria clima mágico
   - Velas em diferentes alturas`,

  mesa: `Para organizar a **mesa de jantar**:

1. **Toalha de mesa** limpa e passada
2. **Centro de mesa** com altura baixa
3. **Talheres** na ordem de uso (fora para dentro)
4. **Copos** à direita: água, vinho
5. **Guardanapos** dobrados elegantemente
6. **Pratos** empilhados se for self-service

**Dica:** Deixe espaço para circulação!`,

  brincadeiras: `**Brincadeiras para animar** sua festa:

🎁 **Amigo Secreto**
- Clássico e sempre funciona!

🎤 **Karaokê**
- Músicas temáticas da época

🎲 **Bingo Personalizado**
- Com prêmios divertidos

❓ **Quem sou eu?**
- Personagens famosos

🎈 **Dança das cadeiras**
- Para todas as idades

📝 **Jogo das resoluções**
- Adivinhe de quem é cada meta`,
};

export default function Chat() {
  const { user, chatMessages, addChatMessage, clearChat } = useStore();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const theme = getPartyTheme(user?.partyType);
  const PartyIcon = theme.icon;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const getAIResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('bebida') || lowerMessage.includes('beber')) {
      return aiResponses.bebidas;
    }
    if (lowerMessage.includes('decoração') || lowerMessage.includes('decorar')) {
      return aiResponses.decoracao;
    }
    if (lowerMessage.includes('mesa') || lowerMessage.includes('jantar')) {
      return aiResponses.mesa;
    }
    if (lowerMessage.includes('brincadeira') || lowerMessage.includes('atividade') || lowerMessage.includes('jogo')) {
      return aiResponses.brincadeiras;
    }

    return `Entendi sua pergunta sobre "${message}".

Para te ajudar melhor, posso falar sobre:
- **Quantidades** de comida e bebida
- **Decoração** e ambientação
- **Organização** da festa
- **Brincadeiras** e atividades

O que você gostaria de saber? 🎉`;
  };

  const handleSend = async (message?: string) => {
    const text = message || input.trim();
    if (!text) return;

    addChatMessage({ role: 'user', content: text });
    setInput('');
    setIsTyping(true);

    // Simulate AI response - In production, this would call the AI API
    setTimeout(() => {
      const response = getAIResponse(text);
      addChatMessage({ role: 'assistant', content: response });
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClear = () => {
    clearChat();
    toast.success('Conversa limpa');
  };

  return (
    <AppLayout>
      <div className="h-[calc(100vh-8rem)] lg:h-[calc(100vh-4rem)] flex flex-col animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="font-display text-3xl font-bold flex items-center gap-3">
              <PartyIcon className={cn(
                "w-8 h-8",
                `text-${theme.color}`
              )} />
              Chat IA
            </h1>
            <p className="text-muted-foreground mt-1">
              Tire suas dúvidas sobre a organização da festa
            </p>
          </div>
          {chatMessages.length > 0 && (
            <Button variant="ghost" size="sm" onClick={handleClear}>
              <Trash2 className="w-4 h-4" />
              Limpar
            </Button>
          )}
        </div>

        {/* Chat area */}
        <Card className="flex-1 flex flex-col overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className={cn(
                  "w-16 h-16 rounded-full flex items-center justify-center mb-4",
                  theme.gradient
                )}>
                  <Bot className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="font-display text-xl font-bold mb-2">
                  Olá! Sou seu assistente de festas {theme.emoji}
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Posso ajudar com dúvidas sobre quantidades, decoração, organização e muito mais!
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
                  {suggestedQuestions.map((question) => (
                    <Button
                      key={question}
                      variant="outline"
                      className="text-left h-auto py-3 px-4 justify-start"
                      onClick={() => handleSend(question)}
                    >
                      <span className="text-sm truncate">{question}</span>
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-3 max-w-[85%]",
                      message.role === 'user' ? "ml-auto flex-row-reverse" : ""
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                      message.role === 'user'
                        ? "bg-muted"
                        : theme.gradient
                    )}>
                      {message.role === 'user' ? (
                        <User className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <Bot className="w-4 h-4 text-primary-foreground" />
                      )}
                    </div>
                    <div className={cn(
                      "rounded-2xl px-4 py-3",
                      message.role === 'user'
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-muted rounded-bl-md"
                    )}>
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        {message.content.split('\n').map((line, i) => {
                          // Handle markdown bold
                          const formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                          return (
                            <p
                              key={i}
                              className={cn("mb-1 last:mb-0", !line && "h-2")}
                              dangerouslySetInnerHTML={{ __html: formatted }}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                      theme.gradient
                    )}>
                      <Bot className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Input
                placeholder="Digite sua pergunta..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isTyping}
                className="flex-1"
              />
              <Button
                className={cn(`bg-${theme.color} hover:bg-${theme.color}/90 text-primary-foreground`)}
                size="icon"
                onClick={() => handleSend()}
                disabled={!input.trim() || isTyping}
              >
                {isTyping ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
