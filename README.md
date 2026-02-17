# 🚛 Click Guincho - Aplicativo de Solicitação de Guincho

> **Marketplace de Guinchos**: Tão fácil para quem precisa quanto para quem quer trabalhar.

---

## 📋 Sobre o Projeto

O **Click Guincho** é uma plataforma web/mobile que conecta usuários que precisam de guincho com profissionais guincheiros parceiros, funcionando no modelo Uber.

### ✨ Principais Funcionalidades

**Para Usuários:**
- ✅ Solicitação de guincho em 2 toques
- ✅ Visualização de preço antes de confirmar
- ✅ Acompanhamento em tempo real no mapa
- ✅ Pagamento integrado no app
- ✅ Sistema de avaliações
- ✅ Modo "Local Perigoso" para prioridade máxima

**Para Parceiros Guincheiros:**
- ✅ Cadastro simplificado
- ✅ Recebimento de solicitações em tempo real
- ✅ Aceitar/recusar corridas
- ✅ Sistema de reputação
- ✅ Painel de controle e histórico

---

## 🗂️ Estrutura do Projeto

```
click-guincho/
│
├── index.html              # Tela principal (Emergência)
├── servicos.html           # Seleção de tipo de guincho
├── acompanhamento.html     # Tracking em tempo real
├── historico.html          # Histórico de solicitações
├── perfil.html             # Perfil do usuário
│
├── css/
│   └── global.css          # Estilos globais
│
├── js/
│   └── app.js              # Funções JavaScript
│
├── assets/
│   └── images/             # Imagens e ícones
│
└── README.md               # Este arquivo
```

---

## 🚀 Como Executar Localmente

### Opção 1: Abrir Diretamente no Navegador

1. Baixe todos os arquivos
2. Abra o arquivo `index.html` no seu navegador
3. Pronto! O app está funcionando

### Opção 2: Servidor Local (Recomendado)

Se você tem Node.js instalado:

```bash
# Instalar servidor HTTP simples
npm install -g http-server

# Navegar até a pasta do projeto
cd click-guincho

# Iniciar servidor
http-server -p 8000

# Abrir no navegador
# http://localhost:8000
```

Ou com Python:

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

### Opção 3: Live Server (VS Code)

1. Instale a extensão "Live Server" no VS Code
2. Clique com botão direito em `index.html`
3. Selecione "Open with Live Server"

---

## 📱 Visualização Mobile

O app foi desenvolvido **mobile-first** e funciona perfeitamente em dispositivos móveis.

**Para testar no desktop:**
1. Abra as ferramentas de desenvolvedor (F12)
2. Ative o modo de dispositivo móvel (Ctrl+Shift+M)
3. Selecione um dispositivo (ex: iPhone 12)

**Dimensões recomendadas:**
- Width: 375px - 428px (iPhone)
- Height: 812px - 926px

---

## 🌐 Implantação em Produção

### Opção 1: Vercel (Recomendado - GRÁTIS)

```bash
# Instalar Vercel CLI
npm install -g vercel

# Na pasta do projeto
vercel

# Seguir instruções no terminal
```

