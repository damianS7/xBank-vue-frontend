import { defineStore } from "pinia";
import type { Customer } from "@/types/Customer";

export const useCustomerStore = defineStore("customer", {
  state: () => ({
    customer: {} as Customer,
    initialized: false,
  }),

  getters: {
    getLoggedCustomer: (state) => {
      return state.customer;
    },
  },

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

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message);
        }

        return data;
      } catch (error: any) {
        console.log(error);
        throw error;
      }
    },
    async updateProfile(
      token: string,
      currentPassword: string,
      fieldsToUpdate: Record<string, any>
    ) {
      const response = await fetch("http://localhost:8080/api/v1/profiles", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, fieldsToUpdate }),
      });

      const data = await response.json();
      return { status: response.status, data };
    },
    async setCustomer(customer: any) {
      this.customer = customer;
    },
    async setProfile(profile: any) {
      this.customer.profile = profile;
    },
    async initialize() {
      // if (this.initialized) {
      //   return;
      // }

      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        const customer = await this.getCustomer(savedToken);
        this.setCustomer(customer);
      }
      this.initialized = true;
    },
  },
});
