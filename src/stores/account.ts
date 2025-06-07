import { defineStore } from "pinia";
import type { BankingAccount } from "@/types/BankingAccount";
import type { BankingCard } from "@/types/BankingCard";
import type { BankingTransaction } from "@/types/BankingTransaction";

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
    totalBalance: (state) => {
      return state.bankingAccounts.reduce((total, account) => {
        return total + (account.balance || 0);
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
          throw new Error(error.message);
        }
        throw new Error("Failed to fetch accounts");
      }
    },
    async fetchTransactions(
      accountId: number,
      page: number,
      size: number
    ): Promise<BankingTransaction[]> {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.VUE_APP_API_URL}/customers/me/banking/accounts/${accountId}/transactions?page=${page}&size=${size}&sort=createdAt,DESC`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status !== 200) {
          const error = await response.json();
          throw new Error(error.message || "Failed to tetch transactions");
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
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw new Error(error.message);
        }
        throw new Error("Failed to fetch transactions");
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
          throw new Error(error.message);
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
          throw new Error(error.message);
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
          throw new Error(error.message);
        }
        throw new Error("Failed to set an alias");
      }
    },
    async createBankingTransaction(
      fromBankingAccountId: string,
      toBankingAccountNumber: string,
      amount: string,
      description: string,
      transactionType: string,
      password: string
    ): Promise<BankingTransaction> {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.VUE_APP_API_URL}/customers/me/banking/accounts/${fromBankingAccountId}/transactions`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              toBankingAccountNumber,
              transactionType,
              description,
              amount,
              password,
            }),
          }
        );

        // if response is not 201, throw an error
        if (response.status !== 201) {
          const error = await response.json();
          throw new Error(error.message || "Failed to create transaction.");
        }

        const transaction = await response.json();

        return {
          ...transaction,
          createdAt: new Date(transaction.createdAt),
          updatedAt: new Date(transaction.updatedAt),
        } as BankingTransaction;
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw new Error(error.message);
        }

        throw new Error("Failed to create transaction.");
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
    addAccount(account: BankingAccount) {
      console.log(account);
      // this.bankingAccounts.push(account);
      this.bankingAccounts = [...this.bankingAccounts, account];
    },
    addTransaction(transaction: BankingTransaction) {
      const account = this.getBankingAccount(transaction.bankingAccountId);
      account?.accountTransactions.push(transaction);
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
