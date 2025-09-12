<script setup>
import { ref, computed, onMounted } from "vue";
import { isAuthenticated } from "@/auth";
import Naologado from "@/components/Naologado.vue";
import ProductFormModal from "@/components/ProductFormModal.vue";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal.vue";
import ToastNotification from "@/components/ToastNotification.vue";
import { Edit, Trash2, PlusCircle } from 'lucide-vue-next';
import { getProducts, createProduct, updateProduct, deleteProduct, updateProductQuantity } from "@/services/products.js";

// --- ESTADO ---
const loggedin = computed(() => isAuthenticated.value);
const search = ref("");
const sortBy = ref("name");
const produtos = ref([]);
const isLoading = ref(false);

const isAddEditModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const currentProduct = ref(null);
const toast = ref({ show: false, message: '', type: 'success' });

// --- LÓGICA ---
const filteredAndSortedProducts = computed(() => {
  let result = produtos.value.filter((p) =>
    p.name.toLowerCase().includes(search.value.toLowerCase())
  );
  const sortedResult = [...result];
  if (sortBy.value === "name") {
    sortedResult.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy.value === "price") {
    sortedResult.sort((a, b) => b.price - a.price);
  } else if (sortBy.value === "quantity") {
    sortedResult.sort((a, b) => a.quantity - b.quantity);
  }
  return sortedResult;
});

// Carregar produtos da API
async function loadProducts() {
  if (!loggedin.value) return;
  
  isLoading.value = true;
  try {
    const response = await getProducts();
    produtos.value = response;
  } catch (error) {
    showToast('Erro ao carregar produtos', 'error');
    console.error('Erro ao carregar produtos:', error);
  } finally {
    isLoading.value = false;
  }
}

// Inicializar dados
onMounted(() => {
  loadProducts();
});

function showToast(message, type = 'success') {
  toast.value = { show: true, message, type };
  setTimeout(() => {
    toast.value.show = false;
  }, 3000);
}

function getStockClass(stock) {
  if (stock === 0) return 'bg-red-200 text-red-800';
  if (stock <= 20) return 'bg-yellow-200 text-yellow-800';
  return 'bg-green-200 text-green-800';
}

// --- FUNÇÕES CRUD ---
function closeModals() {
  isAddEditModalOpen.value = false;
  isDeleteModalOpen.value = false;
  currentProduct.value = null;
}

function openAddModal() {
  currentProduct.value = { name: '', description: '', price: 0, quantity: 0 };
  isAddEditModalOpen.value = true;
}

function openEditModal(produto) {
  currentProduct.value = { ...produto };
  isAddEditModalOpen.value = true;
}

function openDeleteModal(produto) {
  currentProduct.value = produto;
  isDeleteModalOpen.value = true;
}

async function saveProduct(productData) {
  try {
    if (productData.id) {
      // Atualizar produto existente
      await updateProduct(productData.id, {
        name: productData.name,
        description: productData.description,
        price: parseFloat(productData.price),
        quantity: parseInt(productData.quantity)
      });
      showToast('Produto atualizado com sucesso!');
    } else {
      // Criar novo produto
      await createProduct({
        name: productData.name,
        description: productData.description,
        price: parseFloat(productData.price),
        quantity: parseInt(productData.quantity)
      });
      showToast('Produto criado com sucesso!');
    }
    
    // Recarregar lista de produtos
    await loadProducts();
    closeModals();
  } catch (error) {
    showToast('Erro ao salvar produto', 'error');
    console.error('Erro ao salvar produto:', error);
  }
}

async function confirmDelete() {
  try {
    await deleteProduct(currentProduct.value.id);
    showToast('Produto excluído com sucesso!');
    
    // Recarregar lista de produtos
    await loadProducts();
    closeModals();
  } catch (error) {
    showToast('Erro ao excluir produto', 'error');
    console.error('Erro ao excluir produto:', error);
  }
}

async function updateQuantity(productId, newQuantity) {
  try {
    await updateProductQuantity(productId, parseInt(newQuantity));
    showToast('Quantidade atualizada com sucesso!');
    
    // Recarregar lista de produtos
    await loadProducts();
  } catch (error) {
    showToast('Erro ao atualizar quantidade', 'error');
    console.error('Erro ao atualizar quantidade:', error);
  }
}
</script>

