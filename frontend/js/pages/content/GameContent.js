export default function GameContent(content) {
    return `
        <div class="text-center">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">${content.title || 'Jogo Interativo'}</h2>
            <p class="text-gray-600 mb-6">${content.description}</p>
            <div class="bg-gray-50 rounded-lg p-8">
                ${content.gameElement}
            </div>
        </div>
    `;
}