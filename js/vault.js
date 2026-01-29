// js/vault.js

// 1. Load Documents from Mock Data
function loadVault() {
    // const user = auth.currentUser;
    const vaultList = document.getElementById('vaultList');
    vaultList.innerHTML = ""; // Clear list

    // Mock Data
    const mockData = [
        {name: "Mock Aadhaar Card", type: "Identity", url: "#", id: "doc1"},
        {name: "Mock PAN Card", type: "Identity", url: "#", id: "doc2"}
    ];

    mockData.forEach(doc => {
        renderDocItem(doc, doc.id);
    });
}

function renderDocItem(data, id) {
    const list = document.getElementById('vaultList');
    list.innerHTML += `
        <div class="doc-card p-4 flex justify-between items-center shadow-sm mb-3 bg-white">
            <div class="flex items-center space-x-4">
                <span class="material-symbols-rounded text-maroon">description</span>
                <div>
                    <h3 class="font-bold">${data.name}</h3>
                    <p class="text-xs text-gray-400">Type: ${data.type}</p>
                </div>
            </div>
            <button onclick="toggleMenu('${id}')" class="material-symbols-rounded">more_vert</button>
            <div id="${id}" class="hidden absolute bg-white shadow-xl border rounded-lg p-2 z-50 mt-32">
                <button onclick="window.open('${data.url}')" class="block w-full text-left p-2 hover:bg-gray-100">Open</button>
                <button onclick="openShareModal()" class="block w-full text-left p-2 hover:bg-gray-100">Share (Time-Bomb)</button>
                <button onclick="askAI('Summarize ${data.name}')" class="block w-full text-left p-2 font-bold text-red-800">Ask Gemini</button>
            </div>
        </div>
    `;
}

// 2. Time-Bomb Share Link Logic
function generateLink(minutes) {
    // In a real app, this calls a Cloud Function to create a Signed URL with an expiration
    const expiryTime = minutes === 'view' ? "1 View" : `${minutes} Minutes`;
    alert(`Secure "Time-Bomb" link generated! It will expire in ${expiryTime}.`);
    closeShareModal();
}

// Ensure the vault loads
// Mocking auth check by just loading
setTimeout(() => {
    loadVault();
}, 100);

