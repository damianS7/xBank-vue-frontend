import { Customer } from "@/types/Customer";
import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: "",
    initialized: false,
  }),

  getters: {
    isAuthenticated: (state) => {
      if (state.token === "") {
        return false;
      }

      return true;
    },
  },

  actions: {
    async login(email: string, password: string) {
      try {
        const res = await fetch("http://localhost:8080/api/v1/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
          throw new Error("Credenciales incorrectas");
        }

        const data = await res.json();
        // this.email = data.customer.email;
        this.token = data.token;
        // se recomienda guardar el token en localStorage tambien en caso de que se pulse f5
        localStorage.setItem("token", this.token);

        // Opcional: obtener el usuario
        // this.user = await this.fetchUser();
      } catch (error) {
        console.error("Error en login:", error);
        throw error;
      }
    },
    async register(fields: Customer) {
      const response = await fetch(
        "http://localhost:8080/api/v1/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(fields),
        }
      );

      const data = await response.json();
      return { status: response.status, data };
    },
    async isTokenValid(token: string) {
      const response = await fetch(
        "http://localhost:8080/api/v1/auth/token/validate",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status == 200) {
        return true;
      }
      return false;
    },
    async logout() {
      this.token = "";
      this.initialized = false;
      localStorage.clear();
    },
    async initialize() {
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        this.token = savedToken;
        if (!(await this.isTokenValid(savedToken))) {
          this.logout();
          return;
        }
      }
      this.initialized = true;
    },
  },
});
