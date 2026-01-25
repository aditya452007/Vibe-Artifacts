export type ToastType = 'success' | 'error' | 'info' | 'loading';

export class ToastManager {
    private static container: HTMLElement | null = null;
    private static shadow: ShadowRoot | null = null;
    private static toastiTimeouts: number[] = [];

    private static init() {
        if (this.container) return;

        this.container = document.createElement('div');
        this.container.id = 'prompt-builder-toast-container';

        // Host styles to ensure it's on top but doesn't block clicks when empty
        Object.assign(this.container.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: '2147483647', // Max z-index
            pointerEvents: 'none', // Let clicks pass through container
        });

        document.body.appendChild(this.container);
        this.shadow = this.container.attachShadow({ mode: 'open' });

        const style = document.createElement('style');
        style.textContent = `
            :host {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            }
            .toast {
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(0,0,0,0.1);
                border-radius: 12px;
                padding: 12px 16px;
                margin-bottom: 10px;
                box-shadow: 0 4px 24px rgba(0,0,0,0.12);
                display: flex;
                align-items: center;
                gap: 10px;
                transform: translateX(120%);
                transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
                opacity: 0;
                pointer-events: auto;
                min-width: 280px;
                max-width: 400px;
            }
            .toast.visible {
                transform: translateX(0);
                opacity: 1;
            }
            .toast.error { border-left: 4px solid #ef4444; }
            .toast.success { border-left: 4px solid #22c55e; }
            .toast.info { border-left: 4px solid #3b82f6; }
            
            .icon { font-size: 18px; }
            .message { font-size: 14px; color: #1f2937; font-weight: 500; }
            
            /* Loading Spinner */
            .spinner {
                width: 16px; 
                height: 16px; 
                border: 2px solid rgba(0,0,0,0.1); 
                border-top-color: #3b82f6; 
                border-radius: 50%; 
                animation: spin 1s linear infinite;
            }
            @keyframes spin { 100% { transform: rotate(360deg); } }
        `;
        this.shadow.appendChild(style);
    }

    static show(message: string, type: ToastType = 'info', duration = 3000) {
        this.init();

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        let icon = '';
        if (type === 'success') icon = '✅';
        if (type === 'error') icon = '❌';
        if (type === 'info') icon = 'ℹ️';
        if (type === 'loading') icon = '<div class="spinner"></div>';

        // Securely set HTML for icon (safe specific strings) + text for message
        toast.innerHTML = `<span class="icon">${icon}</span><span class="message"></span>`;
        toast.querySelector('.message')!.textContent = message;

        this.shadow!.appendChild(toast);

        // Force reflow
        requestAnimationFrame(() => {
            toast.classList.add('visible');
        });

        if (type !== 'loading') {
            const timer = window.setTimeout(() => {
                this.dismiss(toast);
            }, duration);
            this.toastiTimeouts.push(timer);
        }

        return toast;
    }

    static dismiss(toast: HTMLElement) {
        toast.classList.remove('visible');
        toast.addEventListener('transitionend', () => {
            toast.remove();
        });
    }

    static clear() {
        if (!this.shadow) return;
        const toasts = this.shadow.querySelectorAll('.toast');
        toasts.forEach(t => (t as HTMLElement).remove());
    }
}
