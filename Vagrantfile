Vagrant.configure("2") do |config|
  
  # VM do Database - deve subir primeiro
  config.vm.define "db-vm" do |database|
    database.vm.box = "bento/ubuntu-22.04"
    database.vm.hostname = "db-vm"
    
    database.vm.network "private_network", ip: "192.168.90.30", netmask: "255.255.255.0", vmware__netname: "vmnet3"
    
    database.vm.provider "vmware_desktop" do |v|
      v.gui = true
      v.memory = "2048"
      v.cpus = 2
      v.vmx["displayName"] = "StockPulse-Database"
    end
    
    database.vm.synced_folder "./db", "/home/vagrant/db", type: "rsync"
    
    database.vm.provision "shell", inline: <<-SHELL
      apt-get update
      apt-get install -y curl
      
      # Docker
      curl -fsSL https://get.docker.com -o get-docker.sh
      sh get-docker.sh
      usermod -aG docker vagrant
      
      curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
      chmod +x /usr/local/bin/docker-compose
      
      sleep 10
      
      cd /home/vagrant/db
      
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

  # VM do Backend - rede interna apenas
  config.vm.define "backend-vm" do |backend|
    backend.vm.box = "bento/ubuntu-22.04"
    backend.vm.hostname = "backend-vm"
    
    backend.vm.network "private_network", ip: "192.168.90.20", netmask: "255.255.255.0", vmware__netname: "vmnet3"
    
    backend.vm.provider "vmware_desktop" do |v|
      v.gui = true
      v.memory = "2048"
      v.cpus = 2
      v.vmx["displayName"] = "StockPulse-Backend"
    end
    
    backend.vm.synced_folder "./backend", "/home/vagrant/backend", type: "rsync"
    
    backend.vm.provision "shell", inline: <<-SHELL
      apt-get update
      apt-get install -y curl netcat-openbsd mysql-client
      
      # Node.js/NestJS
      curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
      apt-get install -y nodejs
      
      npm install -g @nestjs/cli prisma
      
      cd /home/vagrant/backend
      npm install
      
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
      
      # Migrations
      npm install prisma @prisma/client --save-dev
      npx prisma generate
      npx prisma db push
      
      npm run build
      
      mkdir -p /home/vagrant/logs
      chown vagrant:vagrant /home/vagrant/logs
      
      nohup npm run start:dev > /home/vagrant/logs/backend.log 2>&1 &
      
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
    
    frontend.vm.network "private_network", ip: "192.168.90.10", netmask: "255.255.255.0", vmware__netname: "vmnet3"
    
    frontend.vm.provider "vmware_desktop" do |v|
      v.gui = true
      v.memory = "2048"
      v.cpus = 2
      v.vmx["displayName"] = "StockPulse-Frontend"
    end
    
    frontend.vm.synced_folder "./frontend", "/home/vagrant/frontend", type: "rsync"
    
    frontend.vm.provision "shell", inline: <<-SHELL
      apt-get update
      apt-get install -y curl netcat-openbsd
      
      # Node.js/Vue.js
      curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
      apt-get install -y nodejs
      
      npm install -g @vue/cli vite
      
      cd /home/vagrant/frontend
      npm install
      
      # hosts internos para backend
      grep -q "192.168.90.20 backend" /etc/hosts || echo "192.168.90.20 backend" >> /etc/hosts
      
      mkdir -p /home/vagrant/logs
      chown vagrant:vagrant /home/vagrant/logs
      
      echo "Aguardando backend ficar disponível..."
      timeout=180
      while ! nc -z 192.168.90.20 8000 && [ $timeout -gt 0 ]; do
        sleep 5
        timeout=$((timeout-5))
        echo "Tentando conectar ao backend... ($timeout segundos restantes)"
      done
      
      nohup npm run dev -- --host 0.0.0.0 --port 5173 > /home/vagrant/logs/frontend.log 2>&1 &
      
      sleep 10
      
      echo "=== Frontend VM configurada com sucesso! ==="
      echo "Vue.js rodando na porta 5173"
      echo "IP: 192.168.90.10 (rede interna)"
      echo "Acesse via: http://localhost:8080"
    SHELL
  end
end