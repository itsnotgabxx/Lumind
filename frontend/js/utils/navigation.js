export function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active-screen');
        screen.style.display = 'none'; 
    });
    const activeScreen = document.getElementById(screenId);
    if (activeScreen) {
        activeScreen.classList.add('active-screen');
        activeScreen.style.display = 'flex'; 
        window.scrollTo(0, 0); 
    }
    updateDynamicContent(); 
}

export function updateDynamicContent() {
    // Este evento será emitido quando uma tela for alterada
    const event = new CustomEvent('screenContentUpdate');
    document.dispatchEvent(event);
}