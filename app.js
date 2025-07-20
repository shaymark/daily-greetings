// OneSignal Configuration
// Replace 'YOUR_ONESIGNAL_APP_ID' with your actual OneSignal App ID
const ONESIGNAL_APP_ID = 'cac1d3e5-aea5-476a-a35d-f3ab9a167f80';
// Replace 'YOUR_ONESIGNAL_REST_API_KEY' with your actual OneSignal REST API Key
const ONESIGNAL_REST_API_KEY = 'os_v2_app_zla5hznouvdwvi256ovzuft7qcilvg7rdwauidue3265qicp4blnzrstqlbopxbsgdvtl4xfskufhrpzfh2n6yntkvrvocqk3ojjrhq';

const SAFARI_WEB_ID = "web.onesignal.auto.017f9378-7499-4b97-8d47-e55f2bb151c0";

// DOM Elements
const statusIndicator = document.getElementById('statusIndicator');
const statusText = document.getElementById('statusText');
const permissionBtn = document.getElementById('permissionBtn');
const sendBtn = document.getElementById('sendBtn');
const testBtn = document.getElementById('testBtn');
const historyList = document.getElementById('historyList');

// Form Elements
const notificationTitle = document.getElementById('notificationTitle');
const notificationMessage = document.getElementById('notificationMessage');
const notificationIcon = document.getElementById('notificationIcon');
const notificationUrl = document.getElementById('notificationUrl');

// Quick Action Buttons
const actionButtons = document.querySelectorAll('.action-btn');


// Initialize OneSignal
async function initializeOneSignal() {
    try {
        // Wait for OneSignal to be available
        let attempts = 0;
        const maxAttempts = 10;
        
        while (typeof OneSignal === 'undefined' && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 500));
            attempts++;
        }
        
        // Check if OneSignal is available
        if (typeof OneSignal === 'undefined') {
            throw new Error('OneSignal SDK not loaded after multiple attempts');
        }

        // Initialize OneSignal
        OneSignal.init({
            appId: ONESIGNAL_APP_ID,
            safari_web_id: SAFARI_WEB_ID,
            notifyButton: {
                enable: false, // We'll use our custom UI
            },
            allowLocalhostAsSecureOrigin: true,
        });

        // Set up event listeners
        OneSignal.on('notificationClick', handleNotificationClick);
        OneSignal.on('notificationDisplay', handleForegroundNotification);
        
        // Add more event listeners for debugging
        OneSignal.on('subscriptionChange', function(isSubscribed) {
            console.log('Subscription changed:', isSubscribed);
        });
        
        OneSignal.on('notificationPermissionChange', function(permissionChange) {
            console.log('Permission changed:', permissionChange);
        });

        // Check permission status
        await checkPermissionStatus();

        // Check if user is already subscribed
        const isSubscribed = await OneSignal.isPushNotificationsEnabled();
        console.log('User is subscribed to OneSignal:', isSubscribed);
        
        if (isSubscribed) {
            const userId = await OneSignal.getUserId();
            console.log('OneSignal User ID:', userId);
            updateStatus('Connected to OneSignal (Subscribed)', 'connected');
        } else {
            updateStatus('Connected to OneSignal (Not subscribed)', 'connected');
        }
        
    } catch (error) {
        console.error('OneSignal initialization failed:', error);
        updateStatus('Failed to connect to OneSignal', 'error');
        showError('OneSignal initialization failed. Please check your App ID and try again.');
    }
}

