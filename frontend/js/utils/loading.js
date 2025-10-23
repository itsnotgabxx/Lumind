export class LoadingManager {
    constructor() {
        this.overlay = document.getElementById('loading-overlay');
        this.loadingCount = 0;
    }

    show() {
        this.loadingCount++;
        if (this.overlay) {
            this.overlay.style.display = 'flex';
        }
    }

    hide() {
        this.loadingCount--;
        if (this.loadingCount <= 0) {
            this.loadingCount = 0;
            if (this.overlay) {
                this.overlay.style.display = 'none';
            }
        }
    }

    async wrap(promise) {
        try {
            this.show();
            return await promise;
        } finally {
            this.hide();
        }
    }
}

// Cria uma instância global
export const loading = new LoadingManager();