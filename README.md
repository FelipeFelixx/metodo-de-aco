# Método Foco de Aço — V2

Plataforma comercial de produtividade: área do aluno + base para administração.

## O que a V2 já entrega
- Dashboard do aluno
- Aulas e conclusão de conteúdo
- Desafio 24h
- Desafio 7 dias
- Pomodoro 25/5 e 50/10
- Planner de blocos
- 30 prompts
- Progresso persistido localmente para prototipagem
- Estrutura visual preparada para área administrativa
- Separação conceitual entre `student` e `admin`
- Página de vendas integrada ao fluxo por CTA externo
- Mobile-first / PWA manifest
- Nenhum segredo de pagamento ou Supabase incluído

## Segurança — regra obrigatória
Este repositório pode ser público. O frontend NÃO é uma autoridade de acesso.

Na integração real:
Kiwify/Cakto -> webhook seguro -> Edge Function/backend -> entitlement -> Supabase Auth/RLS -> área do aluno.

Nunca coloque service role/secret keys/webhook secrets no frontend.

O admin real deve ser autorizado no backend/banco, e não por `localStorage`, query string ou variável React.

## O que ainda precisa de integração real
- Supabase Auth
- tabelas e RLS
- entitlements
- webhook Kiwify
- webhook Cakto
- revogação por reembolso/cancelamento
- dashboard administrativo real
- checkout/links reais
- domínio e política de privacidade

A V2 é a base de produto e UX; não deve ser anunciada como sistema de pagamento/autenticação já implementado.