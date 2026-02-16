// Configuration - Replace these with your actual values
const CONFIG = {
    botToken: '1825940585:AAEJ4QYV25KByQhSeUuoVqqW7CGyxMNP5ss',
    chatId: '524021063',
    thoughtsApi: 'https://shrill-recipe-2ecb.msalichs92.workers.dev/'
};

// Get form elements
const form = document.getElementById('messageForm');
const messageText = document.getElementById('messageText');
const submitBtn = document.getElementById('submitBtn');
const statusMessage = document.getElementById('statusMessage');
const viewMapBtn = document.getElementById('viewMapBtn');
const mapModal = document.getElementById('mapModal');
const closeMapBtn = document.getElementById('closeMapBtn');

let map = null;
let markersLayer = null;

// Load thoughts from JSON API
async function loadThoughtsJson() {
    try {
        let res = await fetch(CONFIG.thoughtsApi);
        if (!res.ok) {
            return {};
        }
        let data = await res.json();
        console.log("Thoughts JSON data:", data);
        return data;
    } catch (e) {
        console.error("Error fetching JSON:", e);
        return {};
    }
}

// Save thoughts to JSON API
async function saveThoughtsJson(thoughtsObj) {
    try {
        const res = await fetch(CONFIG.thoughtsApi, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(thoughtsObj)
        });
        if (!res.ok) {
            throw new Error("Failed to save JSON");
        }
        console.log("Thoughts saved successfully");
    } catch (e) {
        console.error("Error saving JSON:", e);
        throw e;
    }
}

// Get user's current location
// Get user's current location with better mobile support
function getCurrentLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by your browser'));
            return;
        }
        
        const options = {
            enableHighAccuracy: true,
            timeout: 10000, // 10 seconds
            maximumAge: 0
        };
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
            },
            (error) => {
                console.warn('Geolocation error:', error);
                // Fallback to approximate location or use 0,0
                resolve({ latitude: 0, longitude: 0 });
            },
            options
        );
    });
}

// Handle form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const message = messageText.value.trim();
    
    if (!message) {
        showStatus('Please enter a message', 'error');
        return;
    }
    
    // Check if configuration is set
    if (CONFIG.botToken === 'YOUR_BOT_TOKEN_HERE' || CONFIG.chatId === 'YOUR_CHAT_ID_HERE') {
        showStatus('Please configure your bot token and chat ID in script.js', 'error');
        return;
    }
    
    // Show loading state
    submitBtn.classList.add('loading');
    hideStatus();
    
    try {
        // Get current location
        let location;
        try {
            location = await getCurrentLocation();
        } catch (locationError) {
            console.warn('Could not get location:', locationError);
            // Use default location if geolocation fails
            location = { latitude: 0, longitude: 0 };
        }
        
        // Send message to Telegram
        const telegramResponse = await fetch(`https://api.telegram.org/bot${CONFIG.botToken}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: CONFIG.chatId,
                text: message,
                parse_mode: 'HTML'
            })
        });
        
        const telegramData = await telegramResponse.json();
        
        if (!telegramData.ok) {
            throw new Error(telegramData.description || 'Failed to send message to Telegram');
        }
        
        // Save thought to JSON with location as key
        const locationKey = `${location.latitude},${location.longitude}`;
        const thoughtsObj = await loadThoughtsJson();
        
        // Add new thought
        thoughtsObj[locationKey] = message;
        
        // Save updated thoughts
        await saveThoughtsJson(thoughtsObj);
        
        showStatus('Message sent and saved successfully! ✓', 'success');
        messageText.value = ''; // Clear the textarea
        
    } catch (error) {
        showStatus(`Error: ${error.message}`, 'error');
        console.error('Error:', error);
    } finally {
        submitBtn.classList.remove('loading');
    }
});

// Initialize map
function initMap() {
    if (map) {
        return; // Map already initialized
    }
    
    // Create map centered on world view
    map = L.map('map').setView([20, 0], 2);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);
    
    // Create a layer group for markers
    markersLayer = L.layerGroup().addTo(map);
}

// Load and display thoughts on map
async function displayThoughtsOnMap() {
    // Initialize map if not already done
    initMap();
    
    // Clear existing markers
    markersLayer.clearLayers();
    
    // Load thoughts
    const thoughtsObj = await loadThoughtsJson();
    const entries = Object.entries(thoughtsObj);
    
    if (entries.length === 0) {
        showStatus('No thoughts to display yet', 'error');
        return;
    }
    
    // Add markers for each thought
    const bounds = [];
    entries.forEach(([locationKey, thought]) => {
        const [lat, lng] = locationKey.split(',').map(Number);
        
        if (isNaN(lat) || isNaN(lng)) {
            return;
        }
        
        const marker = L.marker([lat, lng]).addTo(markersLayer);
        marker.bindPopup(`
            <div style="max-width: 200px;">
                <strong>Thought:</strong><br>
                ${thought}
            </div>
        `);
        
        bounds.push([lat, lng]);
    });
    
    // Fit map to show all markers
    if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [50, 50] });
    }
}

// View map button click
viewMapBtn.addEventListener('click', async () => {
    mapModal.classList.add('show');
    
    // Small delay to ensure modal is visible before initializing map
    setTimeout(async () => {
        await displayThoughtsOnMap();
        // Force map to recalculate size
        if (map) {
            map.invalidateSize();
        }
    }, 100);
});

// Close map button click
closeMapBtn.addEventListener('click', () => {
    mapModal.classList.remove('show');
});

// Close modal when clicking outside
mapModal.addEventListener('click', (e) => {
    if (e.target === mapModal) {
        mapModal.classList.remove('show');
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mapModal.classList.contains('show')) {
        mapModal.classList.remove('show');
    }
});

// Show status message
function showStatus(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = `status-message show ${type}`;
}

// Hide status message
function hideStatus() {
    statusMessage.classList.remove('show');
}

// Auto-hide status message after 5 seconds
statusMessage.addEventListener('transitionend', () => {
    if (statusMessage.classList.contains('show')) {
        setTimeout(() => {
            hideStatus();
        }, 5000);
    }
});
