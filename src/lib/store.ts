import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type PartyType = 'natal' | 'reveillon' | 'aniversario' | 'casamento' | 'formatura' | 'cha_bebe' | 'cha_panela' | 'outro';

export interface Guest {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  confirmed: boolean;
  plusOne: boolean;
  createdAt: string;
}

export interface ShoppingItem {
  id: string;
  name: string;
  category: 'bebidas' | 'comidas' | 'doces' | 'descartaveis' | 'decoracao';
  quantity: number;
  unit: string;
  estimatedPrice: number;
  purchased: boolean;
  actualPrice?: number;
}

export interface BudgetCategory {
  category: string;
  planned: number;
  spent: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  partyType?: PartyType;
  partyDate?: string;
  expectedGuests?: number;
  totalBudget?: number;
  onboardingComplete: boolean;
}

export interface Template {
  id: string;
  type: 'cardapio' | 'decoracao' | 'playlist' | 'checklist';
  content: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface AppState {
  // Auth
  isAuthenticated: boolean;
  user: UserProfile | null;

  // Guests
  guests: Guest[];

  // Shopping
  shoppingList: ShoppingItem[];

  // Budget
  budgetCategories: BudgetCategory[];

  // Templates
  templates: Template[];

  // Chat
  chatMessages: ChatMessage[];

  // Premium popup
  showPremiumPopup: boolean;

  // Actions
  setUser: (user: UserProfile | null) => void;
  setAuthenticated: (value: boolean) => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;

  addGuest: (guest: Omit<Guest, 'id' | 'createdAt'>) => void;
  updateGuest: (id: string, guest: Partial<Guest>) => void;
  removeGuest: (id: string) => void;

  addShoppingItem: (item: Omit<ShoppingItem, 'id'>) => void;
  updateShoppingItem: (id: string, item: Partial<ShoppingItem>) => void;
  removeShoppingItem: (id: string) => void;

  setBudgetCategories: (categories: BudgetCategory[]) => void;
  updateBudgetCategory: (category: string, data: Partial<BudgetCategory>) => void;

  addTemplate: (template: Omit<Template, 'id' | 'createdAt'>) => void;

  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearChat: () => void;

  setShowPremiumPopup: (show: boolean) => void;

  logout: () => void;
}

const generateId = () => Math.random().toString(36).substring(2, 15);

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      guests: [],
      shoppingList: [],
      budgetCategories: [
        { category: 'Bebidas', planned: 0, spent: 0 },
        { category: 'Comidas', planned: 0, spent: 0 },
        { category: 'Doces', planned: 0, spent: 0 },
        { category: 'Descartáveis', planned: 0, spent: 0 },
        { category: 'Decoração', planned: 0, spent: 0 },
      ],
      templates: [],
      chatMessages: [],
      showPremiumPopup: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setAuthenticated: (value) => set({ isAuthenticated: value }),

      updateUserProfile: async (profile) => {
        const { supabase } = await import('./supabase');
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase
          .from('profiles')
          .update({
            name: profile.name,
            party_type: profile.partyType,
            party_date: profile.partyDate,
            expected_guests: profile.expectedGuests,
            total_budget: profile.totalBudget,
            onboarding_complete: profile.onboardingComplete
          })
          .eq('id', user.id);

        if (!error) {
          set((state) => ({
            user: state.user ? { ...state.user, ...profile } : null,
          }));
        }
      },

      addGuest: async (guest) => {
        const { supabase } = await import('./supabase');
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('guests')
          .insert({
            user_id: user.id,
            name: guest.name,
            email: guest.email,
            phone: guest.phone,
            confirmed: guest.confirmed,
            plus_one: guest.plusOne
          })
          .select()
          .single();

        if (!error && data) {
          set((state) => ({
            guests: [
              ...state.guests,
              {
                ...guest,
                id: data.id,
                createdAt: data.created_at
              },
            ],
          }));
        }
      },

      updateGuest: async (id, guest) => {
        const { supabase } = await import('./supabase');
        const { error } = await supabase
          .from('guests')
          .update({
            name: guest.name,
            email: guest.email,
            phone: guest.phone,
            confirmed: guest.confirmed,
            plus_one: guest.plusOne
          })
          .eq('id', id);

        if (!error) {
          set((state) => ({
            guests: state.guests.map((g) =>
              g.id === id ? { ...g, ...guest } : g
            ),
          }));
        }
      },

