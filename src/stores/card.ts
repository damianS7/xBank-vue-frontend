import { defineStore } from "pinia";
import type { BankingAccount } from "../types/BankingAccount";

export const useAccountStore = defineStore("card", {
  state: () => ({
    bankingAccounts: [] as BankingAccount[],
    initialized: false,
  }),

  getters: {
    countAccounts: (state) => {
      return state.bankingAccounts.length;
    },
    getBankingAccount: (state) => {
      return (id: number) => {
        return state.bankingAccounts.find((a) => a.id === id);
      };
    },
    getBankingAccounts: (state) => {
      return state.bankingAccounts;
    },
  },

  actions: {
    async getCustomerBankingAccounts(token: string) {
      try {
        const res = await fetch(
          "http://localhost:8080/api/v1/banking/accounts/me",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Problema al obtener banking accounts");
        }

        const accounts = await res.json();
        return accounts;
      } catch (error) {
        console.error("Error en login:", error);
        throw error;
      }
    },
    async openBankingAccount(type: string, currency: string, token: string) {
      try {
        const res = await fetch(
          "http://localhost:8080/api/v1/banking/accounts/open",
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
    setAccounts(accounts: any) {
      this.bankingAccounts = accounts;
    },
    addAccount(account: BankingAccount) {
      this.bankingAccounts.push(account);
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
