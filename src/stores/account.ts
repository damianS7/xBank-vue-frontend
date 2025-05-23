import { defineStore } from "pinia";
import type { BankingAccount } from "../types/BankingAccount";
import type { BankingCard } from "../types/BankingCard";

export const useAccountStore = defineStore("account", {
  state: () => ({
    bankingAccounts: [] as BankingAccount[],
    initialized: false,
  }),

  getters: {
    countAccounts: (state) => {
      return state.bankingAccounts.length;
    },
    countCards: (state) => {
      return state.bankingAccounts.reduce((total, account) => {
        return total + (account.bankingCards?.length || 0);
      }, 0);
    },
    totalBalance: (state) => {
      return state.bankingAccounts.reduce((total, account) => {
        return total + (account.balance || 0);
      }, 0);
    },
    getBankingAccount: (state) => {
      return (id: number) => {
        return state.bankingAccounts.find((a) => a.id === id);
      };
    },
    getBankingCard() {
      return (id: number) => {
        return this.getBankingCards.find((card) => card.id === id);
      };
    },
    getBankingAccounts: (state) => {
      return state.bankingAccounts;
    },
    getBankingCards: (state) => {
      return state.bankingAccounts.flatMap((account) => account.bankingCards);
    },
  },

  actions: {
    async getCustomerBankingAccounts(token: string) {
      const response = await fetch(
        "http://localhost:8080/api/v1/customers/me/banking/accounts",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const accountsJson = await response.json();

      const accounts = accountsJson.map((account: any) => ({
        ...account,
        createdAt: new Date(account.createdAt),
        updatedAt: new Date(account.updatedAt),
      }));

      return accounts;
    },
    async openBankingAccount(type: string, currency: string, token: string) {
      try {
        const res = await fetch(
          "http://localhost:8080/api/v1/customers/me/banking/accounts/open",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              accountType: type,
              accountCurrency: currency,
            }),
          }
        );

        if (!res.ok) {
          throw new Error("Problema al abrir la cuenta");
        }

        const account = await res.json();
        console.log("Cuenta creada:", account);
        this.addAccount(account);
        return account;
      } catch (error) {
        console.error("Error:", error);
        throw error;
      }
    },
    async requestBankingCard(
      token: string,
      accountId: string,
      cardType: string
    ) {
      const response = await fetch(
        "http://localhost:8080/api/v1/customers/me/banking/account/" +
          accountId +
          "/cards",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            cardType,
          }),
        }
      );

      const data = await response.json();
      return { status: response.status, data };
    },
    async setAlias(accountId: string, alias: string) {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:8080/api/v1/customers/me/banking/account/" +
          accountId +
          "/alias",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            alias,
          }),
        }
      );

      const data = await response.json();
      return { status: response.status, data };
    },
    setAccounts(accounts: any) {
      this.bankingAccounts = accounts;
    },
    setAccount(newAccount: any) {
      const index = this.bankingAccounts.findIndex(
        (account) => account.id === newAccount.id
      );
      if (index !== -1) {
        this.bankingAccounts[index] = newAccount;
      }
    },
    addAccount(account: BankingAccount) {
      this.bankingAccounts.push(account);
    },
    addCard(accountId: number, card: BankingCard) {
      const account = this.bankingAccounts.find(
        (account) => account.id === accountId
      );
      account?.bankingCards.push(card);
    },
    async initialize() {
      if (this.initialized) {
        return;
      }

      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        const accounts = await this.getCustomerBankingAccounts(savedToken);
        this.setAccounts(accounts);
      }
      this.initialized = true;
    },
  },
});
