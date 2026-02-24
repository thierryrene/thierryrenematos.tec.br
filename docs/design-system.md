# Design System Minimo

Este documento define os tokens e padroes de interface para manter consistencia visual no projeto.

## 1. Tokens globais (:root)

### Cores
- `--bg-color`
- `--grid-border`
- `--text-main`
- `--text-label`
- `--item-hover`
- `--accent`
- `--empty-slot`

### Espacamentos
- `--space-1: 0.25rem`
- `--space-2: 0.5rem`
- `--space-3: 0.75rem`
- `--space-4: 1rem`
- `--space-5: 1.25rem`
- `--space-6: 1.5rem`
- `--space-8: 2rem`
- `--space-10: 2.5rem`
- `--space-12: 3rem`
- `--space-16: 4rem`

### Bordas e raio
- `--border-width: 1px`
- `--radius-none: 0`

### Componentes
- `--card-padding: var(--space-6)`
- `--card-padding-lg: var(--space-8)`
- `--btn-height: 2.5rem`
- `--btn-padding-x: var(--space-4)`
- `--btn-font-size: 0.75rem`
- `--btn-letter-spacing: 0.15em`
- `--dashboard-slot-mobile-height: clamp(10rem, 45vw, 12rem)`
- `--dashboard-hero-mobile-height: clamp(15rem, 70vw, 20rem)`

## 2. Padroes de componentes

### Card base
Classe base: `.ui-card`
- borda direita e inferior conforme grid
- fundo transparente
- padding pelo token
- estrutura vertical (`display: flex; flex-direction: column`)

### Botao base
Classe base: `.ui-btn`
- altura fixa por token
- padding horizontal por token
- borda por token
- uppercase + tracking consistente
- estado hover com `--item-hover`

### Label de metadado
Classe base: `.ui-label`
- fonte pequena
- uppercase
- tracking alto
- cor `--text-label`

### Acao por icone
Classe base: `.icon-btn`
- alvo de toque minimo recomendado para mobile (44px+)
- fundo transparente com feedback visual em hover/focus
- usado para likes/comentarios/mensagem em cards de fotografias

### Form controls
Classes base: `.ui-input`, `.ui-textarea`, `.ui-select`
- borda brutalista com `--grid-border`
- foco visivel por `--accent`
- placeholder com contraste legivel
- uso padrao em formularios de contato

## 3. Regras de uso
- Nao usar valores hardcoded de espacamento quando houver token equivalente.
- Reutilizar classes base (`.ui-btn`, `.ui-card`, `.ui-label`) antes de criar variacoes.
- Manter bordas como estrutura visual obrigatoria do layout.
- Em mobile, usar tokens de altura da dashboard para manter slots vazios estaveis.
- Footer deve seguir malha com celulas em `.ui-card`, incluindo mobile.
- Quando houver animacoes, prever fallback para `prefers-reduced-motion`.
- Modais devem preservar foco no dialog e bloquear scroll de fundo enquanto abertos.

## 4. Do / Dont
- Do: usar `var(--space-*)` para `margin`, `padding`, `gap`.
- Do: centralizar decisoes de estilo em `:root`.
- Dont: duplicar estilo de botao/card em blocos inline.
- Dont: introduzir raio arredondado sem necessidade funcional.