Ou pela interface web:
1. Acesse [vercel.com](https://vercel.com)
2. Faça login com GitHub
3. Clique em "New Project"
4. Importe o repositório
5. Deploy automático!

**URL de exemplo:** `https://click-guincho.vercel.app`

### Opção 2: Netlify (GRÁTIS)

1. Acesse [netlify.com](https://netlify.com)
2. Arraste a pasta do projeto para a área de deploy
3. Pronto! URL gerada automaticamente

### Opção 3: GitHub Pages (GRÁTIS)

```bash
# Criar repositório no GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/seu-usuario/click-guincho.git
git push -u origin main

# Ir em Settings > Pages
# Selecionar branch 'main'
# Salvar
```

**URL:** `https://seu-usuario.github.io/click-guincho`

### Opção 4: Hospedagem Própria

Qualquer servidor web (Apache, Nginx, etc):
- Copie todos os arquivos para `/var/www/html/`
- Configure o domínio
- Ative HTTPS (Let's Encrypt gratuito)

---

## 🔧 Próximos Passos - Integração com Backend

### 1. API de Geolocalização Real

Substituir geolocalização simulada por API real:

**Google Maps API:**
```javascript
// Adicionar no <head>
<script src="https://maps.googleapis.com/maps/api/js?key=SUA_API_KEY"></script>

// Substituir obterLocalizacao()
function obterLocalizacao() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const geocoder = new google.maps.Geocoder();
                const latlng = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                
                geocoder.geocode({ location: latlng }, (results, status) => {
                    if (status === 'OK') {
                        resolve({
                            latitude: latlng.lat,
                            longitude: latlng.lng,
                            endereco: results[0].formatted_address
                        });
                    }
                });
            },
            (error) => reject(error)
        );
    });
}
```

### 2. Backend - API REST

Criar uma API com Node.js + Express:

```javascript
// server.js
const express = require('express');
const app = express();

// Rotas
app.post('/api/solicitacao', (req, res) => {
    // Criar solicitação no banco
});

app.get('/api/guinchos-disponiveis', (req, res) => {
    // Buscar guinchos próximos
});

app.get('/api/acompanhamento/:id', (req, res) => {
    // Retornar posição do guincho em tempo real
});

app.listen(3000);
```

### 3. Banco de Dados

**Estrutura sugerida (PostgreSQL/MySQL):**

```sql
-- Tabela de Usuários
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    telefone VARCHAR(20),
    foto_url VARCHAR(255),
    criado_em TIMESTAMP DEFAULT NOW()
);

-- Tabela de Guincheiros
CREATE TABLE guincheiros (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuarios(id),
    veiculo_tipo VARCHAR(50),
    placa VARCHAR(10),
    avaliacao DECIMAL(2,1),
    total_corridas INT DEFAULT 0,
    ativo BOOLEAN DEFAULT true,
    verificado BOOLEAN DEFAULT false
);

-- Tabela de Solicitações
CREATE TABLE solicitacoes (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuarios(id),
    guincheiro_id INT REFERENCES guincheiros(id),
    tipo_servico VARCHAR(50),
    latitude_origem DECIMAL(10,8),
    longitude_origem DECIMAL(11,8),
    latitude_destino DECIMAL(10,8),
    longitude_destino DECIMAL(11,8),
    valor DECIMAL(10,2),
    status VARCHAR(20),
    local_perigoso BOOLEAN DEFAULT false,
    criado_em TIMESTAMP DEFAULT NOW(),
    finalizado_em TIMESTAMP
);
```

### 4. Pagamentos

**Integrar com Stripe ou Mercado Pago:**

```javascript
// Exemplo com Stripe
const stripe = require('stripe')('sua_chave_secreta');

async function processarPagamento(valor, metodoPagamento) {
    const paymentIntent = await stripe.paymentIntents.create({
        amount: valor * 100, // Em centavos
        currency: 'brl',
        payment_method: metodoPagamento,
        confirm: true
    });
    
    return paymentIntent;
}
```

### 5. WebSocket para Tempo Real

Para atualizar a posição do guincho em tempo real:

```javascript
// Backend
const io = require('socket.io')(server);

io.on('connection', (socket) => {
    socket.on('atualizarPosicao', (data) => {
        // Broadcast para usuário específico
        io.to(data.solicitacaoId).emit('posicaoGuincho', data.posicao);
    });
});

// Frontend
const socket = io('http://seu-servidor.com');

socket.on('posicaoGuincho', (posicao) => {
    // Atualizar marcador no mapa
    atualizarMarcador(posicao);
});
```

### 6. Notificações Push

**Firebase Cloud Messaging:**

```javascript
// Pedir permissão
const messaging = firebase.messaging();

messaging.requestPermission()
    .then(() => messaging.getToken())
    .then(token => {
        // Enviar token para o backend
        salvarTokenNotificacao(token);
    });

// Receber notificações
messaging.onMessage((payload) => {
    mostrarNotificacao(payload.notification.title, payload.notification.body);
});
```

---

## 🔐 Segurança

### Implementações Necessárias:

1. **Autenticação JWT**
```javascript
const jwt = require('jsonwebtoken');

function gerarToken(usuario) {
    return jwt.sign({ id: usuario.id }, 'seu_segredo', { expiresIn: '7d' });
}

function verificarToken(token) {
    return jwt.verify(token, 'seu_segredo');
}
```

2. **HTTPS Obrigatório**
- Usar Let's Encrypt para certificado SSL gratuito
- Redirecionar HTTP → HTTPS

3. **Validação de Dados**
```javascript
const { body, validationResult } = require('express-validator');

app.post('/api/solicitacao', [
    body('latitude').isFloat(),
    body('longitude').isFloat(),
    body('servico').isIn(['guincho-simples', 'guincho-plataforma', 'moto-guincho', 'guincho-pesado'])
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // Processar solicitação
});
```

4. **Rate Limiting**
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100 // máximo 100 requisições
});

app.use('/api/', limiter);
```

---

## 📊 Monitoramento e Analytics

### Google Analytics 4

Adicionar no `<head>` de todas as páginas:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Eventos Customizados

```javascript
// Rastrear solicitações
gtag('event', 'solicitar_guincho', {
    'servico': 'guincho-simples',
    'valor': 120
});

// Rastrear conclusões
gtag('event', 'guincho_concluido', {
    'tempo_total': tempoEmMinutos,
    'avaliacao': notaDada
});
```

---

## 📱 Converter para App Mobile

### PWA (Progressive Web App)

1. Adicionar `manifest.json`:

```json
{
  "name": "Click Guincho",
  "short_name": "ClickGuincho",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0a1128",
  "theme_color": "#ff8c00",
  "icons": [
    {
      "src": "/assets/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/assets/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

2. Adicionar Service Worker (`sw.js`):

```javascript
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('click-guincho-v1').then((cache) => {
            return cache.addAll([
                '/',
                '/index.html',
                '/css/global.css',
                '/js/app.js'
            ]);
        })
    );
});
```

### React Native (App Nativo)

```bash
npx react-native init ClickGuincho
cd ClickGuincho
npm install @react-navigation/native react-native-maps
```

---

## 🧪 Testes

### Testes Unitários (Jest)

```javascript
// app.test.js
const { Formatacao } = require('./js/app.js');

test('Formatar moeda corretamente', () => {
    expect(Formatacao.moeda(120)).toBe('R$ 120,00');
});

test('Formatar distância em metros', () => {
    expect(Formatacao.distancia(500)).toBe('500m');
});

test('Formatar distância em km', () => {
    expect(Formatacao.distancia(2300)).toBe('2.3km');
});
```

---

## 🎨 Personalização

### Cores

Alterar as cores principais em `tailwind.config`:

```javascript
colors: {
    "primary": "#ff8c00",          // Laranja principal
    "background-light": "#f8f7f5", // Fundo claro
    "background-dark": "#0a1128",  // Fundo escuro
}
```

### Logo e Branding

1. Adicionar logo em `/assets/images/logo.png`
2. Substituir no header de todas as páginas

---

## 📄 Licença

Este projeto é open source e pode ser usado livremente.

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

## 📞 Suporte

Dúvidas ou problemas? Abra uma issue no GitHub ou entre em contato.

---

## 🗺️ Roadmap

### Fase 1 (MVP) - ✅ Concluído
- [x] Interface do usuário
- [x] Sistema de navegação
- [x] Seleção de serviços
- [x] Acompanhamento simulado

### Fase 2 (Backend)
- [ ] API REST completa
- [ ] Banco de dados
- [ ] Autenticação JWT
- [ ] Sistema de pagamentos

### Fase 3 (Integrações)
- [ ] Google Maps API real
- [ ] WebSocket para tempo real
- [ ] Notificações push
- [ ] Sistema de avaliações

### Fase 4 (Parceiro)
- [ ] App para guincheiros
- [ ] Painel administrativo
- [ ] Sistema de comissões
- [ ] Relatórios e analytics

### Fase 5 (Escalabilidade)
- [ ] Cache (Redis)
- [ ] CDN para assets
- [ ] Otimização de performance
- [ ] Testes automatizados

---

**Desenvolvido com ❤️ para revolucionar o mercado de guinchos no Brasil** 🇧🇷
