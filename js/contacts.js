// contacts.js - Handle contacts functionality

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const user = localStorage.getItem('whatsapp_user');
    if (!user) return;
    
    // Initialize contacts functionality
    initContacts();
});

function initContacts() {
    // Handle add contact button
    document.getElementById('add-contact-btn').addEventListener('click', showAddContactModal);
    
    // Handle modal close buttons
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
    
    // Handle add contact form submission
    document.getElementById('contact-form').addEventListener('submit', function(e) {
        e.preventDefault();
        addNewContact();
    });
}

function showAddContactModal() {
    document.getElementById('add-contact-modal').style.display = 'flex';
}

function addNewContact() {
    const name = document.getElementById('contact-name').value.trim();
    const phone = document.getElementById('contact-phone').value.trim();
    
    if (!name || !phone) {
        alert('Name and phone number are required');
        return;
    }
    
    if (phone.length > 6) {
        alert('Phone number must be 6 digits or less');
        return;
    }
    
    const currentUser = JSON.parse(localStorage.getItem('whatsapp_user'));
    
    // Check if contact already exists
    const contactExists = currentUser.contacts.some(c => c.phone === phone);
    if (contactExists) {
        alert('This contact already exists');
        return;
    }
    
    // Add new contact
    const newContact = {
        id: generateId(),
        name,
        phone,
        avatar: 'images/default-avatar.png',
        status: 'offline'
    };
    
    currentUser.contacts.push(newContact);
    
    // Update user in localStorage
    localStorage.setItem('whatsapp_user', JSON.stringify(currentUser));
    
    // Update users "database"
    const users = JSON.parse(localStorage.getItem('whatsapp_users')) || [];
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
        localStorage.setItem('whatsapp_users', JSON.stringify(users));
    }
    
    // Reload contacts list
    loadContacts();
    
    // Close modal and reset form
    document.getElementById('add-contact-modal').style.display = 'none';
    document.getElementById('contact-form').reset();
}

function generateId() {
    return Math.random().toString(36).substr(2, 9);
}
