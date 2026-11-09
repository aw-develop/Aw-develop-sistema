# Site e painel no Docker

Requisitos: Git e Docker Desktop com Docker Compose v2, em modo de containers Linux. Não é necessário instalar Node.js ou PostgreSQL na máquina. Execute todos os comandos na raiz do projeto.

## Primeira execução

Baixe o projeto (ou extraia o ZIP completo):

```sh
git clone https://github.com/aw-develop/Aw-develop-sistema.git
cd Aw-develop-sistema
```

Gere a configuração local. O comando funciona no PowerShell e no terminal Linux/macOS:

```sh
docker run --rm -v "${PWD}:/app" -w /app node:22-bookworm-slim node scripts/docker-setup.mjs
```

O arquivo `.env.docker` recebe duas chaves aleatórias independentes e o e-mail administrativo `alesonroberto68@gmail.com`. Para outro proprietário ou porta, informe e-mail e porta no primeiro comando:

```sh
docker run --rm -v "${PWD}:/app" -w /app node:22-bookworm-slim node scripts/docker-setup.mjs seu-email@empresa.com 3100
```

Executar novamente preserva o arquivo existente. Para ajustes posteriores, edite `.env.docker`. A senha do banco deve usar somente letras e números, pois compõe a URL de conexão. Não envie esse arquivo ao GitHub. Não use chaves de produção para o ambiente local.

Inicie os serviços e aguarde os checks de saúde:

```sh
docker compose --env-file .env.docker -f compose.local.yml up --build -d --wait
```

Na primeira execução, crie a conta do proprietário:

```sh
docker compose --env-file .env.docker -f compose.local.yml exec app npm run create-owner
```

O terminal solicita e confirma uma senha com pelo menos 12 caracteres. O script não altera a senha de uma conta que já existe.

- Site: http://localhost:3000
- Painel: http://localhost:3000/painel/login

Se escolheu outra porta, substitua `3000` na URL. Use `localhost` também no navegador: a origem é validada pelo backend.

## Dados, migrações e serviços

O PostgreSQL é local e usa o volume `awdevelop_db`; os dados permanecem após `down`. O banco não é exposto em uma porta da máquina. A aplicação só é exposta no endereço de loopback. As migrações são executadas antes do servidor e inicializam o conteúdo padrão no primeiro uso. Esse banco não contém os usuários, orçamentos ou dados do painel publicado.

O Dockerfile compila o Angular e o servidor Express entrega site, painel e API na mesma porta. Não há atualização automática ao editar o código: reconstrua a imagem.

Upload de imagens, Google Places, pesquisa web/SearXNG, IA e reuniões precisam de serviços e credenciais próprios. Eles não são provisionados pelo Compose local. A aplicação local pode ser usada para editar conteúdo e trabalhar com dados locais sem essas integrações. A imagem usa configuração local de desenvolvimento, não deve ser publicada como ambiente de produção.

## Uso diário

Ver os logs:

```sh
docker compose --env-file .env.docker -f compose.local.yml logs -f app
```

Ver saúde dos serviços:

```sh
docker compose --env-file .env.docker -f compose.local.yml ps
```

Atualizar depois de mudanças no código:

```sh
docker compose --env-file .env.docker -f compose.local.yml up --build -d --wait
```

Parar sem apagar o banco:

```sh
docker compose --env-file .env.docker -f compose.local.yml down
```

Se a porta estiver ocupada, edite `APP_PORT` em `.env.docker` e recrie os serviços. Se alterar a senha de um banco já inicializado, alterar apenas `.env.docker` não atualiza a senha dentro do PostgreSQL; mantenha a senha original ou faça a alteração no banco de forma coordenada. Não apague o volume para corrigir um problema sem antes preservar os dados.
