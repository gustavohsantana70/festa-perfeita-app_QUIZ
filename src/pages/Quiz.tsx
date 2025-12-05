import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Sparkles, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const questions = [
    {
        id: 1,
        question: 'Qual celebração você está planejando?',
        options: [
            { value: 'natal', label: '🎄 Natal', emoji: '🎄' },
            { value: 'reveillon', label: '🎆 Réveillon', emoji: '🎆' },
            { value: 'aniversario', label: '🎂 Aniversário', emoji: '🎂' },
            { value: 'casamento', label: '💍 Casamento', emoji: '💍' },
            { value: 'formatura', label: '🎓 Formatura', emoji: '🎓' },
            { value: 'cha_bebe', label: '👶 Chá de Bebê', emoji: '👶' },
            { value: 'outro', label: '⭐ Outro', emoji: '⭐' },
        ],
    },
    {
        id: 2,
        question: 'Quando será o evento?',
        options: [
            { value: 'menos_1mes', label: 'Menos de 1 mês' },
            { value: '1_3meses', label: '1 a 3 meses' },
            { value: '3_6meses', label: '3 a 6 meses' },
            { value: 'mais_6meses', label: 'Mais de 6 meses' },
        ],
    },
    {
        id: 3,
        question: 'Quantos convidados você espera?',
        options: [
            { value: 'ate_20', label: 'Até 20 pessoas' },
            { value: '20_50', label: '20 a 50 pessoas' },
            { value: '50_100', label: '50 a 100 pessoas' },
            { value: 'mais_100', label: 'Mais de 100 pessoas' },
        ],
    },
    {
        id: 4,
        question: 'Qual sua faixa de investimento?',
        options: [
            { value: 'ate_1k', label: 'Até R$ 1.000' },
            { value: '1k_3k', label: 'R$ 1.000 - R$ 3.000' },
            { value: '3k_5k', label: 'R$ 3.000 - R$ 5.000' },
            { value: 'mais_5k', label: 'Acima de R$ 5.000' },
        ],
    },
    {
        id: 5,
        question: 'O que mais te preocupa no planejamento?',
        options: [
            { value: 'orcamento', label: '💰 Controlar o orçamento' },
            { value: 'organizacao', label: '📋 Organizar tudo' },
            { value: 'fornecedores', label: '🤝 Encontrar fornecedores' },
            { value: 'tempo', label: '⏰ Falta de tempo' },
        ],
    },
    {
        id: 6,
        question: 'Você tem medo de estourar o orçamento ou esquecer itens importantes?',
        options: [
            { value: 'sim_muito', label: '😱 Sim, morro de medo!' },
            { value: 'um_pouco', label: '😟 Um pouco' },
            { value: 'nao', label: '😌 Não, sou organizado(a)' },
        ],
    },
    {
        id: 7,
        question: 'Se existisse um "mapa" pronto que fizesse 80% do trabalho chato por você, você usaria?',
        options: [
            { value: 'com_certeza', label: '🤩 Com certeza!' },
            { value: 'talvez', label: '🤔 Talvez' },
            { value: 'nao', label: '🙅 Não' },
        ],
    },
    {
        id: 8,
        question: 'Você está comprometido(a) em fazer dessa a melhor festa da sua vida?',
        options: [
            { value: 'sim_incrivel', label: '🚀 Sim, vai ser incrível!' },
            { value: 'simples', label: '✨ Quero apenas algo simples' },
        ],
    },
];

