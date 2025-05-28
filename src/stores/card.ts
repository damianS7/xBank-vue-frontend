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
        return state.bankingCards.find((card) => card.id === id);
      };
    },
    getBankingCards: (state) => {
      return state.bankingCards;
    },
    getBankingCardsByAccountId: (state) => {
      return (accountId: number) => {
        return state.bankingCards.filter(
          (card) => card.bankingAccountId === accountId
        );
      };
    },
  },

  actions: {
    async getCustomerBankingCards() {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.VUE_APP_API_URL}/customers/me/banking/cards`,
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
        transactions: [],
        expiredDate: new Date(card.expiredDate),
        createdAt: new Date(card.createdAt),
        updatedAt: new Date(card.updatedAt),
      }));
    },
    async fetchTransactions(cardId: number) {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.VUE_APP_API_URL}/customers/me/banking/cards/${cardId}/transactions`,
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

      const transactionsJson = await res.json();
      const transactions = transactionsJson.map((transaction: any) => ({
        ...transaction,
        createdAt: new Date(transaction.createdAt),
        updatedAt: new Date(transaction.updatedAt),
      }));
      return { transactions, status: res.status };
    },
    async fetchPageableTransactions(
      cardId: number,
      page: number,
      size: number
    ) {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.VUE_APP_API_URL}/customers/me/banking/cards/${cardId}/transactions?page=${page}&size=${size}&sort=createdAt,DESC`,

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

      const paginatedTransactions = await res.json();
      const parsedTransactions = paginatedTransactions.content.map(
        (transaction: any) => ({
          ...transaction,
          createdAt: new Date(transaction.createdAt),
          updatedAt: new Date(transaction.updatedAt),
        })
      );

      // replace content with parsed dates
      paginatedTransactions.content = parsedTransactions;
      return { paginator: paginatedTransactions, status: res.status };
    },
    async setCardPin(
      cardId: number,
      pin: string
    ): Promise<BankingCardResponse> {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.VUE_APP_API_URL}/customers/me/banking/cards/${cardId}/pin`,
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
    async setDailyLimit(
      cardId: number,
      dailyLimit: number
    ): Promise<BankingCardResponse> {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.VUE_APP_API_URL}/customers/me/banking/cards/${cardId}/daily-limit`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ dailyLimit }),
        }
      );

      if (!response.ok) {
        // problem setting limit
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
        `${process.env.VUE_APP_API_URL}/customers/me/banking/cards/${cardId}/locking`,
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
    setCardTransactions(cardId: number, transactions: any) {
      const index = this.bankingCards.findIndex((a) => a.id === cardId);
      if (index !== -1) {
        // this.bankingCards.splice(index, 1, transactions);
        this.bankingCards[index].transactions = transactions;
      }
    },
    removeCard(cardId: number) {
      const index = this.bankingCards.findIndex((a) => a.id === cardId);
      if (index !== -1) {
        this.bankingCards.splice(index, 1);
      }
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
