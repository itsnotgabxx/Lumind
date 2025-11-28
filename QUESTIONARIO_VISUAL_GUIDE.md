# 🎨 Guia Visual - Novo Questionário Lumind

## 📸 Layout Visual

### Sessão 1: Estilos de Aprendizado
```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  [Progresso: 1/3 - 33% preenchido]   ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                                      ┃
┃  💡 Como você aprende melhor?        ┃
┃  Escolha as formas que combinam      ┃
┃                                      ┃
┃  ┌────────────────────────────────┐  ┃
┃  │ 🎬 VÍDEOS                      │  ┃
┃  │ Vídeo-aulas e tutoriais        │  ┃
┃  └────────────────────────────────┘  ┃
┃                                      ┃
┃  ┌────────────────────────────────┐  ┃
┃  │ 🖼️  IMAGENS                     │  ┃
┃  │ Infográficos e diagramas       │  ┃
┃  └────────────────────────────────┘  ┃
┃                                      ┃
┃  ┌────────────────────────────────┐  ┃
┃  │ ✅ 🎮 JOGOS (SELECIONADO)      │  ┃
┃  │ Atividades interativas         │  ┃
┃  └────────────────────────────────┘  ┃
┃                                      ┃
┃  [PRÓXIMO →]                         ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

### Sessão 2: Interesses
```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  [Progresso: 2/3 - 66% preenchido]   ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                                      ┃
┃  ✨ O que você gosta?                ┃
┃  Selecione seus tópicos de interesse ┃
┃                                      ┃
┃  ┌─────────────┐ ┌─────────────┐    ┃
┃  │   🚀        │ │   🔬        │    ┃
┃  │   Espaço    │ │ Tecnologia  │    ┃
┃  └─────────────┘ └─────────────┘    ┃
┃                                      ┃
┃  ┌─────────────┐ ┌─────────────┐    ┃
┃  │   🎵        │ │   💻        │    ┃
┃  │   Música    │ │ Programação │    ┃
┃  └─────────────┘ └─────────────┘    ┃
┃                                      ┃
┃  Tags selecionados:                  ┃
┃  [Espaço ×] [Programação ×]          ┃
┃                                      ┃
┃  [← VOLTAR] [PRÓXIMO →]              ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

