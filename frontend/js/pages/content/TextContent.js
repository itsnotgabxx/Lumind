export default function TextContent(content) {
    // Processar o conteúdo de texto
    let paragraphs = [];
    
    if (content.paragraphs && Array.isArray(content.paragraphs)) {
        // Se já vier como array
        paragraphs = content.paragraphs;
    } else if (content.content) {
        // Se vier como string, dividir por quebras de linha duplas
        paragraphs = content.content
            .split(/\n\n+/)
            .map(p => p.trim())
            .filter(p => p.length > 0);
    } else if (content.content_data?.paragraphs) {
        // Se estiver em content_data
        paragraphs = content.content_data.paragraphs;
    }
    
    // Função para processar markdown básico
    function processMarkdown(text) {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-purple-700">$1</strong>')
            .replace(/__(.*?)__/g, '<strong class="font-semibold text-purple-700">$1</strong>')
            .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-purple-600 hover:text-purple-700 underline" target="_blank">$1</a>')
            .replace(/\n/g, '<br>');
    }
    
    // Extrair emoji e texto
    function splitEmojiText(text) {
        const match = text.match(/^([\u{1F300}-\u{1F9FF}])\s*(.*)/u);
        if (match) {
            return { emoji: match[1], text: match[2] };
        }
        return null;
    }
    
    const imageUrl = content.image_url || content.image || content.content_data?.image;
    
    return `
        <div class="text-content-wrapper">
            ${imageUrl ? `
                <div class="mb-6">
                    <img 
                        src="${imageUrl}" 
                        alt="${content.title}"
                        class="w-full rounded-xl shadow-md object-cover"
                        style="max-height: 350px;"
                        onerror="this.parentElement.style.display='none'"
                    >
                </div>
            ` : ''}
            
            <article class="text-content-article">
                ${paragraphs.map((paragraph, index) => {
                    const emojiSplit = splitEmojiText(paragraph);
                    
                    if (emojiSplit) {
                        // Parágrafo com emoji - formato de card
                        return `
                            <div class="emoji-card">
                                <span class="emoji-icon">${emojiSplit.emoji}</span>
                                <div class="emoji-content">${processMarkdown(emojiSplit.text)}</div>
                            </div>
                        `;
                    } else if (index === 0) {
                        // Primeiro parágrafo
                        return `<p class="first-paragraph">${processMarkdown(paragraph)}</p>`;
                    } else {
                        // Parágrafos normais
                        return `<p class="normal-paragraph">${processMarkdown(paragraph)}</p>`;
                    }
                }).join('')}
            </article>
        </div>
    `;
}