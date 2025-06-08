import { defineStore } from "pinia";
import type { BankingAccount } from "@/types/BankingAccount";
import type { BankingCard } from "@/types/BankingCard";

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
        return total + (account.accountCards?.length || 0);
      }, 0);
    },
    getBankingAccount: (state) => {
      return (id: number) => {
        return state.bankingAccounts.find((account) => account.id === id);
      };
    },
    getBankingAccounts: (state) => {
      return state.bankingAccounts;
    },
    getBankingCards: (state) => {
      return state.bankingAccounts.flatMap((account) => account.accountCards);
    },
  },
  actions: {
    async fetchAccounts(): Promise<BankingAccount[]> {
      try {
        const token = localStorage.getItem("token");
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

        // if response is not 200, throw an error
        if (response.status !== 200) {
          const error = await response.json();
          throw new Error(error.message || "Failed to fetch accounts");
        }

        const accounts = await response.json();

        return accounts.map((account: any) => ({
          ...account,
          createdAt: new Date(account.createdAt),
          updatedAt: new Date(account.updatedAt),
        })) as BankingAccount[];
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error("Failed to fetch accounts");
      }
    },
    async requestBankingAccount(
      type: string,
      currency: string
    ): Promise<BankingAccount> {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.VUE_APP_API_URL}/customers/me/banking/accounts/request`,
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
        if (response.status !== 201) {
          const error = await response.json();
          throw new Error(error.message || "Failed to open account");
        }

        const account = await response.json();

        return {
          ...account,
          createdAt: new Date(account.createdAt),
          updatedAt: new Date(account.updatedAt),
        } as BankingAccount;
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error("Failed to open account");
      }
    },
    async requestBankingCard(
      accountId: string,
      cardType: string
    ): Promise<BankingCard> {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.VUE_APP_API_URL}/customers/me/banking/accounts/` +
            accountId +
            "/cards/request",
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

        // if response is not 201, throw an error
        if (response.status !== 201) {
          const error = await response.json();
          throw new Error(error.message || "Failed to request card");
        }

        const card = await response.json();
        return {
          ...card,
          expiredDate: new Date(card.expiredDate),
          createdAt: new Date(card.createdAt),
          updatedAt: new Date(card.updatedAt),
        } as BankingCard;
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error("Failed to request card");
      }
    },
    async updateBankingAccountAlias(
      accountId: string,
      alias: string,
      password: string
    ): Promise<BankingAccount> {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.VUE_APP_API_URL}/customers/me/banking/accounts/` +
            accountId +
            "/alias",
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              alias,
              password,
            }),
          }
        );

        // if response is not 200, throw an error
        if (response.status !== 200) {
          const error = await response.json();
          throw new Error(error.message || "Failed to set an alias");
        }

        const account = await response.json();

        return {
          ...account,
          createdAt: new Date(account.createdAt),
          updatedAt: new Date(account.updatedAt),
        } as BankingAccount;
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error("Failed to set an alias");
      }
    },
    setAccounts(accounts: any) {
      this.bankingAccounts = accounts;
    },
    setAccount(account: any) {
      const index = this.bankingAccounts.findIndex(
        (account) => account.id === account.id
      );

      if (index !== -1) {
        // this.bankingAccounts[index] = account;
        this.bankingAccounts.splice(index, 1, account);
      }
    },
    setBalance(accountId: number, balance: number) {
      const account = this.bankingAccounts.find((acc) => acc.id === accountId);
      if (account) {
        account.balance = balance;
      }
    },
    addAccount(account: BankingAccount) {
      // this.bankingAccounts.push(account);
      this.bankingAccounts = [...this.bankingAccounts, account];
    },
    addCard(accountId: number, card: BankingCard) {
      const account = this.bankingAccounts.find(
        (account) => account.id === accountId
      );
      account?.accountCards.push(card);
    },
    async initialize() {
      // if store its already initialized
      if (this.initialized) {
        // do nothing
        return;
      }

      // get the stored token
      const storedToken = localStorage.getItem("token");

      // if the token exists
      if (storedToken) {
        // get the accounts
        const accounts = await this.fetchAccounts();

        // add the accounts array to the store
        this.setAccounts(accounts);
      }

      // store initialized
      this.initialized = true;
    },
  },
});
