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
      const res = await fetch("http://localhost:8080/api/v1/customers/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      return data;
    },
    async patchProfile(
      token: string,
      currentPassword: string,
      fieldsToUpdate: Record<string, any>
    ) {
      const response = await fetch("http://localhost:8080/api/v1/profiles/me", {
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
    async changePassword(
      token: string,
      currentPassword: string,
      newPassword: string
    ) {
      const response = await fetch(
        "http://localhost:8080/api/v1/auth/customers/password",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ currentPassword, newPassword }),
        }
      );

      const data = await response.json();
      return { status: response.status, data };
    },
    async getPhoto(token: string, photo: string) {
      try {
        const res = await fetch(
          "http://localhost:8080/api/v1/profiles/me/photo/" + photo,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.blob();

        return data;
      } catch (error: any) {
        console.log(error);
        throw error;
      }
    },
    async changeAvatar(token: string, currentPassword: string, file: any) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("currentPassword", currentPassword); // otro campo necesario

      const response = await fetch(
        "http://localhost:8080/api/v1/profiles/me/photo",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

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
      console.log("initialized customer.");
    },
  },
});