      removeGuest: async (id) => {
        const { supabase } = await import('./supabase');
        const { error } = await supabase
          .from('guests')
          .delete()
          .eq('id', id);

        if (!error) {
          set((state) => ({
            guests: state.guests.filter((g) => g.id !== id),
          }));
        }
      },

      addShoppingItem: async (item) => {
        const { supabase } = await import('./supabase');
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('shopping_items')
          .insert({
            user_id: user.id,
            name: item.name,
            category: item.category,
            quantity: item.quantity,
            unit: item.unit,
            estimated_price: item.estimatedPrice,
            purchased: item.purchased,
            actual_price: item.actualPrice
          })
          .select()
          .single();

        if (!error && data) {
          set((state) => ({
            shoppingList: [...state.shoppingList, { ...item, id: data.id }],
          }));
        }
      },

      updateShoppingItem: async (id, item) => {
        const { supabase } = await import('./supabase');
        const { error } = await supabase
          .from('shopping_items')
          .update({
            name: item.name,
            category: item.category,
            quantity: item.quantity,
            unit: item.unit,
            estimated_price: item.estimatedPrice,
            purchased: item.purchased,
            actual_price: item.actualPrice
          })
          .eq('id', id);

        if (!error) {
          set((state) => ({
            shoppingList: state.shoppingList.map((i) =>
              i.id === id ? { ...i, ...item } : i
            ),
          }));
        }
      },

      removeShoppingItem: async (id) => {
        const { supabase } = await import('./supabase');
        const { error } = await supabase
          .from('shopping_items')
          .delete()
          .eq('id', id);

        if (!error) {
          set((state) => ({
            shoppingList: state.shoppingList.filter((i) => i.id !== id),
          }));
        }
      },

      setBudgetCategories: (categories) => set({ budgetCategories: categories }),

      updateBudgetCategory: async (category, data) => {
        const { supabase } = await import('./supabase');
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Check if category exists
        const { data: existing } = await supabase
          .from('budget_categories')
          .select()
          .eq('user_id', user.id)
          .eq('category', category)
          .single();

        if (existing) {
          await supabase
            .from('budget_categories')
            .update({
              planned: data.planned,
              spent: data.spent
            })
            .eq('id', existing.id);
        } else {
          await supabase
            .from('budget_categories')
            .insert({
              user_id: user.id,
              category: category,
              planned: data.planned || 0,
              spent: data.spent || 0
            });
        }

        set((state) => ({
          budgetCategories: state.budgetCategories.map((c) =>
            c.category === category ? { ...c, ...data } : c
          ),
        }));
      },

      addTemplate: async (template) => {
        const { supabase } = await import('./supabase');
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('templates')
          .insert({
            user_id: user.id,
            type: template.type,
            content: template.content
          })
          .select()
          .single();

        if (!error && data) {
          set((state) => ({
            templates: [
              ...state.templates,
              { ...template, id: data.id, createdAt: data.created_at },
            ],
          }));
        }
      },

      addChatMessage: (message) =>
        set((state) => ({
          chatMessages: [
            ...state.chatMessages,
            { ...message, id: generateId(), timestamp: new Date().toISOString() },
          ],
        })),

      clearChat: () => set({ chatMessages: [] }),

      setShowPremiumPopup: (show) => set({ showPremiumPopup: show }),

      logout: async () => {
        const { supabase } = await import('./supabase');
        await supabase.auth.signOut();
        set({
          isAuthenticated: false,
          user: null,
          guests: [],
          shoppingList: [],
          templates: [],
          chatMessages: []
        });
      },
    }),
    {
      name: 'festa-perfeita-storage',
      partialize: (state) => ({
        // Only persist non-sensitive / non-auth state if needed, 
        // but for now we keep it simple. 
        // Ideally we shouldn't persist 'user' if we rely on Supabase session, 
        // but we'll keep it for the UI cache.
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        // Persist local data until we move to DB
        // guests: state.guests, // Don't persist lists locally anymore to avoid sync issues
        // shoppingList: state.shoppingList,
        // budgetCategories: state.budgetCategories,
        // templates: state.templates,
      }),
    }
  )
);
