import { BankingTransaction } from "@/types/BankingTransaction";
import { BankingCard } from "@/types/BankingCard";

export type BankingAccountType = "SAVINGS" | "CHECKING" | "FIXED";
export type BankingAccountCurrency = "USD" | "EUR" | "GBP" | "ARS"; // ajusta según tus enums reales
export type BankingAccountStatus = "ACTIVE" | "INACTIVE" | "CLOSED";

export interface BankingAccount {
  id: number;
  customerId: number; // o puedes usar un tipo Customer si necesitas los datos
  accountTransactions: BankingTransaction[];
  bankingCards: BankingCard[];
  accountNumber: string;
  balance: number;
  accountType: BankingAccountType;
  accountCurrency: BankingAccountCurrency;
  accountStatus: BankingAccountStatus;
  createdAt: string; // o Date si haces parsing
  updatedAt: string;
}
