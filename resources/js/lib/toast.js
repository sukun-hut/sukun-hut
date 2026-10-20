// Universal Toast Notification Event Emitter
export const toast = {
    show(message, type = 'success') {
        if (typeof window === 'undefined') return;
        window.dispatchEvent(
            new CustomEvent('app:toast', {
                detail: {
                    id: Date.now() + Math.random(),
                    message,
                    type, // 'success' | 'error' | 'info'
                },
            })
        );
    },
    success(message) {
        this.show(message, 'success');
    },
    error(message) {
        this.show(message, 'error');
    },
    info(message) {
        this.show(message, 'info');
    },
};
