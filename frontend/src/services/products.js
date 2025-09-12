import { apiRequest } from '../config/api.js';

// Buscar todos os produtos
export async function getProducts() {
  try {
    return await apiRequest('/products');
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    throw error;
  }
}

// Criar novo produto
export async function createProduct(productData) {
  try {
    return await apiRequest('/products/create', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    throw error;
  }
}

// Atualizar produto
export async function updateProduct(id, productData) {
  try {
    return await apiRequest(`/products/update/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(productData),
    });
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    throw error;
  }
}

// Deletar produto
export async function deleteProduct(id) {
  try {
    return await apiRequest(`/products/delete/${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    throw error;
  }
}

// Atualizar quantidade do produto
export async function updateProductQuantity(id, quantity) {
  try {
    return await apiRequest(`/products/update-quantity/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity }),
    });
  } catch (error) {
    console.error('Erro ao atualizar quantidade:', error);
    throw error;
  }
}
