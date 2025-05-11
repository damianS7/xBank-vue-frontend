import { defineStore } from "pinia";
import type { BankingAccount } from "../types/BankingAccount";

export const useAccountStore = defineStore("account", {
  state: () => ({
    bankingAccounts: [] as BankingAccount[],
    initialized: false,
  }),

  getters: {
    countAccounts: (state) => {
      return state.bankingAccounts.length;
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
        console.log("Banking accounts:", accounts);
        return accounts;
      } catch (error) {
        console.error("Error en login:", error);
        throw error;
      }
    },
    setAccounts(accounts: any) {
      this.bankingAccounts = accounts;
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
