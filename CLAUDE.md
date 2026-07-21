# Ônibus Agulhas Negras

PWA de horários de ônibus da Região das Agulhas Negras (Resende, Itatiaia, Penedo, Quatis, Porto Real).

- **URL:** https://onibus-agulhas-negras.pages.dev/
- **Repositório:** https://github.com/AmarHouse/onibus-agulhas-negras
- **Git remote:** `origin` → `https://github.com/AmarHouse/onibus-agulhas-negras.git`
- **Branch:** `main`

---

## Como alterar e publicar

### 1. Fazer alterações nos arquivos

Editar diretamente os arquivos:
- `index.html` — estrutura HTML, metadados, OG tags, footer
- `style.css` — tokens CSS, temas, componentes
- `app.js` — lógica do PWA, linhas, schedule data
- `sw.js` — service worker (cache offline)
- `manifest.json` — configuração do PWA

### 2. Commitar e subir

```bash
git add .
git commit -m "descrição do que mudou"
git push
```

O Cloudflare Pages faz deploy automático em segundos.

### 3. Verificar deploy

Após o push, acessar https://onibus-agulhas-negras.pages.dev/ para ver as alterações ao vivo.

---

## Estrutura do projeto

```
├── index.html         → Página principal (HTML + OG tags + SEO + modal Pix)
├── style.css          → Tokens CSS, temas claro/escuro, componentes
├── app.js             → Lógica JS: SCHEDULES, BUS_STOPS, render, tabs, GPS
├── sw.js              → Service Worker (network-first, offline fallback)
├── manifest.json      → PWA manifest (ícones, nome, theme_color)
├── DESIGN.md          → Sistema de design: cores, tipografia, componentes
├── PRODUCT.md         → Estratégia de produto, posicionamento
├── CLAUDE.md          → Contexto para agentes de IA
├── instrucoespix.md   → Instruções do modal Pix
├── .gitignore         → Arquivos ignorados pelo git
├── icons/             → Ícones (favicon, OG image)
│   ├── favicon-bus.png    → 128×128
│   └── og-image.png       → 1200×1200
└── scripts/           → Scripts de ferramentas (.mjs)
    ├── fix-app.mjs            → Gera app.js do zero
    ├── atualizar-horarios.mjs → Script principal de dados
    ├── fix-braces.mjs         → Corrige chaves desbalanceadas
    ├── fix-quotes*.mjs        → Corrige aspas
    ├── remove-to.mjs / restore-to.mjs  → Gerencia campo `to`
    ├── verify-*.mjs           → Scripts de verificação
    └── preflight.mjs          → Verificação pré-deploy
```

---

## Dados das linhas

As 44 linhas estão no array `SCHEDULES` em `app.js`. Cada linha tem:
- `code` — código da linha (ex: "105", "IT01", "P135")
- `name` — nome da rota
- `operator` — operadora
- `tabs` — cidades onde aparece (ex: ["resende","itatiaia"])
- `info` — observações
- `from` / `to` — terminais com times: weekday, saturday, sunday, holiday

### Linhas reais (dados confirmados)
| Linha | Rota | Fonte |
|---|---|---|
| IT01 | Itatiaia ↔ Penedo | OCR confirmado |
| IT02 | Itatiaia ↔ Maromba | onibus.online |
| RPE | Resende ↔ Penedo | OCR confirmado |
| P135 | Resende ↔ Itatiaia | horariosonibus.com |
| RJO | Resende ↔ Rio de Janeiro | terminalcastelo.com (DETRO-RJ) |
| RJO-EXEC | Resende ↔ Rio (Executivo) | terminalcastelo.com |
| RNI | Resende ↔ Niterói | terminalcastelo.com |
| EPR | Eng. Passos ↔ Rio | terminalcastelo.com |
| PEN | Penedo ↔ Rio | onibus.online |
| MAR | Maromba ↔ Rio | terminalcastelo.com |
| QRI | Quatis/Porto Real ↔ Rio | terminalcastelo.com |

### Linhas estimadas
~30 linhas urbanas de Resende (105, 125, 130...) + PR01, PR02 — horários de referência com aviso "consulte a empresa".

### Regras importantes
- **G** = Via Granja, **M** = Via Martinelli (NUNCA "Grande/Micro")
- Sem tarifas/preços em lugar nenhum
- Linhas estimadas: `info: "Horário de referência (consulte a empresa)"`
- Linhas reais IT01/RPE: `info: "G = Via Granja / M = Via Martinelli"`

---

## Funcionalidades

- **3 abas:** Horários | Notícias (RSS resende.com.br) | Contatos (emergências + viações + prefeituras)
- **Busca por cidade:** tabs Resende, Itatiaia, Penedo, Quatis, Porto Real, Rodoviário
- **Seletor de dia:** Dia Útil, Sábado, Domingo, Feriado (com detecção automática)
- **GPS:** localiza ponto mais próximo e mostra linhas (removido — reativar se necessário)
- **Offline:** Service Worker network-first + cache + barra "Você está offline"
- **Dark mode:** alterna via botão 🌙/☀️
- **Modal Pix:** cafezinho via pix-br.pages.dev com postMessage
- **PWA:** manifesto + SW + offline + add to home screen

---

## Modal Pix

- URL: `https://pix-br.pages.dev/` com parâmetros:
  - `chave=pedroluz@yahoo.com`
  - `nome=Pedro+F+F+Luz`
  - `cidade=Resende+RJ`
  - `valores=10,20,50,100`
  - `tema=gold`

---

## Deploy

- **Plataforma:** Cloudflare Pages
- **Build command:** (vazio — HTML/CSS/JS puro)
- **Output directory:** `/`
- **Domínio:** `onibus-agulhas-negras.pages.dev`
- **Deploy automático:** sim, ao push no `main`

---

## Notas técnicas

- PowerShell `node -e` com escaping complexo falha — usar scripts `.mjs`
- Service Worker: network-first, fallback para `index.html` quando offline
- SVG icons inline no manifest (data URI) — sem arquivos de imagem externos
- favicon e OG image: PNG em `icons/`
