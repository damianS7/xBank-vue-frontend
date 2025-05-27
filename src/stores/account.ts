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
    async getCustomerBankingAccounts(): Promise<BankingAccount[]> {
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
        if (!response.ok) {
          throw new Error("Failed to open account");
        }

        const accounts = await response.json();

        return accounts.map((account: any) => ({
          ...account,
          createdAt: new Date(account.createdAt),
          updatedAt: new Date(account.updatedAt),
        })) as BankingAccount[];
      } catch (error: unknown) {
        throw new Error("Failed to open account");
      }
    },
    async fetchPageableTransactions(
      accountId: number,
      page: number,
      size: number
    ) {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.VUE_APP_API_URL}/customers/me/banking/accounts/${accountId}/transactions?page=${page}&size=${size}&sort=createdAt,DESC`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch transactions");
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
    async createBankingAccount(
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

        const account = await response.json();

        return {
          ...account,
          createdAt: new Date(account.createdAt),
          updatedAt: new Date(account.updatedAt),
        } as BankingAccount;
      } catch (error: unknown) {
        throw new Error("Failed to open account");
      }
    },
    async toggleBankingAccountStatus(
      accountId: string,
      password: string
    ): Promise<BankingAccount> {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.VUE_APP_API_URL}/customers/me/banking/account/${accountId}/close`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              password,
            }),
          }
        );

        // if response is not 200, throw an error
        if (!response.ok) {
          throw new Error("Failed to close account");
        }

        const account = await response.json();

        return {
          ...account,
          createdAt: new Date(account.createdAt),
          updatedAt: new Date(account.updatedAt),
        } as BankingAccount;
      } catch (error: unknown) {
        throw new Error("Failed to close account");
      }
    },
    async createAndLinkBankingCard(
      accountId: string,
      cardType: string
    ): Promise<BankingCard> {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.VUE_APP_API_URL}/customers/me/banking/account/` +
            accountId +
            "/card/request",
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

        // if response is not 200, throw an error
        if (response.status !== 201) {
          throw new Error("Failed to request card");
        }

        const card = await response.json();
        return {
          ...card,
          expiredDate: new Date(card.expiredDate),
          createdAt: new Date(card.createdAt),
          updatedAt: new Date(card.updatedAt),
        } as BankingCard;
      } catch (error: unknown) {
        // handle errors
        throw new Error("Failed to request card");
      }
    },
    async setAlias(accountId: string, alias: string): Promise<BankingAccount> {
      try {
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

        // if response is not 200, throw an error
        if (response.status !== 200) {
          throw new Error("Failed to set an alias");
        }

        const account = await response.json();

        return {
          ...account,
          createdAt: new Date(account.createdAt),
          updatedAt: new Date(account.updatedAt),
        } as BankingAccount;
      } catch (error: unknown) {
        // handle errors
        throw new Error("Failed to set an alias");
      }
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
