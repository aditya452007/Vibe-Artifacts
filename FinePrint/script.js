// FinePrint Logic - Premium & Secure

// State Management
const sections = {
    choice: document.getElementById('choice-screen'),
    url: document.getElementById('url-input-screen'),
    text: document.getElementById('text-input-screen'),
    analysis: document.getElementById('analysis'),
    results: document.getElementById('results'),
    error: document.getElementById('error-state') // New State
};

let currentMode = 'choice';

// Inputs
const urlInput = document.getElementById('urlInput');
const textInput = document.getElementById('textInput');

// Transition Helper
function switchState(stateName) {
    // Hide all
    Object.values(sections).forEach(sec => sec.classList.remove('active'));

    // Show target
    setTimeout(() => {
        sections[stateName].classList.add('active');
        currentMode = stateName;
    }, 120);
}

// Flow Logics
function startFlow(type) {
    if (type === 'url') switchState('url');
    if (type === 'text') switchState('text');
    if (type === 'choice') switchState('choice');
}

function goBack() {
    switchState('choice');
}

// Actions
document.getElementById('scanUrlBtn').addEventListener('click', () => {
    const val = urlInput.value.trim();
    if (!val) return shakeInput(urlInput);
    performAudit('url', val);
});

document.getElementById('scanTextBtn').addEventListener('click', () => {
    const val = textInput.value.trim();
    if (!val) return shakeInput(textInput);
    performAudit('text', val);
});

document.getElementById('resetButton').addEventListener('click', () => {
    urlInput.value = '';
    textInput.value = '';
    switchState('choice');
});

function shakeInput(el) {
    el.style.transform = "translateX(5px)";
    setTimeout(() => el.style.transform = "translateX(-5px)", 50);
    setTimeout(() => el.style.transform = "translateX(5px)", 100);
    setTimeout(() => el.style.transform = "none", 150);
    el.style.borderColor = "var(--danger)";
    setTimeout(() => el.style.borderColor = "", 2000);
}

// API Call
async function performAudit(type, content) {
    switchState('analysis');

    const apiKey = localStorage.getItem('fp_api_key');
    const provider = localStorage.getItem('fp_provider') || 'gemini';

    try {
        const response = await fetch('/api/audit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey || '',
                'x-model-provider': provider
            },
            body: JSON.stringify({ type, content })
        });

        const data = await response.json();

        if (!response.ok) {
            // Pass the specific error code/message to the catch block
            const error = new Error(data.message || data.error || "Analysis Failed");
            error.code = data.error; // Attach code if available
            throw error;
        }

        renderResults(data);
        switchState('results');

    } catch (e) {
        console.error(e);
        let title = "Access Limited";
        let msg = e.message || "We couldn't process this request.";

        // Handle Specific Error Codes
        if (e.code === "API_KEY_MISSING") {
            title = "Configuration Needed";
            msg = "Please provide your API Key to continue analysis.";
            setTimeout(() => openConfig(), 1500); // Auto open settings after short delay
        }
        else if (e.code === "RATE_LIMIT") {
            title = "High Traffic";
            msg = "Our advanced AI is currently at maximum capacity. Please try again in a minute.";
        }
        else if (e.code === "AI_GENERATION_FAILED") {
            title = "System Pause";
            msg = "The AI engine encountered a temporary glitch. Please retry.";
        }
        else if (msg.includes('Failed to scrape') || msg.includes('blocked')) {
            title = "Unable to Fetch URL";
            msg = "Unable to fetch the content. Please copy the data manually.";
        }

        // Update UI
        document.querySelector('#error-state h2').textContent = title;
        document.getElementById('errorMessage').textContent = msg;
        switchState('error');
    }
}

function renderResults(data) {
    const verdictArea = document.getElementById('finalVerdictArea');
    const verdictSummary = document.getElementById('verdictSummary');

    // Clear previous
    verdictArea.innerHTML = '';
    verdictSummary.innerHTML = '';
    document.getElementById('highRiskContainer').querySelector('.list').innerHTML = '';
    document.getElementById('medRiskContainer').querySelector('.list').innerHTML = '';
    document.getElementById('lowRiskContainer').querySelector('.list').innerHTML = '';

    // 1. Render Verdict Stamp
    const verdict = data.action_verdict || "Review"; // Accept / Refuse
    const isSafe = verdict.toLowerCase() === 'accept';

    verdictArea.innerHTML = `
        <div class="stamp ${isSafe ? 'stamp-approve' : 'stamp-deny'}">
            ${verdict}
        </div>
    `;

    // 2. Render Summary
    verdictSummary.textContent = data.verdict_summary || "Analysis complete.";

    // 3. Render Risk Lists
    const risks = data.risk_breakdown || { high: [], medium: [], low: [] };

    populateList('highRiskContainer', risks.high, '⚠️');
    populateList('medRiskContainer', risks.medium, '✋');
    populateList('lowRiskContainer', risks.low, '✅');
}



function populateList(containerId, items, icon) {
    const container = document.getElementById(containerId);
    if (!container) return; // Guard
    const list = container.querySelector('.list');

    if (!items || items.length === 0) {
        container.style.display = 'none';
        return;
    }

    container.style.display = 'block'; // Show if has items

    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'flag-item';
        div.innerHTML = `
            <span class="flag-icon">${icon}</span>
            <span class="flag-text"><strong>${item.category}:</strong> ${item.text}</span>
        `;
        list.appendChild(div);
    });
}


// --- CONFIGURATION / MODAL LOGIC ---

const configModal = document.getElementById('configModal');
const modelSelect = document.getElementById('modelProvider');
const keyInput = document.getElementById('apiKeyInput');

// Open Modal
document.getElementById('configBtn').addEventListener('click', () => {
    openConfig();
});

// Close Modal / Cancel
document.getElementById('cancelConfigBtn').addEventListener('click', () => {
    configModal.classList.remove('active');
});

// Save
document.getElementById('saveConfigBtn').addEventListener('click', () => {
    const provider = modelSelect.value;
    const key = keyInput.value.trim();

    if (!key) {
        shakeInput(keyInput);
        return;
    }

    localStorage.setItem('fp_provider', provider);
    localStorage.setItem('fp_api_key', key);

    configModal.classList.remove('active');

    // Resume flow if needed, or just notify?
    // If we were in error state due to missing key, maybe retry?
    if (currentMode === 'error') {
        // Just go back to choice to let them try again fresh
        switchState('choice');
    }
});

function openConfig() {
    // Load current
    modelSelect.value = localStorage.getItem('fp_provider') || 'gemini';
    keyInput.value = localStorage.getItem('fp_api_key') || '';

    configModal.classList.add('active');
}

// On Load Check
window.addEventListener('DOMContentLoaded', () => {
    // Optional: First time visit check?
    // If no key found, maybe show a little dot on the settings gear?
});
