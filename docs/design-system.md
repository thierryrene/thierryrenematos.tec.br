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

## 3. Regras de uso
- Nao usar valores hardcoded de espacamento quando houver token equivalente.
- Reutilizar classes base (`.ui-btn`, `.ui-card`, `.ui-label`) antes de criar variacoes.
- Manter bordas como estrutura visual obrigatoria do layout.

## 4. Do / Dont
- Do: usar `var(--space-*)` para `margin`, `padding`, `gap`.
- Do: centralizar decisoes de estilo em `:root`.
- Dont: duplicar estilo de botao/card em blocos inline.
- Dont: introduzir raio arredondado sem necessidade funcional.
