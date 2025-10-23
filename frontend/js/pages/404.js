export default function NotFound() {
    return `
        <div class="w-full max-w-md mx-auto text-center py-12">
            <div class="mb-8">
                <i class="fas fa-search text-6xl text-gray-400"></i>
            </div>
            <h1 class="text-4xl font-bold text-gray-800 mb-4">Página não encontrada</h1>
            <p class="text-gray-600 mb-8">
                A página que você está procurando não existe ou foi movida.
            </p>
            <button onclick="window.router.navigate('/')" class="btn-primary">
                Voltar para o início
            </button>
        </div>
    `;
}