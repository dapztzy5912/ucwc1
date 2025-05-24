// profile.js - Handle profile functionality

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const user = localStorage.getItem('whatsapp_user');
    if (!user) return;
    
    // Initialize profile functionality
    initProfile();
});

function initProfile() {
    // Handle edit profile button
    document.getElementById('edit-profile-btn').addEventListener('click', showEditProfileModal);
    
    // Handle modal close buttons
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
    
    // Handle profile form submission
    document.getElementById('profile-form').addEventListener('submit', function(e) {
        e.preventDefault();
        saveProfileChanges();
    });
}

function showEditProfileModal() {
    const user = JSON.parse(localStorage.getItem('whatsapp_user'));
    
    // Fill form with current user data
    document.getElementById('edit-name').value = user.name;
    document.getElementById('edit-bio').value = user.bio || '';
    
    // Show modal
    document.getElementById('edit-profile-modal').style.display = 'flex';
}

function saveProfileChanges() {
    const name = document.getElementById('edit-name').value.trim();
    const bio = document.getElementById('edit-bio').value.trim();
    const avatarFile = document.getElementById('edit-avatar').files[0];
    
    if (!name) {
        alert('Name is required');
        return;
    }
    
    const currentUser = JSON.parse(localStorage.getItem('whatsapp_user'));
    
    // Update user data
    currentUser.name = name;
    currentUser.bio = bio;
    
    // Handle avatar upload if a file was selected
    if (avatarFile) {
        const reader = new FileReader();
        reader.onload = function(event) {
            currentUser.avatar = event.target.result;
            updateUserProfile(currentUser);
        };
        reader.readAsDataURL(avatarFile);
    } else {
        updateUserProfile(currentUser);
    }
}

function updateUserProfile(user) {
    // Update user in localStorage
    localStorage.setItem('whatsapp_user', JSON.stringify(user));
    
    // Update users "database"
    const users = JSON.parse(localStorage.getItem('whatsapp_users')) || [];
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
        users[userIndex] = user;
        localStorage.setItem('whatsapp_users', JSON.stringify(users));
    }
    
    // Update UI
    document.getElementById('user-name').textContent = user.name;
    document.getElementById('user-avatar').src = user.avatar;
    document.getElementById('profile-name').textContent = user.name;
    document.getElementById('profile-bio').textContent = user.bio || 'No bio';
    document.getElementById('profile-avatar').src = user.avatar;
    
    // Close modal
    document.getElementById('edit-profile-modal').style.display = 'none';
    document.getElementById('profile-form').reset();
}
