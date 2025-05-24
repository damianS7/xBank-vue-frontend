export type BankingTransactionType =
  | "CARD_CHARGE"
  | "DEPOSIT"
  | "WITHDRAWAL"
  | "TRANSFER";
export type BankingTransactionStatus = "PENDING" | "COMPLETED" | "FAILED"; // Ajusta también si es necesario

export interface BankingTransaction {
  id: number;
  bankingAccountId: number;
  bankingCardId: number;
  amount: number;
  description: string;
  transactionType: BankingTransactionType;
  transactionStatus: BankingTransactionStatus;
  createdAt: Date;
  updatedAt: Date;
}
