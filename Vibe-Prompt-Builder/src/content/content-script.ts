import { createFAB } from './floating-button';

console.log('Prompt Builder content script loaded.');

// Initialize FAB
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createFAB);
} else {
    createFAB();
}
