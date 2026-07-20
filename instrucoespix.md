# Sistema de Pix para Galerias - Instruções

> **Versão 2.0** — Modal independente via iframe, configurável por URL.

## 🚀 NOVA ABORDAGEM: Modal Independente (Recomendado)

O modal agora é um **arquivo HTML único e independente** que pode ser usado em qualquer sistema via iframe.

### URL Base do Modal

```
https://pedroluz.github.io/modal-pix/index.html
```

### Arquivo
- `index.html` — Modal Pix autocontido (HTML + CSS + JS)

### Como Usar em Qualquer Sistema

#### Opção 1: Botão + Iframe (Recomendado)

```html
<!-- Botão que abre o modal -->
<button onclick="abrirPix()" style="...">
    ☕ Incentive meu trabalho!
</button>

<!-- Iframe oculto com o modal -->
<iframe 
  src="https://pedroluz.github.io/modal-pix/index.html?chave=pedroluz@yahoo.com&nome=Pedro+F+F+Luz&cidade=Resende+RJ&valores=10,20,50,100&mensagem=Incentive+meu+trabalho"
  id="pixFrame"
  style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; z-index:99999; border:none;"
></iframe>

<script>
function abrirPix() {
  document.getElementById('pixFrame').style.display = 'block';
}
</script>
```

#### Opção 2: Controle via JavaScript

```javascript
// Abrir modal
document.getElementById('pixFrame').style.display = 'block';

// Fechar modal (o próprio modal já fecha ao clicar fora)
document.getElementById('pixFrame').style.display = 'none';
```

### Parâmetros da URL

