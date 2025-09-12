<script setup>
// Assuming your Sidebar2 component is in src/components/
import Sidebar2 from '@/components/SideBar2.vue'; 
</script>

<template>
  <div class="layout">
    <Sidebar2 />
    <main class="ml-80 p-8">
      <router-view />
    </main>
  </div>
</template>




<style scoped>
.layout {
  background-color: #e5e5e5;
  min-height: 100vh;
}
</style>