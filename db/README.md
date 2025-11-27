# Database

Este diretório contém a configuração do banco de dados MySQL usando Docker Compose.

## Como executar

```bash
docker-compose up -d
```

## Configuração

- O banco de dados será executado na porta configurada em `DB_PORT`
- Os dados são persistidos no diretório `./data`
- Variáveis de ambiente devem ser configuradas no arquivo `.env` do backend
