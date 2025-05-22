import { BankingTransaction } from "@/types/BankingTransaction";
import { BankingCard } from "@/types/BankingCard";

export type BankingAccountType = "SAVINGS" | "CHECKING";
export type BankingAccountCurrency = "USD" | "EUR";
export type BankingAccountStatus = "OPEN" | "CLOSED" | "SUSPENDED";

export interface BankingAccount {
  id: number;
  customerId: number;
  alias: string;
  accountTransactions: BankingTransaction[];
  bankingCards: BankingCard[];
  accountNumber: string;
  balance: number;
  accountType: BankingAccountType;
  accountCurrency: BankingAccountCurrency;
  accountStatus: BankingAccountStatus;
  createdAt: Date;
  updatedAt: Date;
}
