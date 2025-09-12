import { apiRequest } from '../config/api.js';

// Testar conectividade básica com a API
export async function testConnection() {
  try {
    const response = await apiRequest('/health');
    console.log('✅ Conexão com API funcionando:', response);
    return { success: true, data: response };
  } catch (error) {
    console.error('❌ Erro de conexão com API:', error);
    return { success: false, error: error.message };
  }
}

// Ping simples
export async function ping() {
  try {
    const response = await apiRequest('/ping');
    console.log('🏓 Ping successful:', response);
    return { success: true, data: response };
  } catch (error) {
    console.error('❌ Ping failed:', error);
    return { success: false, error: error.message };
  }
}

// Função para testar no console do navegador
window.testAPI = async () => {
  console.log('🔍 Testando conectividade com a API...');
  
  const healthResult = await testConnection();
  const pingResult = await ping();
  
  console.log('📊 Resultados:');
  console.log('Health Check:', healthResult);
  console.log('Ping:', pingResult);
  
  if (healthResult.success && pingResult.success) {
    console.log('🎉 API está funcionando perfeitamente!');
  } else {
    console.log('⚠️ Há problemas de conectividade com a API');
  }
  
  return { health: healthResult, ping: pingResult };
};
