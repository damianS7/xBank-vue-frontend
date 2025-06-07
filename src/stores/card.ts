import { defineStore } from "pinia";
import type { BankingCard, BankingCardLockStatus } from "../types/BankingCard";
import { BankingTransaction } from "@/types/BankingTransaction";

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
    async fetchTransactions(
      id: number,
      page: number,
      size: number
    ): Promise<BankingTransaction[]> {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.VUE_APP_API_URL}/customers/me/banking/cards/${id}/transactions?page=${page}&size=${size}&sort=createdAt,DESC`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // if response is not 200, throw an error
        if (response.status !== 200) {
          const json = await response.json();
          throw new Error(json?.message || "Failed to fetch transactions.");
        }

        const paginatedTransactions = await response.json();
        const parsedTransactions = paginatedTransactions.content.map(
          (transaction: any) => ({
            ...transaction,
            createdAt: new Date(transaction.createdAt),
            updatedAt: new Date(transaction.updatedAt),
          })
        );

        // replace content with parsed dates
        paginatedTransactions.content = parsedTransactions;
        return paginatedTransactions;
      } catch (error: any) {
        throw new Error(error.message || "Failed to fetch transactions");
      }
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
      pin: string,
      password: string
    ): Promise<BankingCard> {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.VUE_APP_API_URL}/customers/me/banking/cards/${cardId}/pin`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ pin, password }),
          }
        );

        if (!response.ok) {
          // problem setting pin
          const error = await response.json();
          throw new Error("Error updating pin. " + error.message);
        }

        const cardJson = await response.json();
        const card = {
          ...cardJson,
          expiredDate: new Date(cardJson.expiredDate),
          createdAt: new Date(cardJson.createdAt),
          updatedAt: new Date(cardJson.updatedAt),
        };

        return card as BankingCard;
      } catch (error: unknown) {
        throw new Error("Error updating ping.");
      }
    },
    async setDailyLimit(
      cardId: number,
      dailyLimit: number,
      password: string
    ): Promise<BankingCard> {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.VUE_APP_API_URL}/customers/me/banking/cards/${cardId}/daily-limit`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ dailyLimit, password }),
          }
        );

        if (!response.ok) {
          // problem setting pin
          const error = await response.json();
          throw new Error("Failed updating card daily limit. " + error.message);
        }

        const cardJson = await response.json();
        const card = {
          ...cardJson,
          expiredDate: new Date(cardJson.expiredDate),
          createdAt: new Date(cardJson.createdAt),
          updatedAt: new Date(cardJson.updatedAt),
        };
        return card as BankingCard;
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw new Error(error.message);
        } else {
          throw new Error("Failed updating card daily limit. Unknown error.");
        }
      }
    },
    async setLockStatus(
      cardId: number,
      lockStatus: BankingCardLockStatus,
      password: string
    ): Promise<BankingCard> {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.VUE_APP_API_URL}/customers/me/banking/cards/${cardId}/lock-status`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ lockStatus, password }),
          }
        );

        if (!response.ok) {
          // problem setting pin
          const errorJson = await response.json();
          throw new Error("Error setting lock on card." + errorJson);
        }

        const cardJson = await response.json();
        const card = {
          ...cardJson,
          expiredDate: new Date(cardJson.expiredDate),
          createdAt: new Date(cardJson.createdAt),
          updatedAt: new Date(cardJson.updatedAt),
        };
        return card as BankingCard;
      } catch (error: unknown) {
        throw new Error("Error setting lock on card.");
      }
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
