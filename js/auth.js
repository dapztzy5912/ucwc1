// auth.js - Handle authentication (login/register)

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    checkLoginStatus();
    
    // Toggle between login and register forms
    document.getElementById('show-register').addEventListener('click', showRegisterForm);
    document.getElementById('show-login').addEventListener('click', showLoginForm);
    
    // Handle login
    document.getElementById('login-btn').addEventListener('click', handleLogin);
    
    // Handle register
    document.getElementById('register-btn').addEventListener('click', handleRegister);
});

function checkLoginStatus() {
    const user = localStorage.getItem('whatsapp_user');
    if (user) {
        // User is logged in, show main page
        showMainPage(JSON.parse(user));
    }
}

function showRegisterForm(e) {
    e.preventDefault();
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
}

function showLoginForm(e) {
    e.preventDefault();
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
}

function handleLogin() {
    const phone = document.getElementById('login-phone').value.trim();
    
    if (!phone || phone.length > 6) {
        alert('Nomor harus 6 digit atau kurang');
        return;
    }
    
    // In a real app, this would be an API call to your backend
    const users = JSON.parse(localStorage.getItem('whatsapp_users')) || [];
    const user = users.find(u => u.phone === phone);
    
    if (!user) {
        alert('Nomor tidak terdaftar');
        return;
    }
    
    // Save user to localStorage as logged in
    localStorage.setItem('whatsapp_user', JSON.stringify(user));
    
    // Show main page
    showMainPage(user);
}

function handleRegister() {
    const name = document.getElementById('register-name').value.trim();
    const phone = document.getElementById('register-phone').value.trim();
    
    if (!name || !phone) {
        alert('Nama dan nomor harus diisi');
        return;
    }
    
    if (phone.length > 6) {
        alert('Nomor harus 6 digit atau kurang');
        return;
    }
    
    // Check if phone already exists
    const users = JSON.parse(localStorage.getItem('whatsapp_users')) || [];
    const phoneExists = users.some(u => u.phone === phone);
    
    if (phoneExists) {
        alert('Nomor sudah terdaftar');
        return;
    }
    
    // Create new user
    const newUser = {
        id: generateId(),
        name,
        phone,
        bio: '',
        avatar: 'images/default-avatar.png',
        status: 'offline',
        contacts: []
    };
    
    // Save user to "database"
    users.push(newUser);
    localStorage.setItem('whatsapp_users', JSON.stringify(users));
    localStorage.setItem('whatsapp_user', JSON.stringify(newUser));
    
    // Show main page
    showMainPage(newUser);
}

function showMainPage(user) {
    document.getElementById('auth-page').style.display = 'none';
    document.getElementById('main-page').style.display = 'flex';
    
    // Update UI with user info
    document.getElementById('user-name').textContent = user.name;
    document.getElementById('user-avatar').src = user.avatar;
    document.getElementById('profile-name').textContent = user.name;
    document.getElementById('profile-bio').textContent = user.bio || 'No bio';
    document.getElementById('profile-avatar').src = user.avatar;
    
    // Set status
    updateUserStatus(user.status);
    
    // Load chats and contacts
    loadChats();
    loadContacts();
    
    // Initialize tab switching
    initTabs();
}

function updateUserStatus(status) {
    const statusElement = document.getElementById('user-status');
    statusElement.textContent = status === 'online' ? 'Online' : 'Offline';
    statusElement.classList.toggle('online', status === 'online');
}

function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

function initTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Hide all tab contents
            document.querySelectorAll('.tab-content').forEach(content => {
                content.style.display = 'none';
            });
            
            // Show corresponding tab content
            const tabId = this.getAttribute('data-tab') + '-tab';
            document.getElementById(tabId).style.display = 'block';
        });
    });
}

