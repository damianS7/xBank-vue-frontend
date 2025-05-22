import { defineStore } from "pinia";
import type { BankingCard } from "../types/BankingCard";

export const useCardStore = defineStore("card", {
  state: () => ({
    bankingCards: [] as BankingCard[],
    initialized: false,
  }),

  getters: {
    countCards: (state) => {
      return state.bankingCards.length;
    },
    getBankingCard: (state) => {
      return (id: number) => {
        return state.bankingCards.find((a) => a.id === id);
      };
    },
    getBankingCards: (state) => {
      return state.bankingCards;
    },
  },

  actions: {
    async getCustomerBankingCards(token: string) {
      const res = await fetch(
        "http://localhost:8080/api/v1/customers/me/banking/cards",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Problema al obtener banking cards");
      }

      const cards = await res.json();
      return cards;
    },
    setCards(cards: any) {
      this.bankingCards = cards;
    },
    addCard(card: BankingCard) {
      this.bankingCards.push(card);
    },
    async initialize() {
      if (this.initialized) {
        return;
      }

      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        const cards = await this.getCustomerBankingCards(savedToken);
        this.setCards(cards);
      }
      this.initialized = true;
    },
  },
});
