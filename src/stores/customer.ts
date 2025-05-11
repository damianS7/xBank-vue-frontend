import { defineStore } from "pinia";
import type { CustomerProfile } from "@/types/CustomerProfile";

export const useCustomerStore = defineStore("customer", {
  state: () => ({
    customer: {
      id: "",
      email: "",
      role: "",
      profile: {} as CustomerProfile | null,
      createdAt: "",
      updatedAt: "",
    },
    initialized: false,
  }),

  getters: {},

  actions: {
    async getCustomer(token: string) {
      try {
        const res = await fetch("http://localhost:8080/api/v1/customers/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Problema al obtener el customer");
        }

        const customer = await res.json();
        this.setCustomer(customer);
      } catch (error) {
        console.error("Error en login:", error);
        throw error;
      }
    },
    setCustomer(customer: any) {
      this.customer = customer;
    },
    async initialize() {
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        this.getCustomer(savedToken);
      }
      this.initialized = true;
    },
  },
});
