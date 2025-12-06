import { PartyType } from './store';
import {
    TreePine,
    Sparkles,
    Cake,
    Heart,
    GraduationCap,
    Baby,
    UtensilsCrossed,
    PartyPopper
} from 'lucide-react';

export const PARTY_OPTIONS = [
    { value: 'natal', label: '🎄 Natal' },
    { value: 'reveillon', label: '🎆 Réveillon' },
    { value: 'aniversario', label: '🎂 Aniversário' },
    { value: 'casamento', label: '💍 Casamento' },
    { value: 'formatura', label: '🎓 Formatura' },
    { value: 'cha_bebe', label: '👶 Chá de Bebê' },
    { value: 'cha_panela', label: '🍳 Chá de Panela' },
    { value: 'outro', label: '🎉 Outro' },
] as const;

export const getPartyTheme = (type: PartyType = 'natal') => {
    switch (type) {
        case 'natal':
            return {
                color: 'christmas',
                gradient: 'gradient-christmas',
                icon: TreePine,
                label: 'Natal',
                emoji: '🎄',
                description: 'Celebre o Natal com magia'
            };
        case 'reveillon':
            return {
                color: 'reveillon',
                gradient: 'gradient-reveillon',
                icon: Sparkles,
                label: 'Réveillon',
                emoji: '🎆',
                description: 'Comece o ano novo com estilo'
            };
        case 'aniversario':
            return {
                color: 'birthday',
                gradient: 'gradient-birthday',
                icon: Cake,
                label: 'Aniversário',
                emoji: '🎂',
                description: 'Celebre mais um ano de vida'
            };
        case 'casamento':
            return {
                color: 'wedding',
                gradient: 'gradient-wedding',
                icon: Heart,
                label: 'Casamento',
                emoji: '💍',
                description: 'O dia mais feliz da sua vida'
            };
        case 'formatura':
            return {
                color: 'graduation',
                gradient: 'gradient-graduation',
                icon: GraduationCap,
                label: 'Formatura',
                emoji: '🎓',
                description: 'Comemore essa conquista'
            };
        case 'cha_bebe':
            return {
                color: 'baby',
                gradient: 'gradient-baby',
                icon: Baby,
                label: 'Chá de Bebê',
                emoji: '👶',
                description: 'A espera mais doce'
            };
        case 'cha_panela':
            return {
                color: 'kitchen',
                gradient: 'gradient-kitchen',
                icon: UtensilsCrossed,
                label: 'Chá de Panela',
                emoji: '🍳',
                description: 'Prepare sua nova casa'
            };
        case 'outro':
        default:
            return {
                color: 'generic',
                gradient: 'gradient-generic',
                icon: PartyPopper,
                label: 'Festa',
                emoji: '🎉',
                description: 'Celebre momentos especiais'
            };
    }
};

export const getPartyColorClass = (type: PartyType = 'natal') => {
    const theme = getPartyTheme(type);
    return `text-${theme.color}`;
};

export const getPartyBgClass = (type: PartyType = 'natal') => {
    const theme = getPartyTheme(type);
    return `bg-${theme.color}/10`;
};
