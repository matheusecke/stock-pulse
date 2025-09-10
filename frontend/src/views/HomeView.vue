<template>
  <div class="p-6 space-y-10">
    <!-- Hero / Banner -->
    <section class="text-center bg-gradient-to-r from-[#fb8500] to-[#ffb703] text-white rounded-xl p-10 shadow-lg">
      <h1 class="text-4xl md:text-5xl font-bold mb-4">StockPulse</h1>
      <p class="text-lg md:text-xl mb-6">
        Bem-vindo ao nosso projeto de Computação em Nuvem! Um site para gerenciamento de estoque.
      </p>
      
    </section>

    <!-- Sobre o projeto -->
    <section class="grid md:grid-cols-2 gap-8 items-center">
      <div>
        <h2 class="text-3xl font-bold mb-4">Sobre o Projeto</h2>
        <p class="text-gray-700 font-semibold dark:text-blue-200">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet facilisis urna. 
          Praesent ultrices metus nec magna finibus, eget consectetur libero tincidunt. 
          Vivamus euismod nisl sed nulla ultrices, a fermentum massa blandit.
        </p>
      </div>
      
      
    </section>

    <!-- Tecnologias usadas -->
    <section>
    <h2 class="text-3xl font-bold mb-6 text-center text-gray-800 ">Tecnologias Utilizadas</h2>
    <div class="grid md:grid-cols-3 gap-6">

        <div class="bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6 rounded-xl shadow-2xl shadow-black/60 hover:shadow-2xl hover:shadow-black/90 transition-all duration-300 flex items-center gap-6">
            <div class="flex-shrink-0">
                <svg class="w-12 h-12" viewBox="0 0 256 221" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M204.8 0H256L128 220.8L0 0H51.2L128 132.48L204.8 0Z" fill="#41B883"/>
                    <path d="M0 0L128 220.8L256 0H204.8L128 132.48L51.2 0H0Z" fill="#41B883"/>
                    <path d="M51.2 0L128 133.12L204.8 0H153.6L128 44.16L102.4 0H51.2Z" fill="#35495E"/>
                </svg>
            </div>
            <div class="text-left">
                <h3 class="text-xl font-semibold mb-2 text-white">Vue.js</h3>
                <p class="text-gray-300">
                    Framework JavaScript usado para criar a interface de usuário com o tailwind.
                </p>
            </div>
        </div>

       <div class="bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6 rounded-xl shadow-2xl shadow-black/60 hover:shadow-2xl hover:shadow-black/90 transition-all duration-300 flex items-center gap-6">
            <div class="flex-shrink-0">
            <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Tailwind_CSS_Logo.svg/2560px-Tailwind_CSS_Logo.svg.png" 
                alt="Logo do tailwind" 
                class="w-12 h-12 object-contain"
            >
        </div>
        <div class="text-left">
            <h3 class="text-xl font-semibold mb-2 text-white">Tailwind CSS</h3>
            <p class="text-gray-300">
                Framework CSS para estilização rápida e customizável.
            </p>
        </div>
    </div>
        
        <div class="bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6 rounded-xl shadow-2xl shadow-black/60 hover:shadow-2xl hover:shadow-black/90 transition-all duration-300 flex items-center gap-6">
            <div class="flex-shrink-0">
            <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Vmware_workstation_16_icon.svg/2051px-Vmware_workstation_16_icon.svg.png" 
                alt="Logo da VMware" 
                class="w-12 h-12 object-contain"
            >
        </div>
        <div class="text-left">
            <h3 class="text-xl font-semibold mb-2 text-white">VMware</h3>
            <p class="text-gray-300">
                Software para virtualização, usado para criar as máquinas virtuais.
            </p>
        </div>
    </div>

           <div class="bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6 rounded-xl shadow-2xl shadow-black/60 hover:shadow-2xl hover:shadow-black/90 transition-all duration-300 flex items-center gap-6">
            <div class="flex-shrink-0">
            <img 
                src="https://nestjs.com/img/logo-small.svg" 
                alt="Logo Nestjs" 
                class="w-12 h-12 object-contain"
            >
        </div>
        <div class="text-left">
            <h3 class="text-xl font-semibold mb-2 text-white">NestJs</h3>
            <p class="text-gray-300">
                Framework Node.js para construir aplicações de backend.
            </p>
        </div>
    </div>

               <div class="bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6 rounded-xl shadow-2xl shadow-black/60 hover:shadow-2xl hover:shadow-black/90 transition-all duration-300 flex items-center gap-6">
            <div class="flex-shrink-0">
            <img 
                src="https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/97_Docker_logo_logos-512.png" 
                alt="Logo Nestjs" 
                class="w-12 h-12 object-contain"
            >
        </div>
        <div class="text-left">
            <h3 class="text-xl font-semibold mb-2 text-white">Docker</h3>
            <p class="text-gray-300">
                Usado para criação dos containers.
            </p>
        </div>
    </div>
        
    </div>
</section>

    <!-- Call to action -->
    <section class="text-center mt-10">
      <p class="text-gray-700 font-semibold mb-4">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Comece a explorar o sistema agora!
      </p>
      
    </section>
  </div>
</template>

<script setup>
</script>
