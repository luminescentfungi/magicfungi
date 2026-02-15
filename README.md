# Telegram Message Sender

A simple, elegant web page that allows users to send messages directly to a Telegram bot. Perfect for contact forms, feedback collection, or anonymous messaging.

## 🌟 Features

- Clean, modern interface
- Responsive design (works on mobile and desktop)
- Real-time message sending to Telegram
- Loading states and success/error feedback
- No backend required - runs entirely on GitHub Pages

## 🚀 Setup Instructions

### Step 1: Create a Telegram Bot

1. Open Telegram and search for `@BotFather`
2. Start a chat and send `/newbot`
3. Follow the instructions to create your bot
4. Copy the **bot token** you receive (looks like: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

### Step 2: Get Your Chat ID

You need to know where to send the messages. You have two options:

#### Option A: Send to yourself
1. Search for `@userinfobot` on Telegram
2. Start a chat with it
3. It will reply with your **chat ID** (a number like: `123456789`)

#### Option B: Send to a channel
1. Create a Telegram channel
2. Add your bot as an administrator to the channel
3. Send a message to the channel
4. Go to: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
5. Look for the `"chat":{"id":` field in the response (will be negative for channels, like: `-1001234567890`)

### Step 3: Configure the Website

1. Open `script.js` in your code editor
2. Replace the configuration values:

```javascript
const CONFIG = {
    botToken: '123456789:ABCdefGHIjklMNOpqrsTUVwxyz',  // Your bot token from BotFather
    chatId: '123456789'  // Your chat ID or channel ID
};
```

### Step 4: Deploy to GitHub Pages

1. Create a new GitHub repository
2. Upload all the files:
   - `index.html`
   - `style.css`
   - `script.js`
   - `README.md` (this file)
3. Go to repository Settings → Pages
4. Under "Source", select the main branch
5. Click Save
6. Your site will be live at: `https://yourusername.github.io/repository-name/`

## 📁 File Structure

```
your-repo/
│
├── index.html      # Main HTML file
├── style.css       # Styling
├── script.js       # JavaScript logic
└── README.md       # This file
```

## 🎨 Customization

### Change Colors

Edit `style.css` to modify the color scheme. The main gradient is defined in:

```css
body {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

button {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### Change Text

Edit `index.html` to modify the page title, heading, or placeholder text.

## 🔒 Security Notes

⚠️ **Important**: The bot token is visible in the client-side code. This means anyone can see it in your JavaScript file. For better security:

- Only use this bot for non-sensitive operations
- Limit the bot's permissions in Telegram
- Consider using a server-side solution for sensitive applications
- You can restrict who can send messages by implementing additional checks

## 🐛 Troubleshooting

### Messages not sending?

1. Check that your bot token is correct
2. Verify your chat ID is correct
3. Make sure your bot has permission to send messages to the chat/channel
4. Check the browser console (F12) for error messages

### Bot not responding?

- Make sure you've started a conversation with your bot (send `/start`)
- If using a channel, ensure the bot is added as an admin

## 📝 License

Free to use and modify as you wish!

## 🤝 Contributing

Feel free to fork and improve this project!

---

Made with ❤️ for simple Telegram integrations