export default function Quiz() {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [showEmailCapture, setShowEmailCapture] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const progress = ((currentQuestion + 1) / questions.length) * 100;

    const handleAnswer = (value: string) => {
        setAnswers({ ...answers, [currentQuestion]: value });

        if (currentQuestion < questions.length - 1) {
            setTimeout(() => {
                setCurrentQuestion(currentQuestion + 1);
            }, 300);
        } else {
            setTimeout(() => {
                setShowEmailCapture(true);
            }, 300);
        }
    };

    const handleBack = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !name) {
            toast.error('Preencha seu nome e email');
            return;
        }

        if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            toast.error('Por favor, insira um email válido');
            return;
        }

        setLoading(true);

        try {
            const supabase = (await import('@/lib/supabase')).supabase;

            const quizData = {
                email,
                name,
                party_type: answers[0] || null,
                party_date: answers[1] || null,
                expected_guests: answers[2] || null,
                budget_range: answers[3] || null,
                main_challenge: answers[4] || null,
                fear_budget_items: answers[5] || null,
                desire_roadmap: answers[6] || null,
                commitment_level: answers[7] || null,
            };

            // Try to insert the new record
            const { error } = await supabase
                .from('quiz_leads')
                .insert([quizData]);

            if (error) {
                // Ignore duplicate email error (code 23505) and proceed
                if (error.code === '23505' || error.message?.includes('duplicate key')) {
                    console.log('Email already exists, proceeding to redirect');
                } else {
                    console.error('Erro ao salvar lead:', error);
                    toast.error(`Erro: ${error.message || 'Tente novamente.'}`);
                    setLoading(false);
                    return;
                }
            }

            toast.success('Quiz concluído com sucesso! Redirecionando...');

            // Redirect to Kiwify checkout
            setTimeout(() => {
                window.location.href = 'https://pay.kiwify.com.br/Cn4U3SU';
            }, 1500);

            setLoading(false);
        } catch (error) {
            console.error('Erro ao processar:', error);
            toast.error('Erro ao processar. Tente novamente.');
            setLoading(false);
        }
    };

    if (showResult) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-christmas via-background to-reveillon flex items-center justify-center p-6">
                <div className="max-w-2xl w-full bg-card rounded-3xl shadow-2xl p-8 md:p-12 text-center animate-fade-in">
                    <div className="w-20 h-20 bg-gradient-to-br from-christmas to-reveillon rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check className="w-10 h-10 text-white" />
                    </div>

                    <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
                        Parabéns, {name}! 🎉
                    </h1>

                    <p className="text-lg text-muted-foreground mb-8">
                        Baseado nas suas respostas, criamos um plano personalizado para sua festa perfeita!
                    </p>

                    <div className="bg-muted/50 rounded-2xl p-6 mb-8 text-left">
                        <h3 className="font-semibold mb-4">Seu Plano Inclui:</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <Sparkles className="w-5 h-5 text-christmas mt-0.5" />
                                <span>Lista de compras inteligente baseada no número de convidados</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Sparkles className="w-5 h-5 text-christmas mt-0.5" />
                                <span>Controle de orçamento em tempo real</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Sparkles className="w-5 h-5 text-christmas mt-0.5" />
                                <span>Gerenciamento de convidados e confirmações</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Sparkles className="w-5 h-5 text-christmas mt-0.5" />
                                <span>Templates personalizados para sua festa</span>
                            </li>
                        </ul>
                    </div>

                    <Button
                        size="lg"
                        variant="christmas"
                        className="w-full md:w-auto text-lg px-8"
                        onClick={() => navigate('/register')}
                    >
                        Começar a Planejar Grátis
                        <ChevronRight className="w-5 h-5" />
                    </Button>

                    <p className="text-sm text-muted-foreground mt-4">
                        Sem cartão de crédito necessário • Grátis para sempre
                    </p>
                </div>
            </div>
        );
    }

    if (showEmailCapture) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-christmas via-background to-reveillon flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-card rounded-3xl shadow-2xl p-8 animate-fade-in">
                    <h2 className="font-display text-2xl md:text-3xl font-bold mb-2 text-center">
                        Quase lá! 🎊
                    </h2>
                    <p className="text-muted-foreground text-center mb-8">
                        Receba seu plano personalizado por email
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Nome</label>
                            <Input
                                type="text"
                                placeholder="Seu nome"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="h-12"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Email</label>
                            <Input
                                type="email"
                                placeholder="seu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-12"
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            variant="christmas"
                            className="w-full h-12"
                            disabled={loading}
                        >
                            {loading ? 'Processando...' : 'Ver Meu Plano Personalizado'}
                        </Button>
                    </form>

                    <p className="text-xs text-muted-foreground text-center mt-4">
                        Seus dados estão seguros e nunca serão compartilhados
                    </p>
                </div>
            </div>
        );
    }

    const currentQ = questions[currentQuestion];

    return (
        <div className="min-h-screen bg-gradient-to-br from-christmas via-background to-reveillon flex flex-col">
            {/* Header */}
            <div className="bg-card/80 backdrop-blur-sm border-b border-border">
                <div className="container max-w-4xl py-4">
                    <div className="flex items-center justify-between mb-2">
                        <h1 className="font-display text-xl font-bold">Festa Perfeita</h1>
                        <span className="text-sm text-muted-foreground">
                            {currentQuestion + 1} de {questions.length}
                        </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                        <div
                            className="bg-gradient-to-r from-christmas to-reveillon h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-2xl animate-fade-in">
                    <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-12">
                        {currentQ.question}
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {currentQ.options.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => handleAnswer(option.value)}
                                className={cn(
                                    "p-6 rounded-2xl border-2 transition-all duration-300 text-left hover:scale-105 bg-card",
                                    answers[currentQuestion] === option.value
                                        ? "border-christmas bg-christmas/10 shadow-lg"
                                        : "border-border hover:border-christmas/50"
                                )}
                            >
                                <span className="text-lg font-semibold">{option.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="bg-card/80 backdrop-blur-sm border-t border-border">
                <div className="container max-w-4xl py-4">
                    <Button
                        variant="ghost"
                        onClick={handleBack}
                        disabled={currentQuestion === 0}
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Voltar
                    </Button>
                </div>
            </div>
        </div>
    );
}
