import { defineStore } from "pinia";
import type { BankingCard, BankingCardLockStatus } from "../types/BankingCard";

type BankingCardResponse = {
  card?: BankingCard;
  message?: string;
  errors?: Record<string, string>;
  status: number;
};

export const useCardStore = defineStore("card", {
  state: () => ({
    bankingCards: [] as BankingCard[],
    initialized: false,
  }),

  getters: {
    countCards: (state) => {
      return state.bankingCards.length;
    },
    countCardsByAccount: (state) => {
      return (accountId: number) => {
        return state.bankingCards.filter(
          (card) => card.bankingAccountId === accountId
        ).length;
      };
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
    async getCustomerBankingCards() {
      const token = localStorage.getItem("token");
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

      const cardsJson = await res.json();
      return cardsJson.map((card: any) => ({
        ...card,
        expiredDate: new Date(card.expiredDate),
        createdAt: new Date(card.createdAt),
        updatedAt: new Date(card.updatedAt),
      }));
    },
    async setCardPin(
      cardId: number,
      pin: string
    ): Promise<BankingCardResponse> {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8080/api/v1/customers/me/banking/cards/${cardId}/pin`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ pin }),
        }
      );

      if (!response.ok) {
        // problem setting pin
        const errorJson = await response.json();
        return errorJson;
      }

      const cardJson = await response.json();
      const card = {
        ...cardJson,
        expiredDate: new Date(cardJson.expiredDate),
        createdAt: new Date(cardJson.createdAt),
        updatedAt: new Date(cardJson.updatedAt),
      };
      return { card, status: response.status };
    },
    async setLockStatus(
      cardId: number,
      lockStatus: BankingCardLockStatus
    ): Promise<BankingCardResponse> {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8080/api/v1/customers/me/banking/cards/${cardId}/locking`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ lockStatus }),
        }
      );

      if (!response.ok) {
        // problem setting pin
        const errorJson = await response.json();
        return errorJson;
      }

      const cardJson = await response.json();
      const card = {
        ...cardJson,
        expiredDate: new Date(cardJson.expiredDate),
        createdAt: new Date(cardJson.createdAt),
        updatedAt: new Date(cardJson.updatedAt),
      };
      return { card, status: response.status };
    },
    setCards(cards: any) {
      this.bankingCards = cards;
    },
    setCard(card: BankingCard) {
      const index = this.bankingCards.findIndex((a) => a.id === card.id);
      if (index !== -1) {
        // this.bankingCards[index] = card; // non reactive
        this.bankingCards.splice(index, 1, card); // reactive
      }
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
        const cards = await this.getCustomerBankingCards();
        this.setCards(cards);
      }
      this.initialized = true;
    },
  },
});
