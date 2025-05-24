<script setup lang="ts">
import { defineProps } from "vue";
import { BankingCard } from "@/types/BankingCard";
import { useCustomerStore } from "@/stores/customer";
const customerStore = useCustomerStore();

const props = defineProps<{
  card: BankingCard;
}>();

function formatNumber(number: string): string {
  return number.replace(/(.{4})/g, "$1 ").trim();
}
</script>
<template>
  <svg
    viewBox="0 0 400 250"
    class="rounded-xl shadow-lg"
    xmlns="http://www.w3.org/2000/svg"
    version="1.1"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    xmlns:svgjs="http://svgjs.dev/svgjs"
    width="400"
  >
    <defs>
      <linearGradient id="gradient-fill" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#aa00ff" />
        <stop offset="25%" stop-color="#9600ff" />
        <stop offset="50%" stop-color="#6f00ff" />
        <stop offset="75%" stop-color="#5512fb" />
        <stop offset="100%" stop-color="#3c00ff" />
      </linearGradient>
    </defs>
    <rect width="400" height="250" fill="url(#gradient-fill)"></rect>

    <!-- Chip -->
    <rect x="30" y="60" width="50" height="35" rx="5" fill="#facc15" />
    <line x1="40" y1="60" x2="40" y2="95" stroke="#eab308" stroke-width="2" />
    <line x1="50" y1="60" x2="50" y2="95" stroke="#eab308" stroke-width="2" />

    <!-- NFC -->
    <g
      transform="translate(345, 100)"
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <!-- Onda 1 -->
      <path
        d="M9 11C10.5 12.5 11.5 14.5 11.5 16.5C11.5 18.5 10.5 20.5 9 22"
        stroke="#FFFFFF"
        stroke-width="2"
        stroke-linecap="round"
      />
      <!-- Onda 2 -->
      <path
        d="M12.5 8.5C14.8 10.4 16.2 13.2 16.2 16.5C16.2 19.8 14.8 22.6 12.5 24.5"
        stroke="#FFFFFF"
        stroke-width="2"
        stroke-linecap="round"
      />
      <!-- Onda 3 -->
      <path
        d="M16 6C19 8.5 20.7 12 20.7 16.5C20.7 21 19 24.5 16 27"
        stroke="#FFFFFF"
        stroke-width="2"
        stroke-linecap="round"
      />
      <!-- Onda 4 -->
      <path
        d="M19.5 3.5C22.8 6.4 24.5 11 24.5 16.5C24.5 22 22.8 26.6 19.5 29.5"
        stroke="#FFFFFF"
        stroke-width="2"
        stroke-linecap="round"
      />
      <!-- Onda 5 -->
      <path
        d="M23 1C27 4.6 28.5 10 28.5 16.5C28.5 23 27 28.4 23 32"
        stroke="#FFFFFF"
        stroke-width="2"
        stroke-linecap="round"
      />
    </g>

    <!-- Nombre del banco -->
    <text x="30" y="40" fill="white" font-size="26" font-weight="bold">
      xBank
    </text>

    <!-- Marca ficticia (tipo VISA/MC) -->
    <circle cx="340" cy="210" r="20" fill="#ff5e00" />
    <circle cx="360" cy="210" r="20" fill="#fbbf24" fill-opacity="0.9" />

    <g transform="translate(30, 160)">
      <text fill="white" font-size="20" letter-spacing="3">
        {{ formatNumber(card?.cardNumber) }}
      </text>
      <text y="20" class="uppercase" fill="white" font-size="14">
        {{ customerStore?.getFullName }}
      </text>
    </g>

    <g transform="translate(220, 205)" fill="gray">
      <text font-size="12" y="0">Expired date</text>
      <text font-size="14" y="20">
        {{
          card?.expiredDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
          })
        }}
      </text>
    </g>
  </svg>
</template>
