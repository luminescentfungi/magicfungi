// Configuration - Replace these with your actual values
const CONFIG = {
    botToken: '1825940585:AAEJ4QYV25KByQhSeUuoVqqW7CGyxMNP5ss',
    chatId: '524021063'
};

// Get form elements
const form = document.getElementById('messageForm');
const messageText = document.getElementById('messageText');
const submitBtn = document.getElementById('submitBtn');
const statusMessage = document.getElementById('statusMessage');

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
        // Send message to Telegram
        const response = await fetch(`https://api.telegram.org/bot${CONFIG.botToken}/sendMessage`, {
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
        
        const data = await response.json();
        
        if (data.ok) {
            showStatus('Message sent successfully! ✓', 'success');
            messageText.value = ''; // Clear the textarea
        } else {
            showStatus(`Error: ${data.description || 'Failed to send message'}`, 'error');
        }
    } catch (error) {
        showStatus('Network error. Please try again.', 'error');
        console.error('Error:', error);
    } finally {
        submitBtn.classList.remove('loading');
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
