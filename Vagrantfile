Vagrant.configure("2") do |config|
  
  # VM do Database - deve subir primeiro
  config.vm.define "db-vm" do |database|
    database.vm.box = "bento/ubuntu-22.04"
    database.vm.hostname = "db-vm"
    
    # Rede interna única para comunicação com backend
    database.vm.network "private_network", ip: "192.168.90.30", netmask: "255.255.255.0", vmware__netname: "vmnet3"
    
    database.vm.provider "vmware_desktop" do |v|
      v.gui = true
      v.memory = "2048"
      v.cpus = 2
      v.vmx["displayName"] = "StockPulse-Database"
    end
    
    # Sincronizar pasta do db
    database.vm.synced_folder "./db", "/home/vagrant/db", type: "rsync"
    
    # Provisioning do Database
    database.vm.provision "shell", inline: <<-SHELL
      apt-get update
      apt-get install -y curl
      
      # Instalar Docker
      curl -fsSL https://get.docker.com -o get-docker.sh
      sh get-docker.sh
      usermod -aG docker vagrant
      
      # Instalar Docker Compose
      curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
      chmod +x /usr/local/bin/docker-compose
      
      # Aguardar Docker inicializar
      sleep 10
      
      # Executar Docker Compose
      cd /home/vagrant/db
      
      # Aguardar até que o Docker esteja realmente pronto
      while ! docker info >/dev/null 2>&1; do
        echo "Aguardando Docker inicializar..."
        sleep 5
      done
      
      # Verificar se é primeira execução
      if [ ! -f /home/vagrant/.db_initialized ]; then
        echo "Primeira inicialização - limpando volumes antigos..."
        docker-compose down -v 2>/dev/null || true
        docker volume prune -f 2>/dev/null || true
        touch /home/vagrant/.db_initialized
      else
        echo "Database já foi inicializado anteriormente"
      fi
      
      # Subir o MySQL
      docker-compose up -d
      
      # Aguardar MySQL estar realmente pronto usando healthcheck
      echo "Aguardando MySQL inicializar..."
      timeout=300
      while [ $timeout -gt 0 ]; do
        if docker-compose ps | grep -q "healthy"; then
          echo "MySQL está saudável!"
          break
        fi
        if docker-compose ps | grep -q "unhealthy"; then
          echo "MySQL com problemas, reiniciando..."
          docker-compose restart db
        fi
        sleep 5
        timeout=$((timeout-5))
        echo "Aguardando MySQL ficar saudável... ($timeout segundos restantes)"
      done
      
      if [ $timeout -le 0 ]; then
        echo "ERRO: MySQL não ficou saudável a tempo"
        docker-compose logs db
        exit 1
      fi
      
      echo "=== Database VM configurada com sucesso! ==="
      echo "MySQL rodando na porta 3306"
      echo "IP: 192.168.200.30 (rede interna isolada)"
    SHELL
  end

  # VM do Backend - rede interna apenas (depende do database)
  config.vm.define "backend-vm" do |backend|
    backend.vm.box = "bento/ubuntu-22.04"
    backend.vm.hostname = "backend-vm"
    
    # Rede interna única para comunicação com frontend e database
    backend.vm.network "private_network", ip: "192.168.90.20", netmask: "255.255.255.0", vmware__netname: "vmnet3"
    
    backend.vm.provider "vmware_desktop" do |v|
      v.gui = true
      v.memory = "2048"
      v.cpus = 2
      v.vmx["displayName"] = "StockPulse-Backend"
    end
    
    # Sincronizar pasta do backend
    backend.vm.synced_folder "./backend", "/home/vagrant/backend", type: "rsync"
    
    # Provisioning do Backend
    backend.vm.provision "shell", inline: <<-SHELL
      apt-get update
      apt-get install -y curl netcat-openbsd mysql-client
      
      # Instalar Node.js 20
      curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
      apt-get install -y nodejs
      
      # Instalar Nest CLI e Prisma globalmente
      npm install -g @nestjs/cli prisma
      
      # Instalar dependências
      cd /home/vagrant/backend
      npm install
      
      # O arquivo .env já existe
      
      # hosts internos para database
      grep -q "192.168.90.30 database" /etc/hosts || echo "192.168.90.30 database" >> /etc/hosts
      
      # Aguardar database estar disponível com timeout
      echo "Aguardando database ficar disponível..."
      timeout=300
      while [ $timeout -gt 0 ]; do
        if nc -z 192.168.90.30 3306; then
          echo "Porta 3306 acessível!"
          # Testar conexão real com MySQL
          if mysql -h 192.168.90.30 -u stockpulse -pstockpulse123 -e "SELECT 1;" 2>/dev/null; then
            echo "Database conectado com sucesso!"
            break
          else
            echo "Porta acessível mas MySQL ainda não pronto..."
          fi
        fi
        sleep 5
        timeout=$((timeout-5))
        echo "Tentando conectar ao database... ($timeout segundos restantes)"
      done
      
      if [ $timeout -le 0 ]; then
        echo "ERRO: Timeout ao conectar com database"
        echo "Verificando status do database..."
        nc -z 192.168.90.30 3306 && echo "Porta 3306 OK" || echo "Porta 3306 FALHOU"
        exit 1
      fi
      
      # Executar migrações do Prisma
      npm install prisma @prisma/client --save-dev
      npx prisma generate
      npx prisma db push
      
      # Fazer build do projeto
      npm run build
      
      # Criar diretório de logs
      mkdir -p /home/vagrant/logs
      chown vagrant:vagrant /home/vagrant/logs
      
      # Iniciar aplicação em desenvolvimento
      nohup npm run start:dev > /home/vagrant/logs/backend.log 2>&1 &
      
      # Aguardar aplicação inicializar
      sleep 10
      
      echo "=== Backend VM configurada com sucesso! ==="
      echo "NestJS rodando na porta 8000"
      echo "IP: 192.168.90.20 (rede interna)"
    SHELL
  end
  
  # VM do Frontend - com acesso NAT externo
  config.vm.define "frontend-vm" do |frontend|
    frontend.vm.box = "bento/ubuntu-22.04"
    frontend.vm.hostname = "frontend-vm"
    
    # Port forwarding para acesso externo (qualquer IP da rede)
    frontend.vm.network "forwarded_port", guest: 5173, host: 8080, host_ip: "0.0.0.0"
    frontend.vm.network "forwarded_port", guest: 5173, host: 3000, host_ip: "0.0.0.0"
    frontend.vm.network "forwarded_port", guest: 5173, host: 5173, host_ip: "0.0.0.0"
    
    # Rede interna única para comunicação com backend
    frontend.vm.network "private_network", ip: "192.168.90.10", netmask: "255.255.255.0", vmware__netname: "vmnet3"
    
    frontend.vm.provider "vmware_desktop" do |v|
      v.gui = true
      v.memory = "2048"
      v.cpus = 2
      v.vmx["displayName"] = "StockPulse-Frontend"
    end
    
    # Sincronizar pasta do frontend
    frontend.vm.synced_folder "./frontend", "/home/vagrant/frontend", type: "rsync"
    
    # Provisioning do Frontend
    frontend.vm.provision "shell", inline: <<-SHELL
      apt-get update
      apt-get install -y curl netcat-openbsd
      
      # Instalar Node.js 20
      curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
      apt-get install -y nodejs
      
      # Instalar Vue CLI e Vite globalmente
      npm install -g @vue/cli vite
      
      # Instalar dependências do frontend
      cd /home/vagrant/frontend
      npm install
      
      # hosts internos para backend
      grep -q "192.168.90.20 backend" /etc/hosts || echo "192.168.90.20 backend" >> /etc/hosts
      
      # Criar diretório de logs
      mkdir -p /home/vagrant/logs
      chown vagrant:vagrant /home/vagrant/logs
      
      # Aguardar backend estar disponível
      echo "Aguardando backend ficar disponível..."
      timeout=180
      while ! nc -z 192.168.90.20 8000 && [ $timeout -gt 0 ]; do
        sleep 5
        timeout=$((timeout-5))
        echo "Tentando conectar ao backend... ($timeout segundos restantes)"
      done
      
      # Iniciar aplicação em desenvolvimento
      nohup npm run dev -- --host 0.0.0.0 --port 5173 > /home/vagrant/logs/frontend.log 2>&1 &
      
      # Aguardar aplicação inicializar
      sleep 10
      
      echo "=== Frontend VM configurada com sucesso! ==="
      echo "Vue.js rodando na porta 5173"
      echo "IP: 192.168.90.10 (rede interna)"
      echo "Acesse via: http://localhost:8080"
    SHELL
  end
end