// Check notification permission status
async function checkPermissionStatus() {
    try {
        let browserPermission;
        let isOneSignalSubscribed = false;
        
        // Check browser permission
        if ('Notification' in window) {
            browserPermission = Notification.permission;
        } else {
            browserPermission = 'unsupported';
        }
        
        // Check OneSignal subscription status
        if (typeof OneSignal !== 'undefined') {
            try {
                isOneSignalSubscribed = await OneSignal.isPushNotificationsEnabled();
            } catch (e) {
                console.log('Could not check OneSignal subscription:', e);
            }
        }
        
        console.log('Browser permission:', browserPermission);
        console.log('OneSignal subscribed:', isOneSignalSubscribed);
        
        if (browserPermission === 'granted' && isOneSignalSubscribed) {
            updateStatus('Notifications enabled', 'connected');
            permissionBtn.style.display = 'none';
            sendBtn.disabled = false;
        } else if (browserPermission === 'denied') {
            updateStatus('Notifications blocked', 'error');
            permissionBtn.style.display = 'block';
            permissionBtn.textContent = 'Notifications Blocked - Enable in Browser';
            sendBtn.disabled = true;
        } else if (browserPermission === 'unsupported') {
            updateStatus('Notifications not supported', 'error');
            permissionBtn.style.display = 'none';
            sendBtn.disabled = true;
        } else {
            // Show enable button if browser permission not granted OR not subscribed to OneSignal
            updateStatus('Permission required', 'error');
            permissionBtn.style.display = 'block';
            permissionBtn.textContent = '🔔 Enable Notifications';
            sendBtn.disabled = true;
        }
    } catch (error) {
        console.error('Error checking permission:', error);
        updateStatus('Error checking permission', 'error');
        // Show button on error too
        permissionBtn.style.display = 'block';
        permissionBtn.textContent = '🔔 Enable Notifications';
    }
}

// Request notification permission
async function requestPermission() {
    try {
        console.log('Requesting notification permission...');
        
        // Use OneSignal's registration method
        if (typeof OneSignal !== 'undefined') {
            // First, request browser permission
            const browserPermission = await Notification.requestPermission();
            console.log('Browser permission:', browserPermission);
            
            if (browserPermission === 'granted') {
                // Then register with OneSignal
                await OneSignal.registerForPushNotifications();
                
                // Wait a moment for OneSignal to process
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Check if subscription was successful
                const isSubscribed = await OneSignal.isPushNotificationsEnabled();
                console.log('OneSignal subscription successful:', isSubscribed);
                
                if (isSubscribed) {
                    const userId = await OneSignal.getUserId();
                    console.log('OneSignal User ID:', userId);
                    
                    updateStatus('Notifications enabled (Subscribed)', 'connected');
                    permissionBtn.style.display = 'none';
                    sendBtn.disabled = false;
                    showSuccess(`Notifications enabled! OneSignal User ID: ${userId}`);
                } else {
                    throw new Error('OneSignal subscription failed');
                }
            } else {
                updateStatus('Permission denied', 'error');
                showError('Notification permission was denied. Please enable it in your browser settings.');
            }
        } else {
            throw new Error('OneSignal not available');
        }
    } catch (error) {
        console.error('Error requesting permission:', error);
        showError(`Failed to request notification permission: ${error.message}`);
    }
}

