# 🚛 Click Guincho — Guia de Deploy Completo

## Pré-requisitos (contas gratuitas)
- [Supabase](https://supabase.com) — banco de dados + auth + realtime
- [Vercel](https://vercel.com) — hospedagem + serverless functions  
- [Google Cloud](https://console.cloud.google.com) — Google Maps API
- [Mercado Pago Developers](https://www.mercadopago.com.br/developers) — pagamentos

---

## PASSO 1 — Supabase

1. Criar novo projeto em supabase.com
2. Ir em **SQL Editor > New Query**
3. Colar e executar o conteúdo de `supabase/schema.sql`
4. Em **Authentication > Providers**: habilitar **Email** e **Google OAuth**
5. Em **Storage**: criar bucket `avatars` (público)
6. Copiar: `Project URL` e `anon public key` (Settings > API)

---

## PASSO 2 — Google Maps

1. Acessar [console.cloud.google.com](https://console.cloud.google.com)
2. Criar projeto "click-guincho"
3. Habilitar APIs:
   - Maps JavaScript API
   - Places API  
   - Directions API
   - Geocoding API
4. Criar credencial: **API Key**
5. Restringir ao domínio: `click-guincho.vercel.app`

---

## PASSO 3 — Mercado Pago

1. Acessar [mercadopago.com.br/developers](https://www.mercadopago.com.br/developers)
2. Criar aplicativo "Click Guincho"
3. Copiar **Access Token** (produção) e **Public Key**
4. Configurar Webhook URL: `https://click-guincho.vercel.app/api/pagamentos/webhook`
5. Habilitar notificações: `payment`

---

## PASSO 4 — Variáveis no Vercel

No painel Vercel → seu projeto → **Settings → Environment Variables**:

| Variável | Valor |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | https://xxxx.supabase.co |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | eyJhbGci... |
| `SUPABASE_SERVICE_ROLE_KEY` | eyJhbGci... |
| `NEXT_PUBLIC_GOOGLE_MAPS_KEY` | AIzaSy... |
| `MERCADOPAGO_ACCESS_TOKEN` | APP_USR-... |
| `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY` | APP_USR-... |
| `NEXT_PUBLIC_APP_URL` | https://click-guincho.vercel.app |

---

## PASSO 5 — Deploy

```bash
# 1. Clone/atualize o repo
git clone https://github.com/clickguincho-dev/click-guincho
cd click-guincho

# 2. Substitua TODOS os arquivos pelos do zip entregue

# 3. Instalar dependências
npm install

# 4. Commit e push
git add .
git commit -m "feat: implementação completa v2.0"
git push origin main
```

O Vercel faz deploy automático após o push. ✅

---

## PASSO 6 — Primeiro motorista de teste

No SQL Editor do Supabase:
```sql
-- Verificar um motorista manualmente para teste
UPDATE public.motoristas 
SET verificado = true 
WHERE id = 'UUID-DO-MOTORISTA';

-- Ver todos os motoristas
SELECT p.nome, p.email, m.veiculo_placa, m.verificado, m.status
FROM public.motoristas m
JOIN public.profiles p ON p.id = m.id;
```

---

## PASSO 7 — Testar fluxo completo

1. Abrir duas abas
2. **Aba 1**: Login como usuário → solicitar guincho
3. **Aba 2**: Login como motorista → ligar toggle "Online" → aceitar corrida
4. Verificar o mapa atualizando em tempo real
5. Motorista: clicar em "Cheguei" → "Iniciar" → "Concluir"
6. Usuário: avaliar com estrelas

---

## Arquitetura Final

```
Frontend (Vercel Static)     Backend (Serverless)      Infraestrutura
────────────────────────     ────────────────────      ─────────────
login.html                   /api/solicitacoes.js  →  Supabase PostgreSQL
index.html                   /api/pagamentos.js    →  Supabase Auth  
servicos.html                /api/motoristas.js    →  Supabase Realtime
acompanhamento.html          /api/mensagens.js     →  Google Maps API
motorista.html                                     →  Mercado Pago
perfil.html                                        →  Supabase Storage
historico.html               Service Worker (PWA)
```

---

## Suporte

Para dúvidas, abra uma issue no GitHub.  
Desenvolvido para revolucionar o mercado de guinchos no Brasil 🇧🇷
