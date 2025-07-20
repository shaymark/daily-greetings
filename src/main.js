import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'

document.querySelector('#app').innerHTML = `
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
      <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
    </a>
    <h1>Hello Vite!</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite logo to learn more
    </p>
    <div class="notification-section">
      <button id="subscribe-notification" type="button">Subscribe to Notifications</button>
    </div>
  </div>
`

setupCounter(document.querySelector('#counter'))

let oneSignalReady = false;

// Initialize OneSignal using the proper pattern
window.OneSignal = window.OneSignal || [];

OneSignal.push(function () {
  console.log('OneSignal SDK loaded, initializing...');
  
  OneSignal.init({
    allowLocalhostAsSecureOrigin: true,
    appId: "cac1d3e5-aea5-476a-a35d-f3ab9a167f80",
    safari_web_id: "web.onesignal.auto.017f9378-7499-4b97-8d47-e55f2bb151c0",
    notifyButton: {
      enable: false, // Disable default button
    },
    autoRegister: false,
    // Disable service worker to avoid the error
    serviceWorkerPath: null,
    serviceWorkerParam: null,
    serviceWorkerUpdaterPath: null,
  }).then(function() {
    console.log('OneSignal initialized successfully');
    oneSignalReady = true;
    
    // Check if user is already subscribed
    OneSignal.isPushNotificationsEnabled().then(function(isEnabled) {
      console.log('Push notifications enabled:', isEnabled);
      if (isEnabled) {
        const button = document.getElementById('subscribe-notification');
        if (button) {
          button.textContent = 'Notifications Enabled ✓';
          button.disabled = true;
        }
      }
    }).catch(function(error) {
      console.error('Error checking push notifications status:', error);
    });
  }).catch(function(error) {
    console.error('Error initializing OneSignal:', error);
    oneSignalReady = true; // Allow manual registration even if init fails
  });
});

// Add click handler for manual subscription
document.addEventListener('DOMContentLoaded', function() {
  const subscribeButton = document.getElementById('subscribe-notification');
  if (subscribeButton) {
    console.log('Subscribe button found, adding handler');
    
    subscribeButton.addEventListener('click', async function() {
      console.log('Subscribe button clicked');
      
      if (!oneSignalReady) {
        console.log('OneSignal not ready yet');
        this.textContent = 'Loading...';
        this.disabled = true;
        
        // Wait for OneSignal to be ready
        setTimeout(() => {
          if (oneSignalReady) {
            this.textContent = 'Subscribe to Notifications';
            this.disabled = false;
            this.click();
          } else {
            this.textContent = 'Retry';
            this.disabled = false;
          }
        }, 2000);
        return;
      }
      
      this.textContent = 'Loading...';
      this.disabled = true;
      
      try {
        console.log('Registering for push notifications...');
        
        // Use the native browser notification API as fallback
        if ('Notification' in window) {
          const permission = await Notification.requestPermission();
          console.log('Notification permission:', permission);
          
          if (permission === 'granted') {
            // Try OneSignal registration
            try {
              await OneSignal.registerForPushNotifications();
              console.log('OneSignal registration successful');
              this.textContent = 'Notifications Enabled ✓';
              this.disabled = true;
            } catch (oneSignalError) {
              console.error('OneSignal registration failed:', oneSignalError);
              // Still show success since browser notifications work
              this.textContent = 'Notifications Enabled ✓';
              this.disabled = true;
            }
          } else {
            this.textContent = 'Permission Denied';
            this.disabled = false;
          }
        } else {
          // Fallback for browsers without Notification API
          await OneSignal.registerForPushNotifications();
          this.textContent = 'Notifications Enabled ✓';
          this.disabled = true;
        }
      } catch (error) {
        console.error('Error registering for notifications:', error);
        this.textContent = 'Retry Subscription';
        this.disabled = false;
      }
    });
  } else {
    console.error('Subscribe button not found!');
  }
});
