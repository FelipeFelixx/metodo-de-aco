# Método Foco de Aço — Produção V2.1

Produto digital comercial: **Sistema de Produtividade e Controle da Rotina**.

## Arquitetura

- React + Vite + TypeScript + Tailwind CSS
- Supabase Auth + Postgres + RLS + RBAC
- Entitlements como fonte de verdade para acesso
- Kiwify/Cakto via webhook server-side
- Vercel para hospedagem do frontend
- Sem `service_role`/secret no frontend

## Supabase

Projeto: `bkshvuhfdvycwicocton`
URL: `https://bkshvuhfdvycwicocton.supabase.co`

O schema de produção já foi aplicado no projeto conectado. O banco contém produtos, perfis, RBAC, entitlements, aulas, desafios, prompts, progresso, planner, auditoria e idempotência de webhooks.

## Variáveis Vercel

Configure apenas no ambiente da Vercel:

```text
VITE_SUPABASE_URL=https://bkshvuhfdvycwicocton.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<publishable-key-do-projeto>
VITE_CHECKOUT_URL=<checkout-Kiwify-ou-Cakto>
```

A chave publishable pode estar no frontend; **secret/service-role nunca**.

## Webhook

Função implantada no Supabase:

`payment-webhook-v2`

Endpoint:

`https://bkshvuhfdvycwicocton.supabase.co/functions/v1/payment-webhook-v2?provider=kiwify`

ou

`https://bkshvuhfdvycwicocton.supabase.co/functions/v1/payment-webhook-v2?provider=cakto`

A função usa autenticação própria do provedor + idempotência. Ela cria/invita a conta do comprador, ativa o entitlement após compra aprovada e revoga após reembolso/chargeback/cancelamento.

Ainda é necessário cadastrar no Supabase Edge Functions Secrets:

- `KIWIFY_WEBHOOK_TOKEN`
- `CAKTO_WEBHOOK_SECRET`

Também é necessário preencher no produto do banco os IDs externos:

- `products.kiwify_product_id`
- `products.cakto_product_id`

Não coloque esses segredos no GitHub.

## Admin

O papel administrativo é armazenado em `user_roles` e protegido por RLS. Não existe botão de “modo admin” no frontend.

Depois de criar a conta do proprietário, a promoção para `admin` deve ser feita no banco por operação administrativa confiável. O cliente nunca consegue alterar o próprio papel.

## Segurança

- RLS habilitado em todas as tabelas expostas.
- `user_metadata` não é usado para autorização.
- Entitlement ativo é obrigatório para conteúdo do produto.
- Aluno só altera o próprio progresso/planner.
- Webhooks têm proteção por segredo e idempotência.
- Frontend não concede acesso.

## Build

```bash
npm install
npm run build
```

O erro original de Vercel foi corrigido adicionando `@types/react` e `@types/react-dom` e alinhando React/ReactDOM.
