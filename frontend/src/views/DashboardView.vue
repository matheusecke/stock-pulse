<script setup>
import { ref, computed } from "vue";
import { isAuthenticated, logout } from "@/auth";
import Naologado from "@/components/Naologado.vue";

const loggedin = computed(() => isAuthenticated.value);

function handleLogout() {
  logout();
}

// Dados de exemplo
const produtosEmEstoque = ref(1428);
const vendasDoMes = ref(24700);
const alertasEstoque = ref(12);

const atividadeRecente = ref([
  { id: 1, acao: "Adicionado", produto: "Pão Francês", quantidade: 50, data: "07/09/2025" },
  { id: 2, acao: "Vendido", produto: "Coca-Cola 2L", quantidade: 20, data: "06/09/2025" },
  { id: 3, acao: "Baixa no estoque", produto: "Queijo Mussarela", quantidade: 5, data: "06/09/2025" },
  { id: 4, acao: "Adicionado", produto: "Leite Integral", quantidade: 100, data: "05/09/2025" },
]);
</script>

<template>
  <div class="min-h-screen p-6 text-gray-900">
    <div v-if="loggedin" class="space-y-8">
      <header>
        <h1 class="text-4xl font-bold text-blue-300">Bem-vindo ao StockPulse</h1>
        <p class="mt-2 text-gray-600">Painel de controle completo do seu estoque.</p>
      </header>

      <!-- Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-2xl border border-gray-200 flex items-center justify-between shadow hover:shadow-lg transition">
          <div class="flex items-center space-x-4">
            <div class="bg-blue-100 p-3 rounded-full">
              <span class="material-icons text-blue-600 text-2xl">inventory_2</span>
            </div>
            <div>
              <p class="text-sm text-gray-600">Produtos em Estoque</p>
              <p class="text-2xl font-bold text-gray-900">{{ produtosEmEstoque }}</p>
            </div>
          </div>
          <router-link to="/produtos" class="px-3 py-1 bg-yellow-500 text-white rounded-lg text-sm hover:bg-yellow-400 transition">Ver detalhes</router-link>
        </div>

        <div class="bg-white p-6 rounded-2xl border border-gray-200 flex items-center justify-between shadow hover:shadow-lg transition">
          <div class="flex items-center space-x-4">
            <div class="bg-green-100 p-3 rounded-full">
              <span class="material-icons text-green-600 text-2xl">trending_up</span>
            </div>
            <div>
              <p class="text-sm text-gray-600">Vendas do Mês</p>
              <p class="text-2xl font-bold text-gray-900">R$ {{ vendasDoMes.toLocaleString() }}</p>
            </div>
          </div>
          <button class="px-3 py-1 bg-yellow-500 text-white rounded-lg text-sm hover:bg-yellow-400 transition">Ver gráficos</button>
        </div>

        <div class="bg-white p-6 rounded-2xl border border-gray-200 flex items-center justify-between shadow hover:shadow-lg transition">
          <div class="flex items-center space-x-4">
            <div class="bg-yellow-100 p-3 rounded-full">
              <span class="material-icons text-yellow-600 text-2xl">warning</span>
            </div>
            <div>
              <p class="text-sm text-gray-600">Alertas de Estoque Baixo</p>
              <p class="text-2xl font-bold text-gray-900">{{ alertasEstoque }}</p>
            </div>
          </div>
          <button class="px-3 py-1 bg-yellow-500 text-white rounded-lg text-sm hover:bg-yellow-400 transition">Ver alertas</button>
        </div>
      </div>

      <!-- Gráfico -->
      <div class="bg-white rounded-2xl border border-gray-200 shadow p-6">
        <h2 class="text-xl font-bold text-gray-800 mb-4">Vendas da Semana</h2>
        <div class="w-full h-48 bg-gray-100 rounded-lg flex items-end space-x-2 p-2">
          <div v-for="n in 7" :key="n" :style="{ height: `${Math.floor(Math.random() * 100) + 20}px` }"
               class="bg-yellow-500 rounded w-6 transition-all duration-300 hover:bg-yellow-400"></div>
        </div>
      </div>

      <!-- Atividade -->
      <div>
        <h2 class="text-2xl font-bold text-blue-300 mb-4">Atividade Recente</h2>
        <div class="overflow-y-auto max-h-[300px] bg-white rounded-2xl border border-gray-200 shadow">
          <table class="min-w-full text-left border-collapse">
            <thead class="sticky top-0 bg-gray-100 text-gray-700">
              <tr>
                <th class="px-4 py-2 text-sm font-semibold">Ação</th>
                <th class="px-4 py-2 text-sm font-semibold">Produto</th>
                <th class="px-4 py-2 text-sm font-semibold">Quantidade</th>
                <th class="px-4 py-2 text-sm font-semibold">Data</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in atividadeRecente" :key="item.id" class="border-t border-gray-200 hover:bg-gray-50 transition">
                <td class="px-4 py-2 text-gray-700">{{ item.acao }}</td>
                <td class="px-4 py-2 text-gray-800">{{ item.produto }}</td>
                <td class="px-4 py-2 text-gray-700">{{ item.quantidade }}</td>
                <td class="px-4 py-2 text-gray-600">{{ item.data }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-else>
      <Naologado></Naologado>
    </div>
  </div>
</template>
