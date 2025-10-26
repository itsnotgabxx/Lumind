export default function HistoricoCompletoPage() {
    return `
        <div class="items-start pt-8 w-full">
            <div class="container mx-auto px-4 w-full">
                <div class="flex flex-col text-center sm:flex-row sm:justify-between sm:items-center mb-6 gap-3">
                    <h1 class="screen-title sm:text-left order-2 sm:order-1 flex-grow"><i class="fas fa-book-reader mr-2 text-purple-500"></i>Histórico de Atividades</h1>
                    <button data-route="/progresso" class="btn-subtle text-sm order-1 sm:order-2 w-full sm:w-auto"><i class="fas fa-arrow-left mr-2"></i> Voltar</button>
                </div>
                <p class="screen-subtitle mb-8 text-center sm:text-left">Veja todas as atividades que você já explorou.</p>
                
                <div class="card">
                    <div class="space-y-4">
                        <div class="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div class="flex justify-between items-center mb-1">
                                <h3 class="font-semibold text-gray-700">Aventuras no Espaço Sideral</h3>
                                <span class="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full font-medium">Concluído</span>
                            </div>
                            <p class="text-xs text-gray-500">Tipo: Vídeo | Data: 31/05/2025</p>
                            <p class="text-sm text-gray-600 mt-2">Explorou os planetas e assistiu ao vídeo completo.</p>
                        </div>
                        <div class="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div class="flex justify-between items-center mb-1">
                                <h3 class="font-semibold text-gray-700">Dominando o Xadrez</h3>
                                <span class="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full font-medium">Em Andamento</span>
                            </div>
                            <p class="text-xs text-gray-500">Tipo: Leitura | Progresso: 25%</p>
                            <p class="text-sm text-gray-600 mt-2">Iniciou a leitura sobre os fundamentos do xadrez.</p>
                        </div>
                        <div class="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <h3 class="font-semibold text-gray-700">Mistérios do Oceano</h3>
                            </div>
                    </div>
                    <div class="mt-8 flex justify-center items-center space-x-2">
                        <button class="btn-subtle text-xs p-2 leading-none"><i class="fas fa-chevron-left"></i></button>
                        <span class="text-sm text-gray-600">Página 1 de 3</span>
                        <button class="btn-subtle text-xs p-2 leading-none"><i class="fas fa-chevron-right"></i></button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

export function setup() {
    // Adiciona listener para o botão Voltar
    document.querySelector('[data-route="/progresso"]').addEventListener('click', () => {
        window.router.navigate('/progresso');
    });
}