import { defineStore } from "pinia";
import type { BankingAccount } from "@/types/BankingAccount";
import type { BankingCard } from "@/types/BankingCard";

interface GenericErrorResponse {
  message: string;
  status: number;
}

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
        `${process.env.VUE_APP_API_URL}/customers/me/banking/accounts`,
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
    async openBankingAccount(
      type: string,
      currency: string
    ): Promise<BankingAccount> {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.VUE_APP_API_URL}/customers/me/banking/accounts/open`,
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

        // if response is not 200, throw an error
        if (!response.ok) {
          throw new Error("Failed to open account");
        }

        const jsonAccount = await response.json();

        return jsonAccount.map((account: any) => ({
          ...account,
          createdAt: new Date(account.createdAt),
          updatedAt: new Date(account.updatedAt),
        })) as BankingAccount;
      } catch (error: unknown) {
        throw new Error("Failed to open account");
      }
    },
    async requestBankingCard(
      token: string,
      accountId: string,
      cardType: string
    ) {
      const response = await fetch(
        `${process.env.VUE_APP_API_URL}/customers/me/banking/account/` +
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
        `${process.env.VUE_APP_API_URL}/customers/me/banking/account/` +
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