<template>
  <div>
    <div v-if="loggedin" class="p-6">
      <div class="flex items-center justify-between mt-20 mb-6">
  <!-- Barra de pesquisa à esquerda -->
  <input
    v-model="search"
    type="text"
    placeholder="Pesquisar produto..."
    class="w-full text-white bg-gradient-to-br from-gray-900 via-gray-800 to-black max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fb8500] focus:outline-none"
  />

  <!-- Botão + Select alinhados à direita -->
  <div class="flex items-center gap-4 ml-4">
    <button
      @click="openAddModal"
      class="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#fb8500] text-white font-semibold hover:bg-[#e67600] transition-colors duration-200 shadow-md shadow-[#fb8500]/30"
    >
      <PlusCircle class="w-5 h-5" />
      Novo Produto
    </button>

    <select
      v-model="sortBy"
      class="px-4 py-2 border text-gray-200 bg-gradient-to-br from-gray-900 via-gray-800 to-black border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fb8500] focus:outline-none"
    >
      <option value="name">Ordenar por Nome</option>
      <option value="price">Ordenar por Preço</option>
      <option value="quantity">Ordenar por Estoque</option>
    </select>
  </div>
</div>


      <!-- TABELA SCROLLAVEL -->
      <div class="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div class="max-h-[680px] overflow-y-auto">
          <table class="w-full text-left border-collapse">
            <thead class="sticky bg-gradient-to-br from-gray-900 via-gray-800 to-black top-0 bg-gray-100 z-10">
              <tr>
                <th class="px-6 py-3 text-sm font-semibold text-gray-200">Nome</th>
                <th class="px-6 py-3 text-sm font-semibold text-gray-200">Descrição</th>
                <th class="px-6 py-3 text-sm font-semibold text-gray-200">Preço</th>
                <th class="px-6 py-3 text-sm font-semibold text-gray-200">Estoque</th>
                <th class="px-6 py-3 text-sm font-semibold text-gray-200 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="filteredAndSortedProducts.length > 0">
                <tr
                  v-for="produto in filteredAndSortedProducts"
                  :key="produto.id"
                  class="border-t border-gray-200 hover:bg-gray-50 transition"
                >
                  <td class="px-6 py-4 text-gray-800">{{ produto.name }}</td>
                  <td class="px-6 py-4 text-gray-600">{{ produto.description }}</td>
                  <td class="px-6 py-4 text-gray-800">R$ {{ produto.price?.toFixed(2) || '0.00' }}</td>
                  <td class="px-6 py-4">
                    <span
                      class="px-2 py-1 text-xs font-semibold rounded-full"
                      :class="getStockClass(produto.quantity)"
                    >
                      {{ produto.quantity }}
                    </span>
                  </td>
                  <td class="px-6 py-4 flex justify-end space-x-2">
                    <button
                      @click="openEditModal(produto)"
                      class="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition"
                    >
                      <Edit class="w-4 h-4" />
                    </button>
                    <button
                      @click="openDeleteModal(produto)"
                      class="p-2 text-red-600 hover:bg-red-100 rounded-full transition"
                    >
                      <Trash2 class="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              </template>
              <tr v-else-if="!isLoading">
                <td colspan="5" class="text-center py-10 text-gray-500">
                  Nenhum produto encontrado.
                </td>
              </tr>
              <tr v-if="isLoading">
                <td colspan="5" class="text-center py-10 text-gray-500">
                  <div class="flex items-center justify-center gap-2">
                    <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-[#fb8500]"></div>
                    Carregando produtos...
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-else>
      <Naologado />
    </div>

    <ProductFormModal
      :is-open="isAddEditModalOpen"
      :product="currentProduct"
      @close="closeModals"
      @save="saveProduct"
    />
    <DeleteConfirmationModal
      :is-open="isDeleteModalOpen"
      :product="currentProduct"
      @close="closeModals"
      @confirm="confirmDelete"
    />
    <transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="transform opacity-0 translate-y-2"
      leave-active-class="transition ease-in duration-200"
      leave-to-class="transform opacity-0 translate-y-2"
    >
      <ToastNotification
        v-if="toast.show"
        :message="toast.message"
        :type="toast.type"
      />
    </transition>
  </div>
</template>

<style>
select option {
  background-color: #f3f4f6;
  color: #111827;
}
</style>
