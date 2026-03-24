---
description: Workflow para repaginação do projeto usando Google Stitch
---

# Workflow: Repaginação com Google Stitch

## Pré-requisitos
- Acesso ao Google Stitch em `stitch.withgoogle.com`
- `DESIGN.md` na raiz do projeto (criado automaticamente)
- Briefing de vibe design disponível no artefato da sessão

## Etapas

### 1. Importar design system no Stitch
- Abrir Stitch e criar novo projeto
- Importar o arquivo `DESIGN.md` da raiz do repositório
- Verificar se tokens de cor, tipografia e espaçamento foram reconhecidos

### 2. Gerar variações via Vibe Design
- Usar os prompts do briefing de vibe design (um por tela)
- Ordem recomendada: Dashboard → Blog → Fotografias → Sobre → Contato → Mobile
- Para cada tela:
  - Colar o prompt no campo de vibe design
  - Gerar 2–3 variações
  - Selecionar a preferida ou iterar com voz/texto

### 3. Criar protótipo navegável
- Conectar as telas geradas em ordem de navegação:
  - Home (Dashboard) → Sobre → Fotografias → Blog → Blog Post → Contato
- Usar hotspots para simular links do menu
- Testar com o botão Play
- Simular responsividade (360px, 390px, 768px no canvas)

### 4. Exportar para código
- Exportar HTML + CSS (ou HTML + Tailwind) do Stitch
- Salvar os arquivos exportados em `/tmp/stitch-export/`
- Alternativa: usar integração MCP com Antigravity para importar diretamente

### 5. Implementação pelo agente (Antigravity)
- Solicitar ao agente para integrar o export no projeto
- O agente deve:
  - Adaptar o HTML exportado à estrutura de `index.html`
  - Atualizar `assets/css/styles.css` com novos tokens se necessário
  - Preservar todas as integrações JS existentes
  - Manter i18n, SPA routing e sistema de temas
// turbo
  - Validar non-functional checklist (mobile, a11y, perf, SEO)

### 6. Validação
- Testar em `http://localhost/thierryrenematos.tec.br/`
- QA visual em 360px, 390px, 768px e desktop
- Verificar que integrações (Spotify, Last.fm, GitHub, Strava) funcionam
- Verificar i18n (pt-BR / en-US)
- Verificar tema automático + override manual

### 7. Finalização
- Atualizar `docs/design-system.md` com tokens finais
- Atualizar `CHANGELOG.md`
- Commit com emoji: `🎨 style: repaginação visual via Google Stitch`
- Atualizar nota diária do Obsidian (manual)
