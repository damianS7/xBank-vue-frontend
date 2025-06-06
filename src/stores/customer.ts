import { defineStore } from "pinia";
import type { Customer } from "@/types/Customer";
import { Profile } from "@/types/Profile";

export const useCustomerStore = defineStore("customer", {
  state: () => ({
    customer: {} as Customer,
    initialized: false,
  }),

  getters: {
    getLoggedCustomer: (state) => {
      return state.customer;
    },
    getFullName: (state) => {
      return (
        state.customer.profile.firstName + " " + state.customer.profile.lastName
      );
    },
  },

  actions: {
    async getCustomer(): Promise<Customer> {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.VUE_APP_API_URL}/customers/me`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // if response is not 200, throw an error
        if (response.status !== 200) {
          const jsonResponse = await response.json();
          throw new Error("Failed to fetch customer. " + jsonResponse.message);
        }

        return (await response.json()) as Customer;
      } catch (error: unknown) {
        // handle errors
        throw new Error("Failed to fetch customer.");
      }
    },
    async patchProfile(
      currentPassword: string,
      fieldsToUpdate: Record<string, any>
    ): Promise<Profile> {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.VUE_APP_API_URL}/customers/me/profile`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ currentPassword, fieldsToUpdate }),
          }
        );

        // if response is not 200, throw an error
        if (response.status !== 200) {
          const jsonResponse = await response.json();
          throw new Error("Failed to updated profile. " + jsonResponse.message);
        }

        return (await response.json()) as Profile;
      } catch (error: unknown) {
        // handle errors
        throw new Error("Failed to update profile.");
      }
    },
    async patchEmail(
      currentPassword: string,
      newEmail: string
    ): Promise<Customer> {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.VUE_APP_API_URL}/customers/me/email`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ currentPassword, newEmail }),
          }
        );

        // if response is not 200, throw an error
        if (response.status !== 200) {
          const jsonResponse = await response.json();
          throw new Error("Failed to update email. " + jsonResponse.message);
        }

        return (await response.json()) as Customer;
      } catch (error: unknown) {
        // handle errors
        throw new Error("Failed to update email.");
      }
    },
    async changePassword(currentPassword: string, newPassword: string) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.VUE_APP_API_URL}/auth/customers/password`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ currentPassword, newPassword }),
          }
        );

        // if response is not 200, throw an error
        if (response.status !== 200) {
          const jsonResponse = await response.json();
          throw new Error("Failed to change password. " + jsonResponse.message);
        }
      } catch (error: unknown) {
        // handle errors
        throw new Error("Failed to change password.");
      }
    },
    async getPhoto(filename: string): Promise<Blob> {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          `${process.env.VUE_APP_API_URL}/customers/me/profile/photo/${filename}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // if response is not 200, throw an error
        if (response.status !== 200) {
          const json = await response.json();
          throw new Error(json?.message || "Failed to get photo.");
        }

        return (await response.blob()) as Blob;
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw new Error(error.message);
        } else {
          throw new Error("Failed to get photo. Unknown error.");
        }
      }
    },
    async uploadPhoto(currentPassword: string, file: any): Promise<Blob> {
      try {
        const token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append("file", file);
        formData.append("currentPassword", currentPassword); // otro campo necesario

        const response = await fetch(
          `${process.env.VUE_APP_API_URL}/customers/me/profile/photo`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        // if response is not 201, throw an error
        if (response.status !== 201) {
          const jsonResponse = await response.json();
          throw new Error("Failed to upload photo. " + jsonResponse.message);
        }

        return (await response.blob()) as Blob;
      } catch (error: unknown) {
        // handle errors
        throw new Error("Failed to upload photo");
      }
    },
    async setCustomer(customer: any) {
      this.customer = customer;
    },
    async setEmail(email: string) {
      this.customer.email = email;
    },
    async setProfile(profile: any) {
      this.customer.profile = profile;
    },
    async setPhoto(image: any) {
      this.customer.profile.photoPath = ".";
    },
    async initialize() {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      await this.getCustomer()
        .then((customer) => {
          this.setCustomer(customer);
        })
        .catch((error) => {
          console.log(error);
        });

      if (!this.customer?.profile?.photoPath) {
        return;
      }

      await this.getPhoto(this.customer.profile.photoPath)
        .then((filename) => {
          localStorage.setItem(
            "profilePhotoURL",
            URL.createObjectURL(filename)
          );
        })
        .catch((error) => {
          console.log(error);
        });

      this.initialized = true;
    },
  },
});