### Sessão 3: Desafios
```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  [Progresso: 3/3 - 100% preenchido]  ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                                      ┃
┃  🛡️ Seus desafios                   ┃
┃  Ajude-nos a criar um bom ambiente  ┃
┃                                      ┃
┃  ┌──────────────┐ ┌──────────────┐  ┃
┃  │ 🔇           │ │ 👁️           │  ┃
┃  │ Sons altos   │ │ Cores        │  ┃
┃  │              │ │ vibrantes    │  ┃
┃  └──────────────┘ └──────────────┘  ┃
┃                                      ┃
┃  ┌──────────────┐ ┌──────────────┐  ┃
┃  │ 📄           │ │ 🎬           │  ┃
┃  │ Textos       │ │ Movimento    │  ┃
┃  │ longos       │ │              │  ┃
┃  └──────────────┘ └──────────────┘  ┃
┃                                      ┃
┃  Outros desafios:                    ┃
┃  [_________________________]          ┃
┃                                      ┃
┃  [← VOLTAR] [✓ FINALIZAR]            ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

---

## 🎨 Sistema de Cores

### Gradientes por Sessão

**Sessão 1 - Aprendizado (Roxo/Azul)**
```
████ Roxo Escuro (#667eea) → Roxo Claro (#764ba2)
Usado em: Header, botões, ícones principais
```

**Sessão 2 - Interesses (Rosa/Vermelho)**
```
████ Rosa (#f093fb) → Vermelho (#f5576c)
Usado em: Cards selecionados, ícones
```

**Sessão 3 - Desafios (Azul/Cyan)**
```
████ Azul (#4facfe) → Cyan (#00f2fe)
Usado em: Cards selecionados, ícones
```

---

## ⚡ Animações

### Transição entre Sessões (300ms)
```
Slide Out Left (saída)    →    Slide In Right (entrada)
[========] ←————————————— ↓ —————————————→ [========]
```

### Cards ao Selecionar
```
Antes: Card cinza, ícone pequeno
Depois: Card colorido, ícone aumenta 1.1x com shadow
```

### Progresso Circular
```
Sessão 1: ███░░░░░░░░░░░░░░ (33%)
Sessão 2: ███████░░░░░░░░░░ (66%)
Sessão 3: ███████████░░░░░░ (100%)
```

---

## 📱 Responsividade

### Desktop (>640px)
- Cards em linha
- Botões lado a lado
- Progress circle grande
- Layout expandido

### Tablet (480px - 640px)
- Cards em 2 colunas
- Botões empilhados (opcional)
- Interface ajustada

### Mobile (<480px)
- Cards empilhados (1 coluna)
- Botões em coluna
- Progress circle reduzido
- Padding reduzido

---

## 🔔 Estados Visuais

### Card Não Selecionado
```
┌──────────────────┐
│ 🎬               │  Gray icon
│ Vídeos           │  Gray border
│ Descrição...     │  White background
└──────────────────┘
```

### Card Selecionado
```
┌──────────────────┐
│ 🎬 (glow)        │  Purple icon + shadow
│ Vídeos           │  Purple border
│ Descrição...     │  Purple background (tint)
└──────────────────┘ Purple highlight
```

### Tag de Interesse
```
[Espaço ×] [Programação ×]
 Purple    Gray icon on hover
 White text
 Animated entrance
```

---

## 🎯 Fluxos de Interação

### Selecionar Opção
1. **Hover**: Card fica um tom mais escuro
2. **Click**: Card muda de cor, ícone aumenta
3. **Visual Feedback**: Shadow no ícone

### Adicionar Interesse Customizado
1. Digite texto no input
2. Clique "Adicionar" ou Enter
3. Novo interesse aparece com animação
4. Aparece como tag selecionada

### Navegar entre Sessões
1. **Próximo**: Valida → Anima saída → Anima entrada → Atualiza progresso
2. **Voltar**: Mesma animação em direção oposta → Recupera dados anteriores

---

## 🚀 Experência do Usuário

### Primeira Vez
1. Vê progresso circular (1/3)
2. Recebe dica: "Selecione pelo menos uma forma de aprendizado"
3. Seleciona 2-3 opções
4. Clica "Próximo"
5. Suave transição
6. Agora em sessão 2 (2/3)
7. ... repete para sessão 3
8. Clica "Finalizar"
9. Sucesso: "Preferências salvas!"
10. Redireciona para recomendações

### Sem Seleção
- Botão "Próximo" clicável
- Alert de validação: "Selecione pelo menos uma opção"
- Sessão não avança
- Usuário fica na mesma sessão

### Voltar
- Dados anteriores são preservados
- Checkboxes mantêm estado
- Tags de interesse mantêm visualização

---

## 💡 Tips & Best Practices

### Para o Usuário
- ✅ Selecione múltiplas opções em cada sessão
- ✅ Seja honesto nos desafios
- ✅ Use interesses customizados se precisar
- ✅ Pode editar depois no perfil

### Para o Desenvolvedor
- ✅ State persiste em sessionStorage
- ✅ Fácil adicionar novas opções
- ✅ CSS é modular e customizável
- ✅ Suporta dark mode automaticamente

---

## 🎬 Sequência Completa

```
LOGIN → REDIRECT /questionario
         ↓
    STEP 1/3
    Seleciona aprendizado
         ↓
    NEXT (animate right)
         ↓
    STEP 2/3
    Seleciona interesses
         ↓
    NEXT (animate right)
         ↓
    STEP 3/3
    Seleciona desafios
         ↓
    FINALIZAR
    API SAVE
         ↓
    REDIRECT /recomendacao
    MOSTRA CONTEÚDO PERSONALIZADO
```

---

## ✨ Diferenciais

1. **Sem Textos Abertos**: Apenas dropdowns, checkboxes, cards
2. **Validação Inteligente**: Força mínima de seleção
3. **Progresso Visual**: Usuário sabe onde está
4. **Animações Suaves**: Não irritam, enriquecem UX
5. **Dark Mode Native**: Sem código extra
6. **Mobile First**: Design responsivo perfeito
7. **Acessível**: Cores com bom contraste, ícones claros
