# StockPulse

Sistema de gerenciamento de estoque desenvolvido como projeto de Computação em Nuvem. Aplicação web completa para controle de produtos e estoque.

## 🚀 Como Executar

### Pré-requisitos

- Vagrant instalado
- VMware Workstation/Player instalado

### Passos para Iniciar

1. **Subir todas as VMs (recomendado):**

```bash
vagrant up
```

2. **Ou subir uma por vez (ordem recomendada):**

```bash
vagrant up db-vm        # Database primeiro
vagrant up backend-vm   # Backend segundo
vagrant up frontend-vm  # Frontend por último
```

3. **Acessar a aplicação:**

- Abra o navegador em: `http://localhost:8080`

### Comandos Úteis

```bash
# Ver status das VMs
vagrant status

# Acessar uma VM
vagrant ssh frontend-vm
vagrant ssh backend-vm
vagrant ssh db-vm

# Reiniciar uma VM
vagrant reload frontend-vm

# Parar todas as VMs
vagrant halt

# Destruir todas as VMs
vagrant destroy
```

## 🌐 Acesso via Rede Local

Para acessar de outros dispositivos na mesma rede (ex: celular):

1. **Descobrir o IP da sua máquina:**

```bash
# Windows
ipconfig | findstr "IPv4"

# Linux/Mac
ifconfig | grep "inet "
```

2. **Acessar no navegador:**

```
http://SEU_IP:8080
```

Exemplo: Se seu IP for `192.168.1.100`, acesse `http://192.168.1.100:8080`

## 📝 Funcionalidades

- Gerenciamento de produtos
- Controle de estoque
- Dashboard com estatísticas
- Sistema de autenticação
