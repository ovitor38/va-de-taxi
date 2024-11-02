<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p> 

# ORIT RH Backend TESTE, este é o meu resultado do desafio proposto pela ORIT. Essa API consiste em sistema CRUD de Tasks. Nele foram utilizadas as seguintes tecnologias: Nestjs, TypeORM, Swagger, Docker, Redis e MySQL.

## Descrição 
Nessa API foram aplicados conceitos principais do SOLID, para que possa ser de fácil sua mantenabilidade e escalabilidade. Buscando sempre pelo melhor padrão utilizado na área de desenvolvimento

### Arquitetura
O projeto segue a famosa arquitetura MVC, com a CLI do NESTJs a criação desse padrão fica super ágil e isso bastante utilizado nesse projeto 

### Funcionalidaes

-**Autenticação de Usuários**
  - A autenticação é feita através do email e senha do usuário, com isso a API é capaz de retornar um token JWT que lhe garantira acesso as demais funcionalidades

-**Crud Usários**
  - A API permite a criação de usuários requirindo: nome, email e uma senha, nas funcionalidades da rota de usuários todas as rotas são protegidas por autenficação JWT (exceto a de criação), essa proteção serve que apenas o usuário autenticado modifique ou exclua os seus dados

-**CRUD Tasks**
  - É possível criar, ler, atualizar e excluir tasks através da API de forma simples. Um registro consiste em titulo e descrição. Para garantir a segurança e seguindo um dos requistos desse desafio todas as rotas de filmes estão protegidas por JWT


### Tecnologias Utilizadas

- **BullMQ:**: A fim de tornar a aplicação mais rápida e versátil foi utilizado o BullMQ, seu sistema de mensageria permite que tarefas mais complexas sejam executadas sem que a aplicação fique travada
- **Docker:** O projeto utiliza Docker, as imagens tanto do MySQL quanto do Redis estão contidas nele. Dessa forma o projeto pode ser facilmente executado por outros desenvolvedores sendo desnecessários a instalação desses aplicativos em seu ambiente de desenvolvimento
- **Prisma:** Nessa aplicação também foi utilizado o prisma ORM. Com essa lib o facilidade de desenvolvimento se torna uma grande aliada, pois dispensa uso de querys, para realizar operações simples.
- **Commit-lint:** Para garantir uma padronização nos commit foi utilizado está lib que garante que não possa ser feitos commit que fujam do padrão estabelicidos nas configurações prévias estabelecidas 
- **Swagger:** Utilizado para realizar a documentação de todos os endpoint da aplicação
- **Redis:** Como maneira de melhoria na performance foi utilizado Redis para buscar dados que são frequentemente utilizados, fazendo com a API não demande tantas requisições ao banco de dados, fazendo com que tenha seu desempenho melhorado

## Instalação

Após clonar o projeto é necessário criar um arquivo .env na raiz do mesmo, após isso copie tudo de .env.example para esse novo arquivo.

Toda a aplicação está contenerizada, a fim de facilitar o uso da mesma em qualquer máquina que tenha o Docker instalado

Para iniciar a aplicação basta rodar o seguinte comando:

```
docker-compose run app npx prisma generate && npx prisma db push && npm run start:prod
```

Com o container iniciado basta utilizar a porta **8080** para acessar a aplicação.
Toda a documentação está disponível em:

```
localhost/api/swagger
```

## Testes
 Para ter uma aplicação funcional e evitar bugs. Foi utilizado o Jest que já vem nativamente no NestJS.
 Para executa-los basta rodar o comando
 ```
 npm run test
 ```

## Desenvolvimento e Experiência
Durante o desenvolvimento desse projeto houve muito comprometimento de minha parte, já estava bem familiarizado com a maioria das tecnologias principalmente Typescript e Docker.

TypeScript, swagger, docker e banco relacionais são ferramentas que eu utilizava sempre na minha antiga experiência profissional. Já o NestJs, venho estudando ele há algum tempo (cerca de 2 meses) e o Redis é uma novidade para mim, porém foi algo simples de se utilizar

## Documentação no Swagger
```bash
http://localhost:8080/api/swagger
```

## Meus contatos

- Author - Victor Oliveira
- Linkedin - [Victor Oliveira](https://www.linkedin.com/in/victor-oliveira-7a5a94103/)
- GitHub - [GitHub](https://github.com/ovitor38)
- Discord ID - victoroliveira7393
- WhatsApp - [Victor Oliveira](https://wa.me/qr/LPRKOV2PPKMDC1)

Quaisquer dúvidas estou a disposição 😃.
##  Tecnologias deste projeto

[![Node.js](https://img.shields.io/badge/-Node.js-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/-TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/-NestJS-E0234E?style=flat-square&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Swagger](https://img.shields.io/badge/-Swagger-85EA2D?style=flat-square&logo=swagger&logoColor=black)](https://swagger.io/)
[![Docker](https://img.shields.io/badge/-Docker-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)
[![Redis](https://img.shields.io/badge/-Redis-DC382D?style=flat-square&logo=redis&logoColor=white)](https://redis.io/)
[![git](https://img.shields.io/badge/-git-F05032?style=flat-square&logo=git&logoColor=white)](https://git-scm.com/)
[![GitHub](https://img.shields.io/badge/-GitHub-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/)