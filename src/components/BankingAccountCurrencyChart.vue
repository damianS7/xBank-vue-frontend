<script setup lang="ts">
import { useAccountStore } from "@/stores/account";
import { computed, defineProps, onMounted, ref } from "vue";
import { useTransactionStore } from "@/stores/transaction";
import { BankingTransaction } from "@/types/BankingTransaction";
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  CategoryScale,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  TimeScale
);
const props = defineProps({
  currency: {
    type: String,
    required: true,
  },
});

const accountStore = useAccountStore();
const transactionStore = useTransactionStore();

const accounts = computed(() => accountStore.getBankingAccounts);
const transactions = ref<BankingTransaction[]>([]);

onMounted(async () => {
  transactions.value = await fetchAllTransactions();
  transactions.value = [...transactions.value].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
});

const data = computed(() => {
  return {
    labels: transactions.value.map((t) => {
      const date = new Date(t.createdAt);
      const day = date.getDate();
      const month = date.getMonth() + 1; // 👈 sumale 1, porque enero es 0
      const year = date.getFullYear().toString().slice(-2);
      return `${day}/${month}/${year}`;
    }),
    datasets: [
      {
        // label: "Balance",
        data: transactions.value.map((t) => t.accountBalance),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        tension: 1,
        fill: true,
      },
    ],
  };
});

const chartOptions = {
  type: "line",
  responsive: true,
  plugins: {
    legend: {
      position: "top",
      display: false,
    },
    title: {
      display: false,
    },
  },
  scales: {
    x: {
      type: "category", // aquí no es 'time', es category
      title: {
        display: false,
        text: "Fecha",
      },
    },
    y: {
      title: {
        display: false,
        text: "Balance",
      },
      beginAtZero: true,
    },
  },
};

async function fetchAllTransactions() {
  const result: BankingTransaction[] = [];
  const accountsByCurrency = accounts.value.filter((account) => {
    if (account.accountCurrency === props.currency) return account;
  });

  for (const account of accountsByCurrency) {
    await transactionStore
      .fetchAccountTransactions(account.id, 0, 100)
      .then((paginatedTransactions: any) => {
        // console.log(paginatedTransactions.content);
        if (paginatedTransactions.content) {
          result.push(...paginatedTransactions.content);
        }
      });
  }
  return result;
}
</script>
<template>
  <div v-if="transactions.length">
    <Line :data="data" :options="chartOptions" />
  </div>
</template>