// Send notification via OneSignal REST API
async function sendNotification(title, message, icon = null, url = null) {
    try {
        sendBtn.disabled = true;
        sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

        // Check if REST API key is configured
        if (ONESIGNAL_REST_API_KEY === 'YOUR_ONESIGNAL_REST_API_KEY') {
            throw new Error('OneSignal REST API Key not configured. Please add your REST API key to app.js');
        }

        // Get current user ID for targeted sending
        let targetUserId = null;
        try {
            const isSubscribed = await OneSignal.isPushNotificationsEnabled();
            if (isSubscribed) {
                targetUserId = await OneSignal.getUserId();
                console.log('Sending to current user:', targetUserId);
            }
        } catch (e) {
            console.log('Could not get current user ID:', e);
        }

        // Create OneSignal notification payload
        const notificationData = {
            app_id: ONESIGNAL_APP_ID,
            headings: {
                en: title
            },
            contents: {
                en: message
            }
        };

        // Target specific user if available, otherwise all subscribers
        if (targetUserId) {
            notificationData.include_player_ids = [targetUserId];
        } else {
            notificationData.included_segments = ['All'];
        }

        // Add icon if provided
        if (icon) {
            notificationData.chrome_web_icon = icon;
            notificationData.firefox_icon = icon;
        }

        // Add click action if URL is provided
        if (url) {
            notificationData.url = url;
        }

        console.log('Sending notification via OneSignal API:', notificationData);

        // Send notification via OneSignal REST API
        const response = await fetch('https://onesignal.com/api/v1/notifications', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${ONESIGNAL_REST_API_KEY}`
            },
            body: JSON.stringify(notificationData)
        });

        const result = await response.json();
        console.log('OneSignal API response:', result);

        if (response.ok && result.id) {
            // Add to history
            addToHistory(title, message, url);
            
            // Show success with notification ID and recipient count
            const recipients = result.recipients || 0;
            showSuccess(`Notification sent successfully! ID: ${result.id}, Recipients: ${recipients}`);
            
            // Show in-app notification as preview
            showInAppNotification(title, message);
            
        } else if (result.errors && result.errors.some(error => error.includes('All included players are not subscribed'))) {
            // Handle the case where there are no subscribers
            showError('No subscribers found! You need users to subscribe to notifications first. Try subscribing yourself by clicking "Enable Notifications" and refreshing the page.');
            
            // Still show in-app notification as preview
            showInAppNotification(title, message);
            
            // Add to history for testing purposes
            addToHistory(title, message + ' (No subscribers)', url);
            
        } else {
            throw new Error(result.errors ? result.errors.join(', ') : 'Failed to send notification');
        }
        
    } catch (error) {
        console.error('Error sending notification:', error);
        
        if (error.message.includes('REST API Key')) {
            showError('OneSignal REST API Key not configured. Check the setup instructions.');
        } else if (error.message.includes('Failed to fetch') || error.message.includes('CORS')) {
            showError('Network error or CORS issue. For production use, you need a backend server to make OneSignal API calls.');
        } else if (error.message.includes('All included players are not subscribed')) {
            showError('No subscribers found! Make sure users have subscribed to notifications first.');
        } else {
            showError(`Failed to send notification: ${error.message}`);
        }
    } finally {
        sendBtn.disabled = false;
        sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Notification';
    }
}

// Handle notification click
function handleNotificationClick(event) {
    const data = event.data;
    
    if (data && data.url) {
        window.open(data.url, '_blank');
    }
}

// Handle foreground notification
function handleForegroundNotification(event) {
    const title = event.title;
    const body = event.body;
    
    // Show a custom in-app notification
    showInAppNotification(title, body);
}

// Show in-app notification
function showInAppNotification(title, message) {
    const notification = document.createElement('div');
    notification.className = 'in-app-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <h4>${title}</h4>
            <p>${message}</p>
        </div>
        <button class="close-btn">&times;</button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border-radius: 10px;
        padding: 15px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 1000;
        max-width: 300px;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.close-btn');
    closeBtn.onclick = () => {
        notification.remove();
    };
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Add notification to history
function addToHistory(title, message, url = null) {
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    
    const time = new Date().toLocaleTimeString();
    
    historyItem.innerHTML = `
        <h4>${title}</h4>
        <p>${message}</p>
        ${url ? `<p><small>URL: ${url}</small></p>` : ''}
        <div class="time">${time}</div>
    `;
    
    // Remove empty state if it exists
    const emptyState = historyList.querySelector('.empty-state');
    if (emptyState) {
        emptyState.remove();
    }
    
    // Add to the beginning of the list
    historyList.insertBefore(historyItem, historyList.firstChild);
    
    // Limit history to 10 items
    const items = historyList.querySelectorAll('.history-item');
    if (items.length > 10) {
        items[items.length - 1].remove();
    }
}

// Update status indicator
function updateStatus(text, status = 'default') {
    statusText.textContent = text;
    statusIndicator.className = `status-indicator ${status}`;
}

// Show success message
function showSuccess(message) {
    showMessage(message, 'success');
}

// Show error message
function showError(message) {
    showMessage(message, 'error');
}

// Show message
function showMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        z-index: 1000;
        font-weight: 500;
        animation: slideInDown 0.3s ease-out;
    `;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing...');
    
    // Initialize OneSignal
    initializeOneSignal();
    
    // Permission button
    permissionBtn.addEventListener('click', requestPermission);
    
    // Send button
    sendBtn.addEventListener('click', () => {
        const title = notificationTitle.value.trim();
        const message = notificationMessage.value.trim();
        const icon = notificationIcon.value.trim() || null;
        const url = notificationUrl.value.trim() || null;
        
        if (!title || !message) {
            showError('Please fill in both title and message fields.');
            return;
        }
        
        sendNotification(title, message, icon, url);
    });
    
    // Test local notification button
    testBtn.addEventListener('click', () => {
        console.log('Testing local notification...');
        console.log('Notification support:', 'Notification' in window);
        console.log('Notification permission:', Notification.permission);
        console.log('Document visibility:', document.visibilityState);
        console.log('Window focus:', document.hasFocus());
        
        if ('Notification' in window) {
            if (Notification.permission === 'granted') {
                try {
                    const notification = new Notification('🔔 Test Notification', {
                        body: 'This is a local browser notification test. If you see this, notifications are working!',
                        icon: '/favicon.svg',
                        tag: 'test-notification',
                        requireInteraction: true, // Keep notification visible longer
                        silent: false
                    });
                    
                    notification.onshow = function() {
                        console.log('✅ Test notification SHOWN successfully');
                    };
                    
                    notification.onerror = function(error) {
                        console.error('❌ Test notification ERROR:', error);
                    };
                    
                    notification.onclick = function() {
                        console.log('Test notification clicked');
                        window.focus();
                        notification.close();
                    };
                    
                    notification.onclose = function() {
                        console.log('Test notification closed');
                    };
                    
                    console.log('Local test notification created');
                    showSuccess('Local test notification created! Check your system notifications.');
                    
                    // Also show an alert as fallback
                    setTimeout(() => {
                        const instructions = `
NOTIFICATION TEST INSTRUCTIONS:

1. MINIMIZE this browser window NOW
2. Wait 5 seconds
3. Look for a notification in your system tray/notification center
4. Come back to this window

Did you see the notification?`;
                        
                        if (confirm(instructions)) {
                            showSuccess('🎉 Great! Notifications are working. OneSignal notifications should work too!');
                        } else {
                            showError(`
❌ Notification not visible. Try these fixes:

🔧 BROWSER: Click the lock icon next to the URL → Set Notifications to "Allow"
🔧 SYSTEM: 
   • macOS: System Preferences → Notifications → Turn off Do Not Disturb
   • Windows: Settings → Focus Assist → Turn off
🔧 TEST: Try a different browser (Chrome/Firefox/Safari)

Then test again!`);
                        }
                    }, 2000);
                    
                } catch (error) {
                    console.error('Error creating notification:', error);
                    showError(`Failed to create notification: ${error.message}`);
                }
            } else if (Notification.permission === 'denied') {
                showError('Notifications are BLOCKED. Please enable them in browser settings: Settings > Privacy & Security > Site Settings > Notifications');
            } else {
                showError('Notification permission not granted. Current permission: ' + Notification.permission);
            }
        } else {
            showError('Browser does not support notifications');
        }
    });
    
    // Quick action buttons
    actionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const title = button.dataset.title;
            const message = button.dataset.message;
            
            notificationTitle.value = title;
            notificationMessage.value = message;
            
            // Focus on the form
            notificationTitle.focus();
        });
    });
    
    // Form validation
    [notificationTitle, notificationMessage].forEach(input => {
        input.addEventListener('input', () => {
            const title = notificationTitle.value.trim();
            const message = notificationMessage.value.trim();
            
            sendBtn.disabled = !title || !message;
        });
    });
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideInDown {
        from {
            transform: translateX(-50%) translateY(-100%);
            opacity: 0;
        }
        to {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
    }
    
    .in-app-notification .notification-content {
        flex: 1;
    }
    
    .in-app-notification .notification-content h4 {
        margin: 0 0 5px 0;
        font-size: 14px;
        font-weight: 600;
    }
    
    .in-app-notification .notification-content p {
        margin: 0;
        font-size: 13px;
        color: #666;
    }
    
    .in-app-notification .close-btn {
        background: none;
        border: none;
        font-size: 18px;
        cursor: pointer;
        color: #999;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .in-app-notification .close-btn:hover {
        color: #666;
    }
`;
document.head.appendChild(style); 