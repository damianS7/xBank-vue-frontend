export type BankingCardType = "DEBIT" | "CREDIT"; // ajusta según tu enum real
export type BankingCardStatus =
  | "ENABLED"
  | "DISABLED"
  | "SUSPENDED"
  | "LOCKED"
  | "BLOCKED";

export interface BankingCard {
  id: number;
  bankingAccountId: number; // o puedes usar BankingAccount si necesitas toda la info
  cardNumber: string;
  cardCVV: string;
  cardPIN: string;
  expiredDate: Date;
  cardType: BankingCardType;
  cardStatus: BankingCardStatus;
  createdAt: Date;
  updatedAt: Date;
}
