// chat.js - Handle chat functionality

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const user = localStorage.getItem('whatsapp_user');
    if (!user) return;
    
    // Initialize chat functionality
    initChat();
});

function initChat() {
    // Handle sending messages
    document.getElementById('send-message-btn').addEventListener('click', sendMessage);
    document.getElementById('message-text').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Handle image upload
    document.getElementById('send-image-btn').addEventListener('click', function() {
        document.getElementById('image-upload').click();
    });
    
    document.getElementById('image-upload').addEventListener('change', handleImageUpload);
}

function sendMessage() {
    const messageInput = document.getElementById('message-text');
    const messageText = messageInput.value.trim();
    
    if (!messageText) return;
    
    const currentUser = JSON.parse(localStorage.getItem('whatsapp_user'));
    const messagesContainer = document.getElementById('messages');
    
    // Create new message element
    const messageElement = document.createElement('div');
    messageElement.className = 'message sent';
    messageElement.innerHTML = `
        <div class="message-content">
            ${messageText}
            <div class="message-time">${getCurrentTime()}</div>
        </div>
    `;
    
    messagesContainer.appendChild(messageElement);
    messageInput.value = '';
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // In a real app, this would send the message to the backend
    // and then to the recipient in real-time
}

function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(event) {
        const imageUrl = event.target.result;
        const currentUser = JSON.parse(localStorage.getItem('whatsapp_user'));
        const messagesContainer = document.getElementById('messages');
        
        // Create new message element with image
        const messageElement = document.createElement('div');
        messageElement.className = 'message sent';
        messageElement.innerHTML = `
            <div class="message-content">
                <img src="${imageUrl}" alt="Uploaded image" class="message-image">
                <div class="message-time">${getCurrentTime()}</div>
            </div>
        `;
        
        messagesContainer.appendChild(messageElement);
        
        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // In a real app, this would upload the image to your server
        // and then send the message to the recipient
    };
    reader.readAsDataURL(file);
}

function getCurrentTime() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    
    return `${hours}:${minutes} ${ampm}`;
}
