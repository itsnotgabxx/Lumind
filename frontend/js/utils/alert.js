export function showCustomAlert(message, title = "Alerta", type = "info") {
    const customAlertOverlay = document.getElementById('custom-alert-overlay');
    const customAlertTitle = document.getElementById('custom-alert-title');
    const customAlertMessage = document.getElementById('custom-alert-message');
    const customAlertCloseButton = document.getElementById('custom-alert-close');
    const customAlertIcon = document.getElementById('custom-alert-icon');

    customAlertTitle.textContent = title;
    customAlertMessage.textContent = message;
    
    let iconHtml = '';
    let buttonClass = 'btn-primary w-full text-sm ';
    switch(type) {
        case 'success':
            iconHtml = `<i class="fas fa-check-circle text-4xl text-green-500"></i>`;
            buttonClass += 'bg-green-500 hover:bg-green-600';
            break;
        case 'error':
            iconHtml = `<i class="fas fa-times-circle text-4xl text-red-500"></i>`;
            buttonClass += 'bg-red-500 hover:bg-red-600';
            break;
        case 'warning':
            iconHtml = `<i class="fas fa-exclamation-circle text-4xl text-amber-500"></i>`;
            buttonClass += 'bg-amber-500 hover:bg-amber-600';
            break;
        default: 
            iconHtml = `<i class="fas fa-info-circle text-4xl text-blue-500"></i>`;
    }
    customAlertIcon.innerHTML = iconHtml;
    customAlertCloseButton.className = buttonClass;
    customAlertOverlay.style.display = 'flex';
}

export function setupAlertCloseListener() {
    const customAlertCloseButton = document.getElementById('custom-alert-close');
    const customAlertOverlay = document.getElementById('custom-alert-overlay');
    
    if (customAlertCloseButton) {
        customAlertCloseButton.addEventListener('click', () => {
            customAlertOverlay.style.display = 'none';
        });
    }
}