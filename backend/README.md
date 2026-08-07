# Backend

API do FAQBot.

## Stack

- Node.js
- Express
- TypeScript
- Prisma
- PostgreSQL

## Scripts

- `yarn dev`: inicia o servidor em modo desenvolvimento
- `yarn build`: compila o backend
- `yarn start`: executa a build gerada em `dist`

## Banco

O schema do Prisma está em `prisma/schema.prisma`.

Antes de subir a aplicação localmente, garanta que `DATABASE_URL` esteja apontando para um PostgreSQL válido.

## Rotas

- `POST /chat`
- `GET /faq`
- `POST /faq`
- `DELETE /faq/:id`
- `GET /interactions`
- `POST /interaction`

## Docker

No Docker, o backend faz `prisma generate` no build e `prisma db push` ao iniciar.
