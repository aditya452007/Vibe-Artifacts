/**
 * DOM Utilities for robustly interacting with modern AI Chat Interfaces.
 * Handles React/Vue virtual DOM limitations by dispatching native events.
 */

export const findChatInput = (): HTMLTextAreaElement | HTMLDivElement | null => {
    // Strategy 1: Check focused element (Most reliable for "User Intent")
    const active = document.activeElement;
    if (active && (
        active.tagName === 'TEXTAREA' ||
        (active.tagName === 'DIV' && active.getAttribute('contenteditable') === 'true')
    )) {
        return active as HTMLTextAreaElement | HTMLDivElement;
    }

    // Strategy 2: Specific High-Signal Selectors (Updated for 2025)
    // Ordered by specificity/popularity
    const selectors = [
        // ChatGPT
        '#prompt-textarea',
        '[data-id="root"]',

        // Claude
        '[contenteditable="true"].ProseMirror',
        'fieldset textarea',

        // Gemini
        'rich-textarea > div[contenteditable="true"]',

        // Generic/Fallback
        'textarea[placeholder*="Ask"]',
        'textarea[placeholder*="Message"]',
        'textarea[placeholder*="Send"]',
        'footer textarea',
        'div[role="textbox"]'
    ];

    for (const selector of selectors) {
        const el = document.querySelector(selector);
        if (el) return el as HTMLTextAreaElement | HTMLDivElement;
    }

    return null;
};

export const getInputValue = (el: HTMLTextAreaElement | HTMLDivElement): string => {
    if (el.tagName === 'TEXTAREA') {
        return (el as HTMLTextAreaElement).value;
    }
    // ContentEditable handling (cleaner text extraction)
    return (el as HTMLDivElement).innerText; // innerText preserves newlines better than textContent
};

export const setInputValue = (el: HTMLTextAreaElement | HTMLDivElement, value: string) => {
    // Focus first to ensure events fire on correct target
    el.focus();

    if (el.tagName === 'TEXTAREA') {
        const textarea = el as HTMLTextAreaElement;

        // React/Angular often swallows value setters unless prototype is used
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")?.set;
        if (nativeInputValueSetter) {
            nativeInputValueSetter.call(textarea, value);
        } else {
            textarea.value = value;
        }
    } else {
        // ContentEditable
        (el as HTMLDivElement).innerText = value;
    }

    // Dispatch comprehensive event sequence to trigger Framework listeners
    const events = ['input', 'change', 'keydown', 'keyup', 'blur'];
    events.forEach(eventType => {
        el.dispatchEvent(new Event(eventType, { bubbles: true, cancelable: true }));
    });
};
