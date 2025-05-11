// types/CustomerProfile.ts
export interface CustomerProfile {
  id: number;
  customerId: number; // suponiendo que lo incluyes como ID de referencia
  name: string;
  surname: string;
  phone: string;
  birthdate: string; // o Date si lo convertís en el frontend
  gender: "MALE" | "FEMALE"; // ajusta según los valores posibles en `CustomerGender`
  photoPath: string;
  address: string;
  postalCode: string;
  country: string;
  nationalId: string;
  updatedAt: string; // o Date
}
