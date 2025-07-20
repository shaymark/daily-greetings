# Daily Greetings - OneSignal Notifications Web App

A beautiful, modern web application that uses OneSignal to send browser notifications. Perfect for sending daily greetings, reminders, or any custom notifications to users.

## Features

- 🎨 **Modern UI/UX**: Clean, responsive design with smooth animations
- 🔔 **OneSignal Integration**: Full browser notification support
- 📱 **Responsive Design**: Works perfectly on desktop and mobile devices
- ⚡ **Quick Actions**: Pre-built notification templates for common greetings
- 📊 **Notification History**: Track all sent notifications
- 🎯 **Custom Notifications**: Send personalized notifications with custom titles, messages, icons, and URLs
- 🔒 **Permission Management**: Automatic permission handling and status indicators

## Prerequisites

Before you can use this app, you'll need:

1. **OneSignal Account**: Sign up at [OneSignal.com](https://onesignal.com)
2. **OneSignal App ID**: Create a new app in OneSignal dashboard
3. **Web Server**: The app needs to be served over HTTPS (or localhost for development)

## Setup Instructions

### 1. Get Your OneSignal App ID

1. Go to [OneSignal Dashboard](https://app.onesignal.com)
2. Create a new app or select an existing one
3. Go to **Settings** → **Keys & IDs**
4. Copy your **OneSignal App ID**

### 2. Configure the App

1. Open `app.js` in your code editor
2. Replace `'YOUR_ONESIGNAL_APP_ID'` with your actual OneSignal App ID:

```javascript
const ONESIGNAL_APP_ID = 'your-actual-app-id-here';
```

3. Replace `'YOUR_ONESIGNAL_REST_API_KEY'` with your actual OneSignal REST API Key:

```javascript
const ONESIGNAL_REST_API_KEY = 'your-rest-api-key-here';
```

#### How to Get Your REST API Key:
1. Go to [OneSignal Dashboard](https://app.onesignal.com)
2. Select your app
3. Go to **Settings** → **Keys & IDs**
4. Copy your **REST API Key** (not the App ID)

### 3. Set Up Your Web Server

#### Option A: Local Development
For local development, you can use any simple HTTP server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server

# Using PHP
php -S localhost:8000
```

#### Option B: Production Deployment
For production, deploy to any web hosting service that supports HTTPS:

- **Netlify**: Drag and drop the folder to Netlify
- **Vercel**: Connect your GitHub repository
- **GitHub Pages**: Push to a GitHub repository
- **AWS S3 + CloudFront**: Static hosting with CDN

### 4. Configure OneSignal Settings

In your OneSignal dashboard:

1. **Web Push Settings**:
   - Set your website URL
   - Configure default notification icon
   - Set up notification settings

2. **Subdomain** (Optional):
   - Create a custom subdomain for your notifications
   - This will make your notifications look more professional

## Usage

### Basic Usage

1. Open the web app in your browser
2. Click "Enable Notifications" when prompted
3. Fill in the notification form:
   - **Title**: The notification title
   - **Message**: The notification body text
   - **Icon URL** (optional): Custom icon for the notification
   - **Click URL** (optional): URL to open when notification is clicked
4. Click "Send Notification"

### Quick Actions

Use the pre-built quick action buttons for common greetings:
- **Good Morning**: Perfect for morning notifications
- **Good Afternoon**: Afternoon greetings
- **Good Evening**: Evening greetings
- **Break Reminder**: Reminder to take breaks

### Notification History

All sent notifications are automatically saved to the history panel, showing:
- Notification title and message
- Timestamp
- Click URL (if provided)

## File Structure

```
daily-greetings/
├── index.html          # Main HTML file
├── styles.css          # CSS styles and animations
├── app.js             # JavaScript with OneSignal integration
└── README.md          # This file
```

## Customization

### Styling

The app uses a modern design with:
- Gradient backgrounds
- Smooth animations
- Responsive grid layout
- Custom scrollbars

You can customize the appearance by modifying `styles.css`.

### Adding More Quick Actions

To add more quick action buttons, edit the HTML in `index.html`:

```html
<button class="action-btn" data-title="Your Title" data-message="Your message">
    <i class="fas fa-icon-name"></i>
    Button Text
</button>
```

### Custom Notification Icons

You can set custom notification icons by:
1. Adding an icon URL in the form
2. Using a publicly accessible image URL
3. Recommended size: 192x192 pixels

## Troubleshooting

### Common Issues

1. **"OneSignal initialization failed"**
   - Check that your App ID is correct
   - Ensure you're serving the app over HTTPS (or localhost)
   - Verify OneSignal SDK is loading properly

2. **"Notifications blocked"**
   - Check browser notification permissions
   - Click "Enable Notifications" button
   - If denied, reset permissions in browser settings

3. **Notifications not showing**
   - Ensure browser supports notifications
   - Check if notifications are enabled in system settings
   - Verify OneSignal dashboard configuration

### Browser Compatibility

This app works with all modern browsers that support:
- Service Workers
- Push API
- Notifications API

Supported browsers:
- Chrome 42+
- Firefox 44+
- Safari 16+
- Edge 17+

## Security Considerations

- Never expose your OneSignal App ID in public repositories
- Use environment variables for production deployments
- Always serve over HTTPS in production
- Validate user inputs before sending notifications

## Contributing

Feel free to contribute to this project by:
- Reporting bugs
- Suggesting new features
- Submitting pull requests
- Improving documentation

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you need help:
1. Check the troubleshooting section above
2. Review OneSignal documentation
3. Open an issue on GitHub
4. Contact OneSignal support for OneSignal-specific issues

---

**Happy notifying! 🎉** 