export type BankingCardType = "DEBIT" | "CREDIT"; // ajusta según tu enum real
export type BankingCardStatus = "ACTIVE" | "BLOCKED" | "EXPIRED"; // idem

export interface BankingCard {
  id: number;
  bankingAccountId: number; // o puedes usar BankingAccount si necesitas toda la info
  cardNumber: string;
  cardCVV: string;
  cardPIN: string;
  expiredDate: string;
  cardType: BankingCardType;
  cardStatus: BankingCardStatus;
  createdAt: string; // o Date si haces parsing
  updatedAt: string;
}
