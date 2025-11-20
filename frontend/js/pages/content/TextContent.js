export default function TextContent(content) {
    return `
        <div class="prose prose-lg max-w-none">
            ${content.image ? `
                <img 
                    src="${content.image}" 
                    alt="${content.title}"
                    class="w-full rounded-lg mb-6 object-cover max-h-80"
                >
            ` : ''}
            
            ${content.paragraphs.map(paragraph => `
                <p class="text-gray-700 mb-4">${paragraph}</p>
            `).join('')}
        </div>
    `;
}