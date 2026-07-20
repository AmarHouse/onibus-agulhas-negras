## Design Context

Sistema **Ônibus Agulhas Negras** — PWA de horários de ônibus da Região das Agulhas Negras (Resende, Itatiaia, Penedo, Quatis, Porto Real). Register: product. Platform: web. Tonalidade: útil, direto, confiável — sem frescura visual.

Consulte `PRODUCT.md` para estratégia completa de produto, posicionamento e princípios de design.
Consulte `DESIGN.md` para tokens de cor, tipografia, componentes e regras visuais.
Consulte `style.css` para os tokens CSS atuais.

### Regras importantes
- G = Via Granja, M = Via Martinelli (NUNCA "Grande/Micro")
- Sem tarifas/preços em lugar nenhum
- Linhas estimadas: info "Horário de referência (consulte a empresa)"
- Linhas reais (IT01, RPE): info "G = Via Granja / M = Via Martinelli"
- Linha P135: Resende↔Itatiaia (Viação Resendense) — dados reais
- Modal Pix via https://pix-br.pages.dev/ com postMessage
- PowerShell node -e com escaping complexo falha — usar scripts .mjs
