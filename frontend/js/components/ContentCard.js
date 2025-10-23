export class ContentCard {
    constructor(item) {
        this.item = item;
    }

    getTypeIcon() {
        switch(this.item.type) {
            case 'video':
                return '<i class="fas fa-video mr-1"></i> Vídeo';
            case 'text':
                return '<i class="fas fa-book-open mr-1"></i> Leitura';
            default:
                return '<i class="fas fa-puzzle-piece mr-1"></i> Jogo';
        }
    }

    render() {
        const card = document.createElement('div');
        card.className = 'card transform hover:shadow-lg transition-shadow duration-300 flex flex-col';

        const img = document.createElement('img');
        img.src = this.item.image_url || 'images/math.png';
        img.alt = this.item.title;
        img.className = 'rounded-md mb-4 w-full h-48 object-cover';
        card.appendChild(img);

        const h3 = document.createElement('h3');
        h3.className = 'text-lg font-semibold mb-2 text-gray-800';
        h3.textContent = this.item.title;
        card.appendChild(h3);

        const p = document.createElement('p');
        p.className = 'text-gray-600 text-sm mb-3 flex-grow';
        p.textContent = this.item.description || '';
        card.appendChild(p);

        const tag = document.createElement('span');
        tag.className = 'content-tag self-start mb-4';
        tag.innerHTML = this.getTypeIcon();
        card.appendChild(tag);

        const btn = document.createElement('button');
        btn.className = 'mt-auto w-full btn-secondary text-sm btn-explorar-conteudo';
        btn.setAttribute('data-content-id', this.item.id);
        btn.setAttribute('data-content-title', this.item.title);
        btn.innerHTML = '<i class="fas fa-play-circle mr-2"></i>Explorar';
        card.appendChild(btn);

        return card;
    }
}