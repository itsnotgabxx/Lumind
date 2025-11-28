/**
 * Aplica as configurações de acessibilidade salvas em todo o documento.
 * @param {object} settings - O objeto de configurações vindo da API.
 * Ex: { font_size: "medio", contrast: "alto_contraste", ... }
 */
export function applyAccessibilitySettings(settings) {
    console.log('[applyAccessibilitySettings] Recebido:', settings);
    
    if (!settings) {
        console.warn("Configurações de acessibilidade não encontradas para aplicar."); 
        settings = { font_size: 'Padrão', contrast: 'Padrão', reduce_animations: false };
    }

    const bodyEl = document.body;

    // 1. Tamanho da Fonte
    bodyEl.classList.remove('font-size-padrao', 'font-size-medio', 'font-size-grande');
    
    const fontSizeMap = {
        'Padrão': 'font-size-padrao',
        'Médio': 'font-size-medio',
        'Grande': 'font-size-grande',
        'padrao': 'font-size-padrao',
        'padrão': 'font-size-padrao',
        'medio': 'font-size-medio',
        'grande': 'font-size-grande'
    };
    
    const fontClass = fontSizeMap[settings.font_size] || 'font-size-padrao';
    if (fontClass !== 'font-size-padrao') {
        bodyEl.classList.add(fontClass);
        console.log(`[Acessibilidade] Classe de fonte ADICIONADA: ${fontClass}`);
    }

    // 2. Alto Contraste
    bodyEl.classList.remove('high-contrast');
    
    const contrastMap = {
        'Alto Contraste': 'high-contrast',
        'alto_contraste': 'high-contrast',
        'Alto contraste': 'high-contrast'
    };
    
    if (contrastMap[settings.contrast]) {
        bodyEl.classList.add('high-contrast');
        console.log(`[Acessibilidade] Alto contraste ATIVADO`);
    }

    // 3. Reduzir Animações
    bodyEl.classList.remove('reduce-motion');
    if (settings.reduce_animations) {
        bodyEl.classList.add('reduce-motion');
    }
    
    console.log(`[Acessibilidade] Classes finais:`, bodyEl.className);
}