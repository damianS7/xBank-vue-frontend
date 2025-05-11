export type BankingTransactionType = "DEPOSIT" | "WITHDRAWAL" | "TRANSFER"; // Ajusta según tu enum real
export type BankingTransactionStatus = "PENDING" | "COMPLETED" | "FAILED"; // Ajusta también si es necesario

export interface BankingTransaction {
  id: number;
  bankingAccountId: number; // O usa el tipo completo si necesitas más información
  amount: number; // BigDecimal → number
  description: string;
  transactionType: BankingTransactionType;
  transactionStatus: BankingTransactionStatus;
  createdAt: string; // o Date si haces parsing
  updatedAt: string;
}