function loadChats() {
    // In a real app, this would load from your backend
    const chatList = document.getElementById('chat-list');
    chatList.innerHTML = '';
    
    // Sample chats - in a real app, these would come from your database
    const sampleChats = [
        {
            id: 'chat1',
            contact: {
                name: 'John Doe',
                phone: '123456',
                avatar: 'images/default-avatar.png',
                status: 'online'
            },
            lastMessage: {
                text: 'Hi there!',
                time: '10:30 AM',
                isRead: true
            }
        },
        {
            id: 'chat2',
            contact: {
                name: 'Jane Smith',
                phone: '654321',
                avatar: 'images/default-avatar.png',
                status: 'offline'
            },
            lastMessage: {
                text: 'Can we meet tomorrow?',
                time: 'Yesterday',
                isRead: false
            }
        }
    ];
    
    sampleChats.forEach(chat => {
        const chatItem = document.createElement('div');
        chatItem.className = 'chat-list-item';
        chatItem.dataset.chatId = chat.id;
        chatItem.innerHTML = `
            <img src="${chat.contact.avatar}" alt="${chat.contact.name}">
            <div class="chat-info">
                <h3>${chat.contact.name}</h3>
                <p>${chat.lastMessage.text}</p>
            </div>
            <div class="chat-time">${chat.lastMessage.time}</div>
        `;
        
        chatItem.addEventListener('click', function() {
            openChat(chat);
        });
        
        chatList.appendChild(chatItem);
    });
}

function openChat(chat) {
    // Show chat window
    document.getElementById('no-chat-selected').style.display = 'none';
    document.getElementById('chat-window').style.display = 'flex';
    
    // Update chat header
    document.getElementById('chat-contact-name').textContent = chat.contact.name;
    document.getElementById('chat-avatar').src = chat.contact.avatar;
    document.getElementById('chat-contact-status').textContent = chat.contact.status === 'online' ? 'Online' : 'Offline';
    
    // Load messages for this chat
    loadMessages(chat.id);
}

function loadMessages(chatId) {
    // In a real app, this would load from your backend
    const messagesContainer = document.getElementById('messages');
    messagesContainer.innerHTML = '';
    
    // Sample messages
    const sampleMessages = [
        {
            id: 'msg1',
            text: 'Hi there!',
            sender: '123456', // Phone number of sender
            time: '10:30 AM',
            type: 'text'
        },
        {
            id: 'msg2',
            text: 'Hello! How are you?',
            sender: 'current-user', // This would be the logged in user's phone
            time: '10:32 AM',
            type: 'text'
        },
        {
            id: 'msg3',
            text: 'images/sample-image.jpg',
            sender: '123456',
            time: '10:33 AM',
            type: 'image',
            caption: 'Check this out!'
        }
    ];
    
    const currentUser = JSON.parse(localStorage.getItem('whatsapp_user'));
    
    sampleMessages.forEach(msg => {
        const isReceived = msg.sender !== currentUser.phone;
        const messageElement = document.createElement('div');
        messageElement.className = `message ${isReceived ? 'received' : 'sent'}`;
        
        if (msg.type === 'text') {
            messageElement.innerHTML = `
                <div class="message-content">
                    ${msg.text}
                    <div class="message-time">${msg.time}</div>
                </div>
            `;
        } else if (msg.type === 'image') {
            messageElement.innerHTML = `
                <div class="message-content">
                    <img src="${msg.text}" alt="Image" class="message-image">
                    ${msg.caption ? `<p>${msg.caption}</p>` : ''}
                    <div class="message-time">${msg.time}</div>
                </div>
            `;
        }
        
        messagesContainer.appendChild(messageElement);
    });
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function loadContacts() {
    // In a real app, this would load from your backend
    const contactList = document.getElementById('contact-list');
    contactList.innerHTML = '';
    
    // Sample contacts - in a real app, these would come from your database
    const sampleContacts = [
        {
            id: 'contact1',
            name: 'John Doe',
            phone: '123456',
            avatar: 'images/default-avatar.png',
            status: 'online'
        },
        {
            id: 'contact2',
            name: 'Jane Smith',
            phone: '654321',
            avatar: 'images/default-avatar.png',
            status: 'offline'
        },
        {
            id: 'contact3',
            name: 'Mike Johnson',
            phone: '112233',
            avatar: 'images/default-avatar.png',
            status: 'online'
        }
    ];
    
    sampleContacts.forEach(contact => {
        const contactItem = document.createElement('div');
        contactItem.className = 'contact-list-item';
        contactItem.dataset.contactId = contact.id;
        contactItem.innerHTML = `
            <img src="${contact.avatar}" alt="${contact.name}">
            <div class="contact-info">
                <h3>${contact.name}</h3>
                <p>${contact.phone}</p>
            </div>
        `;
        
        contactItem.addEventListener('click', function() {
            viewContact(contact);
        });
        
        contactList.appendChild(contactItem);
    });
}

function viewContact(contact) {
    // In a real app, this would show a contact details view
    alert(`Viewing contact: ${contact.name}\nPhone: ${contact.phone}`);
}
