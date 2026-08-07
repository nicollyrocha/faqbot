# Frontend

Interface do FAQBot construída com React, TypeScript, Vite e Tailwind.

## O que a interface faz

- Mostra o chat principal com histórico de mensagens
- Permite administrar FAQs com criação e exclusão
- Exibe o dashboard com métricas, gráficos e tabela de perguntas
- Mantém a sidebar sempre com a altura da tela

## Scripts

- `yarn dev`: inicia o frontend em desenvolvimento
- `yarn build`: gera a build de produção
- `yarn preview`: serve a build localmente

## Configuração

Se o backend não estiver na porta padrão, defina:

- `VITE_API_URL`: URL base da API, por exemplo `http://localhost:3001`

Se a variável não existir, o frontend usa `http://localhost:3001`.

## Como rodar

1. Entre na pasta `frontend`.
2. Instale as dependências com `yarn install`.
3. Execute `yarn dev`.

## Observações

- O gráfico temporal do dashboard é calculado a partir das interações salvas.
- O design usa componentes próprios do projeto, não o layout padrão do template do Vite.
