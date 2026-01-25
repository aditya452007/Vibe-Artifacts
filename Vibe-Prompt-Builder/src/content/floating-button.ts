/// <reference types="chrome" />
import { findChatInput, getInputValue, setInputValue } from './dom-utils';
import { ToastManager } from './toast-manager';

export const createFAB = () => {
    // Check if already exists
    if (document.getElementById('prompt-builder-host')) return;

    const host = document.createElement('div');
    host.id = 'prompt-builder-host';
    document.body.appendChild(host);

    const shadow = host.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = `
    /* Modern Reset for Shadow DOM */
    :host {
      --fab-size: 56px;
      --fab-bg: linear-gradient(135deg, #3B82F6, #8B5CF6);
      --fab-shadow: 0 8px 32px rgba(99, 102, 241, 0.3);
      --fab-color: white;
    }
    
    .fab {
      position: fixed;
      width: var(--fab-size);
      height: var(--fab-size);
      border-radius: 28px; /* Perfectly round or squircle */
      background: var(--fab-bg);
      box-shadow: var(--fab-shadow);
      border: 1px solid rgba(255,255,255,0.1);
      cursor: pointer;
      z-index: 2147483646; /* Just below Toast */
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), 
                  box-shadow 0.2s ease,
                  width 0.3s ease, 
                  border-radius 0.3s ease;
      color: var(--fab-color);
      font-size: 24px;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
      backdrop-filter: blur(8px);
    }
    
    .fab:hover {
      transform: scale(1.05) translateY(-2px);
      box-shadow: 0 12px 40px rgba(99, 102, 241, 0.4);
    }
    
    .fab:active {
      transform: scale(0.92);
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
    }
    
    .fab.dragging {
      transition: none; /* Instant response */
      transform: scale(1.02);
      cursor: grabbing;
    }
    
    .fab.loading {
      animation: pulse 1.5s infinite;
      cursor: wait;
    }

    .fab svg {
      width: 24px;
      height: 24px;
      fill: currentColor;
    }
    
    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.4); }
      70% { box-shadow: 0 0 0 15px rgba(139, 92, 246, 0); }
      100% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0); }
    }
    
    @keyframes spin {
      100% { transform: rotate(360deg); }
    }
  `;
    shadow.appendChild(style);

    const btn = document.createElement('button');
    btn.className = 'fab';
    // Use an icon SVG for better quality
    btn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M7.5 5.6L10 11.2L12.5 5.6L18 8L12.5 10.4L10 16L7.5 10.4L2 8L7.5 5.6M19 19L17.8 16.2L15 15L17.8 13.8L19 11L20.2 13.8L23 15L20.2 16.2L19 19Z"/></svg>`;
    btn.title = 'Enhance Prompt';

    // Initial Position (Bottom Right)
    const margin = 24;
    let currentLeft = window.innerWidth - 80;
    let currentTop = window.innerHeight - 80;

    const setPosition = (x: number, y: number) => {
        btn.style.left = `${x}px`;
        btn.style.top = `${y}px`;
    };
    setPosition(currentLeft, currentTop);

    // Drag Logic
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let initialDragLeft = 0;
    let initialDragTop = 0;

    btn.addEventListener('mousedown', (e) => {
        isDragging = true;
        btn.classList.add('dragging');
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        const rect = btn.getBoundingClientRect();
        initialDragLeft = rect.left;
        initialDragTop = rect.top;
        e.preventDefault(); // Prevent text selection
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        const dx = e.clientX - dragStartX;
        const dy = e.clientY - dragStartY;

        let newX = initialDragLeft + dx;
        let newY = initialDragTop + dy;

        // Boundary Constraints
        const maxLeft = window.innerWidth - 60; // 56 + margin
        const maxTop = window.innerHeight - 60;

        newX = Math.max(margin, Math.min(newX, maxLeft));
        newY = Math.max(margin, Math.min(newY, maxTop));

        setPosition(newX, newY);
    });

    window.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        btn.classList.remove('dragging');

        // Magnetic Snap to nearest edge (Left vs Right)
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const windowCenter = window.innerWidth / 2;

        btn.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'; // Spring effect

        if (centerX < windowCenter) {
            setPosition(margin, rect.top);
        } else {
            setPosition(window.innerWidth - 56 - margin, rect.top);
        }

        // Cleanup transition after snap
        setTimeout(() => {
            btn.style.transition = '';
        }, 400);
    });

    // Resize Observer to keep button on screen
    window.addEventListener('resize', () => {
        const rect = btn.getBoundingClientRect();
        if (rect.right > window.innerWidth) {
            setPosition(window.innerWidth - 56 - margin, rect.top);
        }
        if (rect.bottom > window.innerHeight) {
            setPosition(rect.left, window.innerHeight - 56 - margin);
        }
    });


    // Click Handler (Interaction)
    btn.addEventListener('click', async (e) => {
        if (isDragging) return;

        // Prevent accidental clicks at end of drag
        // (Simple isDragging check usually handles this if logic is correct)

        const input = findChatInput();
        if (!input) {
            ToastManager.show('Click deep inside the chat box first!', 'error');
            return;
        }

        const originalText = getInputValue(input);
        if (!originalText || originalText.trim().length < 2) {
            ToastManager.show('Please type at least a few words.', 'info');
            return;
        }

        btn.classList.add('loading');
        // SVG spinner replacement could go here, or CSS pulse handle it

        try {
            const response = await chrome.runtime.sendMessage({
                type: 'GENERATE_PROMPT',
                payload: { context: originalText }
            });

            if (response && response.result) {
                setInputValue(input, response.result);
                ToastManager.show('Prompt optimized!', 'success');
            } else {
                if (response.error === 'MISSING_API_KEY') {
                    ToastManager.show('Open Extension Settings to add API Key', 'error', 6000);
                } else {
                    ToastManager.show(response.error || 'Optimization failed', 'error');
                }
            }
        } catch (err) {
            // Check if extension context invalidated
            if (chrome.runtime.lastError) {
                ToastManager.show('Extension updated. Please refresh page.', 'error');
            } else {
                ToastManager.show('Network error', 'error');
            }
            console.error(err);
        } finally {
            btn.classList.remove('loading');
        }
    });

    shadow.appendChild(btn);
};
