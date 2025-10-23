export class UserState {
    constructor() {
        this._user = null;
        this._subscribers = new Set();
    }

    get user() {
        return this._user;
    }

    set user(value) {
        this._user = value;
        this._notifySubscribers();
    }

    subscribe(callback) {
        this._subscribers.add(callback);
        // Notifica imediatamente com o estado atual
        callback(this._user);
    }

    unsubscribe(callback) {
        this._subscribers.delete(callback);
    }

    _notifySubscribers() {
        this._subscribers.forEach(callback => callback(this._user));
    }
}

// Cria uma instância global
export const userState = new UserState();