| Parâmetro | Obrigatório | Padrão | Descrição |
|-----------|-------------|--------|-----------|
| `chave` | **Sim** | — | Sua chave Pix (email, CPF, CNPJ, telefone) |
| `nome` | **Sim** | — | Nome como aparece no banco (max 25 chars) |
| `cidade` | **Sim** | — | Cidade (max 15 chars) |
| `valores` | Não | `10,20,50,100` | Valores sugeridos separados por vírgula |
| `mensagem` | Não | `Incentive meu trabalho! :)` | Texto motivacional |
| `cor` | Não | `ffdf00` | Cor de destaque (hex sem #) |
| `titulo` | Não | `Incentive meu trabalho` | Título do modal |
| `subtitulo` | Não | (texto padrão) | Subtítulo/descrição |
| `teste1` a `teste5` | Não | — | Nomes dos testemunhos |
| `testeval1` a `testeval5` | Não | — | Valores dos testemunhos |
| `testemsg1` a `testemsg5` | Não | — | Mensagens dos testemunhos |

### Exemplo Completo com Testemunhos

```
index.html?chave=pedroluz@yahoo.com&nome=Pedro+F+F+Luz&cidade=Resende+RJ&valores=10,20,50,100&mensagem=Incentive+meu+trabalho&cor=ffdf00&teste1=Ana+S.&testeval1=20&testemsg1=Montei+meu+album+inteiro&teste2=Carlos+M.&testeval2=10&testemsg2=Organizei+todas+as+figurinhas
```

### API JavaScript (Controle Externo)

O modal expõe uma API global `window.PixModal`:

```javascript
// Abrir programaticamente
window.PixModal.open();

// Fechar programaticamente
window.PixModal.close();

// Acessar configuração atual
console.log(window.PixModal.config);
```

### Comunicação via iframe (postMessage)

```javascript
// Enviar para o iframe
document.getElementById('pixFrame').contentWindow.postMessage('pix-open', '*');
document.getElementById('pixFrame').contentWindow.postMessage('pix-close', '*');
```

---

## Versão Legada (_PHP_)

> Para sistemas que ainda usam a versão PHP, mantenha as instruções abaixo.

## Variáveis de Configuração (copie e preencha)

```php
// ==========================================
// ⚙️ CONFIGURAÇÃO PIX - PREENCHA COM SEUS DADOS
// ==========================================

$pixHabilitado = true;                    // true = ativo, false = desativado
$pixChave = 'pedroluz@yahoo.com';      // Sua chave Pix (email, CPF, CNPJ, telefone ou chave aleatória)
$pixNome = 'Pedro F F Luz';              // Seu nome COMO APARECE no banco (max. 25 caracteres, sem acento)
$pixCidade = 'Resende RJ';              // Sua cidade (sem acento, max. 15 caracteres)
$pixMensagem = 'Incentive meu trabalho! :)';  // Texto motivacional (apenas A-Z, 0-9, $ % * + - . / : e espaço)
$pixValores = [10, 20, 50, 100];         // Valores sugeridos (o visitante pode digitar outro)

// Testemunhos (aparecem no modal Pix)
$testemunhos = [
    ['nome' => 'Ana S.',    'valor' => 20, 'mensagem' => 'Montei meu álbum inteiro com esse controle!'],
    ['nome' => 'Carlos M.', 'valor' => 10, 'mensagem' => 'Organizei todas as minhas figurinhas!'],
    ['nome' => 'Fernanda L.', 'valor' => 50, 'mensagem' => 'Muito útil pra acompanhar o que falta!'],
];
```

---

## Como Funciona

### Fluxo do Visitante

1. **Clica no CTA** → "Gostou desse app? Incentive meu trabalho me oferecendo um café!"
2. **Abre o modal** → QR Code já aparece com a mensagem padrão
3. **Escolhe um valor** sugerido OU digita um valor livre
4. **Opcionalmente** → Digita uma mensagem (vai junto no payload Pix)
5. **Escaneia o QR Code** ou **Copia o código** e cola no app do banco
6. **Confirma o pagamento** → Dinheiro cai na conta do desenvolvedor

### O que o Sistema Gera Automaticamente

| Elemento | Descrição |
|----------|-----------|
| **Payload Pix** | Formato EMV TLV (padrão Banco Central do Brasil) |
| **CRC16-CCITT** | Checksum de validação (polinômio 0x1021, init 0xFFFF) |
| **QR Code** | Imagem via API gratuita (api.qrserver.com) |
| **Código Copia e Cola** | Texto completo para colar no app do banco |

---

## Especificação Técnica do Payload Pix

### Formato EMV TLV

O payload segue o padrão do Banco Central com a estrutura:

```
ID (2 dígitos) + Tamanho (2 dígitos) + Valor
```

### Campos do Payload

| ID | Descrição | Exemplo |
|----|-----------|---------|
| `00` | Formato do payload | `01` (QR Code estático) |
| `01` | Tipo de transação | `11` (QR Code estático) |
| `26` | Informações da conta (GUI) | Subcampos: `00` = GUI, `01` = chave, `02` = mensagem |
| `52` | Categoria do comerciante | `0000` |
| `53` | Moeda | `986` (BRL - Real Brasileiro) |
| `54` | Valor (opcional) | `10.00`, `20.00`, etc. |
| `58` | Código do país | `BR` |
| `59` | Nome do beneficiário | Máx. 25 caracteres |
| `60` | Cidade do beneficiário | Máx. 15 caracteres |
| `62` | Dados adicionais | Subcampo `05` = `***` (txId) |
| `63` | CRC16 | Checksum de 4 caracteres hexadecimais |

### Caracteres Permitidos no Payload

- **Letras**: A-Z (maiúsculas, sem acentos)
- **Números**: 0-9
- **Especiais**: `$ % * + - . / :` e espaço
- **Nota**: A mensagem e o nome não podem conter acentos ou caracteres especiais. A função faz sanitização automaticamente.

---

## Integração em Outros Sistemas

### 1. Copie estas funções JavaScript

```javascript
// Função TLV (Tag-Length-Value)
function pixTlv(tag, value) {
    return tag.toString().padStart(2, '0') +
           value.length.toString().padStart(2, '0') +
           value;
}

// Função CRC16-CCITT
function crc16ccitt(str) {
    var crc = 0xFFFF;
    for (var i = 0; i < str.length; i++) {
        crc ^= str.charCodeAt(i) << 8;
        for (var j = 0; j < 8; j++) {
            crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) : (crc << 1);
        }
    }
    return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
}

// Gerar payload Pix
function generatePixPayload(chave, nome, cidade, amount, message) {
    var payload = '';
    payload += pixTlv('00', '01');
    payload += pixTlv('01', '11');

    var merchantInfo = pixTlv('00', 'br.gov.bcb.pix') + pixTlv('01', chave);
    if (message && message.trim().length > 0) {
        var clean = message.trim().substring(0, 72).replace(/[^A-Za-z0-9$%*+\-.\/: ]/g, '');
        merchantInfo += pixTlv('02', clean);
    }
    payload += pixTlv('26', merchantInfo);

    payload += pixTlv('52', '0000');
    payload += pixTlv('53', '986');

    if (amount && amount > 0) {
        payload += pixTlv('54', amount.toFixed(2));
    }

    payload += pixTlv('58', 'BR');
    payload += pixTlv('59', nome.substring(0, 25).toUpperCase().replace(/[^A-Z0-9 ]/g, ''));
    payload += pixTlv('60', cidade.substring(0, 15).toUpperCase().replace(/[^A-Z0-9 ]/g, ''));
    payload += pixTlv('62', pixTlv('05', '***'));

    var crcPayload = payload + '6304';
    var crc = crc16ccitt(crcPayload);
    return payload + '6304' + crc;
}

// --- Configuração (ajuste para o seu caso) ---
var PIX_CHAVE = 'pedroluz@yahoo.com';
var PIX_NOME = 'Pedro F F Luz';
var PIX_CIDADE = 'Resende RJ';
var PIX_VALORES = [10, 20, 50, 100];
var PIX_MENSAGEM = 'Incentive meu trabalho! :)';

// --- Funcoes do Modal ---

function openPixModal() {
    // IMPORTANTE: use style.cssText com !important para garantir
    // position:fixed e z-index alto, pois CSS pode ter conflitos
    var el = document.getElementById('pixModalOverlay');
    el.style.cssText = 'display:flex!important;position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.8);z-index:9999;align-items:center;justify-content:center;';
    el.classList.add('open');

    // Gerar botoes de valor (apenas uma vez)
    var valDiv = document.getElementById('pixValues');
    if (!valDiv.children.length) {
        PIX_VALORES.forEach(function(v) {
            var btn = document.createElement('button');
            btn.className = 'pix-value-btn';
            btn.textContent = 'R$ ' + v + ',00';
            btn.onclick = function() { selectPixValue(v, btn); };
            valDiv.appendChild(btn);
        });
    }

    // Limpar campos e GERAR QR CODE imediatamente
    // (senao o QR aparece quebrado com src vazio)
    document.getElementById('pixCustomInput').value = '';
    document.getElementById('pixMsgInput').value = '';
    document.querySelectorAll('.pix-value-btn').forEach(function(b) {
        b.classList.remove('active');
    });
    generatePix();
}

function closePixModal() {
    // IMPORTANTE: use style.display = 'none' para fechar
    // Remover apenas a classe .open NAO esconde o overlay
    var el = document.getElementById('pixModalOverlay');
    el.style.cssText = 'display:none;';
    el.classList.remove('open');
}

function selectPixValue(val, btn) {
    document.querySelectorAll('.pix-value-btn').forEach(function(b) {
        b.classList.remove('active');
    });
    if (btn) btn.classList.add('active');
    document.getElementById('pixCustomInput').value = val;
    generatePix();
}

function generatePix() {
    var amt = parseFloat(document.getElementById('pixCustomInput').value) || 0;
    var msg = document.getElementById('pixMsgInput').value.trim();
    var payload = generatePixPayload(PIX_CHAVE, PIX_NOME, PIX_CIDADE, amt, msg || PIX_MENSAGEM);
    var qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' +
                encodeURIComponent(payload) + '&margin=8&format=png';
    document.getElementById('pixQr').src = qrUrl;
    document.getElementById('pixPayloadText').textContent = payload;
}

function copiarPix() {
    var text = document.getElementById('pixPayloadText').textContent;
    if (!text) return;
    navigator.clipboard.writeText(text).then(function() {
        var btn = document.getElementById('pixCopyBtn');
        var orig = btn.textContent;
        btn.textContent = 'Copiado!';
        setTimeout(function() { btn.textContent = orig; }, 2000);
    });
}
```

### 2. Adicione o HTML do Modal

```html
<!-- Botão que abre o modal (use <button> ou <span> com onclick inline) -->
<button class="pix-cta" onclick="openPixModal()">☕ Gostou? Incentive meu trabalho!</button>

<!-- Modal Pix (deve estar DEPOIS do <script>) -->
<div class="pix-modal-overlay" id="pixModalOverlay">
    <div class="pix-modal" id="pixModal">
        <button class="pix-modal-close" onclick="closePixModal()">&times;</button>
        <p class="pix-modal-message">Incentive a continuidade do meu trabalho me oferecendo um cafezinho :)</p>

        <div class="pix-values" id="pixValues"></div>

        <div class="pix-custom-value">
            <span>R$</span>
            <input id="pixCustomInput" type="number" min="1" step="0.01" placeholder="Outro valor">
        </div>

        <div class="pix-msg-field">
            <label>Mensagem (opcional):</label>
            <input id="pixMsgInput" type="text" maxlength="72" placeholder="Ex: Parabéns!">
        </div>

        <div class="pix-qr-wrap"><img id="pixQr" src="" alt="QR Code Pix"></div>

        <!-- Testemunhos (adapte ao seu projeto) -->
        <div class="pix-testimonials">
            <div class="pix-testimonial"><span class="pix-test-name">Ana S.</span> — R$20 — <em>"Montei meu álbum inteiro com esse controle!"</em></div>
            <div class="pix-testimonial"><span class="pix-test-name">Carlos M.</span> — R$10 — <em>"Organizei todas as minhas figurinhas!"</em></div>
            <div class="pix-testimonial"><span class="pix-test-name">Fernanda L.</span> — R$50 — <em>"Muito útil pra acompanhar o que falta!"</em></div>
        </div>

        <button class="pix-copy-btn" id="pixCopyBtn" onclick="copiarPix()">📋 Copiar Código Pix</button>
        <div class="pix-payload-text" id="pixPayloadText" onclick="copiarPix()"></div>
    </div>
</div>
```

### 3. Adicione o CSS

```css
/* ── Pix Modal ── */
.pix-cta {
    display: inline-block; margin-top: 12px;
    background: #1e4d3a; color: #ffdf00; border: 1px solid #ffdf00;
    border-radius: 50px; padding: 8px 20px; font-size: 0.82rem;
    cursor: pointer; transition: all 0.3s;
}
.pix-cta:hover { background: #ffdf00; color: #0a2818; }
.pix-modal-overlay {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.8); z-index: 9999;
    display: none; align-items: center; justify-content: center;
}
.pix-modal-overlay.open { display: flex; }
.pix-modal {
    background: #0f3020; border: 1px solid #1e5540; border-radius: 12px;
    padding: 24px; max-width: 420px; width: 90%; text-align: center;
    position: relative;
}
.pix-modal-close {
    position: absolute; top: 8px; right: 12px;
    background: none; border: none; color: #aab;
    font-size: 1.3rem; cursor: pointer;
}
.pix-modal-close:hover { color: #ffdf00; }
.pix-modal-message { color: #b0d4c0; font-size: 0.85rem; margin-bottom: 16px; }
.pix-values { display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; margin-bottom: 12px; }
.pix-value-btn {
    padding: 7px 16px; border-radius: 16px; border: 1px solid #1e5540;
    background: #0d3620; color: #ffdf00; cursor: pointer; transition: all 0.2s;
}
.pix-value-btn:hover, .pix-value-btn.active { background: #ffdf00; color: #0a2818; border-color: #ffdf00; }
.pix-custom-value { display: flex; align-items: center; justify-content: center; gap: 6px; margin-bottom: 12px; color: #aab; }
.pix-custom-value input {
    width: 110px; padding: 6px 10px; border-radius: 6px;
    background: #0d3620; border: 1px solid #334; color: #ffdf00; text-align: center;
}
.pix-msg-field { margin-bottom: 14px; }
.pix-msg-field label { display: block; margin-bottom: 4px; font-size: 0.78rem; color: #aab; }
.pix-msg-field input {
    width: 100%; padding: 7px 10px; border-radius: 6px;
    background: #0d3620; border: 1px solid #334; color: #e8f0ff; text-align: center;
}
.pix-qr-wrap { margin: 12px 0; }
.pix-qr-wrap img { width: 180px; height: 180px; border-radius: 8px; background: #fff; padding: 4px; }
.pix-testimonials { margin: 10px 0 14px; border-top: 1px solid #1e5540; padding-top: 10px; }
.pix-testimonial { font-size: 0.75rem; color: #aab; padding: 3px 0; }
.pix-test-name { color: #ffdf00; font-weight: 600; }
.pix-copy-btn {
    padding: 8px 20px; border-radius: 50px; cursor: pointer;
    border: 1px solid #ffdf00; background: transparent;
    color: #ffdf00; transition: all 0.3s;
}
.pix-copy-btn:hover { background: #ffdf00; color: #0a2818; }
.pix-payload-text {
    margin-top: 8px; font-size: 0.6rem; color: #556;
    word-break: break-all; max-height: 40px; overflow: hidden; cursor: pointer;
}
```

### 4. Adicione os event listeners no JS

```javascript
document.getElementById('pixModal').addEventListener('click', function(e) { e.stopPropagation(); });
document.getElementById('pixModalOverlay').addEventListener('click', function(e) {
    if (e.target === document.getElementById('pixModalOverlay')) closePixModal();
});
document.getElementById('pixCustomInput').addEventListener('input', function() {
    document.querySelectorAll('.pix-value-btn').forEach(function(b) { b.classList.remove('active'); });
    generatePix();
});
document.getElementById('pixMsgInput').addEventListener('input', function() {
    if (document.getElementById('pixCustomInput').value) generatePix();
});
```

---

## Erros Comuns e Como Evitar

| Erro | Causa | Solução |
|------|-------|---------|
| Modal não abre | Usar apenas `classList.add('open')` sem reforçar inline | Usar `style.cssText` com `!important` e `z-index:9999` |
| Modal aparece atrás da página | `z-index` baixo ou `position:fixed` não aplicado | Garantir `position:fixed; z-index:9999` via inline style |
| QR Code quebrado | `src=""` vazio ao abrir o modal | Chamar `generatePix()` dentro de `openPixModal()` |
| Fechar não funciona | Usar apenas `classList.remove('open')` | Usar `style.display = 'none'` + remover classe |
| Script quebra tudo | `}` solta ou código órfão fora de função | Verificar sempre que `{` e `}` estão balanceados |
| Acentos no payload | Mensagem com ç, ã, etc. | Fazer `.replace(/[^A-Za-z0-9$%*+\-.\/: ]/g, '')` |
| Nome truncado errado | Nome com mais de 25 caracteres | Usar `.substring(0, 25)` antes de enviar ao payload |

---

## Perguntas Frequentes

### O QR Code é real?

**Sim.** O QR Code é gerado com o payload Pix completo e válido. Qualquer app de banco brasileiro consegue ler e processar o pagamento.

### Preciso de servidor ou API?

**Não.** Tudo roda no navegador do visitante (JavaScript puro). O QR Code é gerado por uma API gratuita (api.qrserver.com) que não precisa de cadastro.

### O pagamento cai direto na minha conta?

**Sim.** Não há intermediário. O visitante escaneia o QR Code ou cola o código no app do banco e o dinheiro vai direto para a conta vinculada à chave Pix.

### Posso desativar?

Basta colocar `$pixHabilitado = false;` e some tudo (CTA, modal, link no rodapé).

### Posso mudar os valores depois?

Sim. Basta alterar o array `$pixValores = [10, 20, 50, 100];` para os valores que quiser.

### A mensagem vai junto no pagamento?

**Sim.** Se o visitante digitar uma mensagem, ela é incluída no campo `infoAdicional` do payload Pix (subcampo 02 do ID 26). Alguns bancos exibem essa mensagem antes da confirmação do pagamento.

---

## Limitações

- **Mensagem**: Máximo 72 caracteres, apenas A-Z, 0-9, `$ % * + - . / :` e espaço (sem acentos)
- **Nome**: Máximo 25 caracteres, sem acentos (a função converte para uppercase e sanitiza)
- **Cidade**: Máximo 15 caracteres, sem acentos (a função converte para uppercase e sanitiza)
- **Valor mínimo**: R$ 1,00 (limite do Banco Central)

---

## Segurança

- Nenhum dado é enviado para servidores externos (exceto a geração do QR Code)
- O payload é gerado inteiramente no navegador
- Não há cadastro nem coleta de dados pessoais
- O QR Code é apenas a representação visual do código Pix
