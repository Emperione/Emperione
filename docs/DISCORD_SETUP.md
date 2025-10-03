# Discord Bot Setup Guide

Complete guide to creating and configuring your Discord bot for Emperione.

## 📋 Table of Contents

- [Creating a Discord Application](#creating-a-discord-application)
- [Configuring the Bot](#configuring-the-bot)
- [Setting Up Intents](#setting-up-intents)
- [Generating OAuth2 URL](#generating-oauth2-url)
- [Inviting the Bot](#inviting-the-bot)
- [Verification](#verification)

---

## Creating a Discord Application

### 1. Access Discord Developer Portal

Visit [Discord Developer Portal](https://discord.com/developers/applications)

### 2. Create New Application

1. Click **"New Application"**
2. Enter name: **"Emperione"** (or your preferred name)
3. Click **"Create"**

### 3. Note Application Details

From the **General Information** page, save:
- **Application ID** (This is your `DISCORD_CLIENT_ID`)
- **Public Key**

---

## Configuring the Bot

### 1. Create Bot User

1. Navigate to **"Bot"** section in left sidebar
2. Click **"Add Bot"**
3. Click **"Yes, do it!"**

### 2. Configure Bot Settings

**Username**: Set your bot's display name

**Icon**: Upload a bot avatar (optional)

**Public Bot**: ✅ Enable (allows others to invite)

**Requires OAuth2 Code Grant**: ❌ Disable

### 3. Get Bot Token

1. Under **"TOKEN"** section, click **"Reset Token"**
2. Click **"Yes, do it!"**
3. **Copy the token** (This is your `DISCORD_BOT_TOKEN`)
   
⚠️ **Important**: Never share this token! It provides full access to your bot.

---

## Setting Up Intents

Intents allow your bot to receive specific events from Discord.

### Required Intents

Navigate to **"Bot"** → **"Privileged Gateway Intents"**

Enable these intents:

1. ✅ **Presence Intent**
   - Required for: Member status tracking
   - Use case: Activity analytics

2. ✅ **Server Members Intent**  
   - Required for: Member join/leave events
   - Use case: Member management, growth tracking

3. ✅ **Message Content Intent**
   - Required for: Reading message content
   - Use case: Moderation, sentiment analysis

Click **"Save Changes"**

---

## Generating OAuth2 URL

### 1. Navigate to OAuth2

Go to **"OAuth2"** → **"URL Generator"**

### 2. Select Scopes

Check these scopes:
- ✅ `bot` - Required for bot functionality
- ✅ `applications.commands` - Required for slash commands

### 3. Select Permissions

Under **"Bot Permissions"**, select:

**General Permissions:**
- ✅ Read Messages/View Channels

**Text Permissions:**
- ✅ Send Messages
- ✅ Send Messages in Threads
- ✅ Manage Messages
- ✅ Embed Links
- ✅ Attach Files
- ✅ Read Message History
- ✅ Add Reactions
- ✅ Use External Emojis

**Moderation Permissions:**
- ✅ Kick Members
- ✅ Ban Members
- ✅ Timeout Members
- ✅ Manage Roles (if using role management)

**Advanced Permissions** (optional):
- ✅ Administrator (⚠️ Use with caution - grants all permissions)

### 4. Copy Generated URL

Copy the generated URL at the bottom of the page.

Example:
```
https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=1234567890&scope=bot%20applications.commands
```

---

## Inviting the Bot

### 1. Open OAuth2 URL

Paste the generated URL into your browser

### 2. Select Server

Choose the server where you want to add the bot

**Requirements:**
- You must have **"Manage Server"** permission
- Server must not have reached bot limit (250 bots)

### 3. Authorize Bot

1. Review permissions
2. Click **"Authorize"**
3. Complete CAPTCHA if prompted

### 4. Confirmation

You should see: **"Authorized"**

The bot will now appear in your server's member list (offline until started).

---

## OAuth2 Configuration

For dashboard authentication, you'll need OAuth2 credentials.

### 1. Get Client Secret

1. Go to **"OAuth2"** → **"General"**
2. Under **"CLIENT SECRET"**, click **"Reset Secret"**
3. Copy the secret (This is your `DISCORD_CLIENT_SECRET`)

### 2. Add Redirect URIs

1. In **"Redirects"** section, click **"Add Redirect"**
2. Add: `http://localhost:3000/auth/callback` (development)
3. For production, add your production URL: `https://yourdomain.com/auth/callback`
4. Click **"Save Changes"**

---

## Verification

### 1. Check Bot in Server

- Open Discord
- Navigate to your server
- Bot should appear in member list (offline)

### 2. Test Bot Connection

After starting the bot (see [Setup Guide](SETUP.md)):
- Bot status should change to online (green dot)
- Try a slash command: `/stats`

### 3. Verify Permissions

Test bot can:
- Read messages
- Send messages
- React to messages
- Access member list

---

## Slash Commands

Slash commands are automatically registered when the bot starts.

### Command Registration

Commands are registered in: `bot/src/commands/`

They will appear in Discord after:
1. Bot is online
2. Initial connection is established
3. Commands are deployed (automatic)

**Note**: Global commands can take up to 1 hour to propagate. Guild-specific commands are instant.

---

## Common Issues

### Bot Appears Offline

**Causes:**
- Bot token is incorrect
- Bot process is not running
- Network connectivity issues

**Solutions:**
1. Verify `DISCORD_BOT_TOKEN` in `.env`
2. Check bot logs for errors
3. Ensure intents are enabled

### Slash Commands Not Appearing

**Causes:**
- Commands not registered
- Bot lacks `applications.commands` scope
- Cache needs clearing

**Solutions:**
1. Re-invite bot with correct scopes
2. Restart Discord client
3. Wait up to 1 hour for global commands

### Missing Permissions

**Causes:**
- Bot role is below target role
- Channel-specific overrides
- Missing server permissions

**Solutions:**
1. Move bot role higher in server settings
2. Check channel permissions
3. Re-invite with correct permissions

### Can't Read Messages

**Causes:**
- Message Content Intent not enabled
- Missing "Read Messages" permission

**Solutions:**
1. Enable Message Content Intent in Discord Developer Portal
2. Check bot role has "Read Messages/View Channels"

---

## Security Best Practices

### Token Security

- ✅ Never commit tokens to version control
- ✅ Use environment variables
- ✅ Regenerate compromised tokens immediately
- ✅ Restrict token access to necessary personnel

### Permission Management

- ✅ Use principle of least privilege
- ✅ Only request needed permissions
- ✅ Regularly audit bot permissions
- ✅ Use role hierarchy properly

### Intent Usage

- ✅ Only enable required intents
- ✅ Document why each intent is needed
- ✅ Review intent requirements regularly

---

## Next Steps

After bot setup:

1. Configure environment variables in `.env`
2. Start the bot: `npm run dev:bot`
3. Test slash commands in Discord
4. Configure moderation rules in dashboard

See [Setup Guide](SETUP.md) for complete installation instructions.

---

## Additional Resources

- [Discord Developer Portal](https://discord.com/developers/docs)
- [Discord.js Guide](https://discordjs.guide/)
- [Slash Commands Guide](https://discord.com/developers/docs/interactions/application-commands)
- [Intents Explainer](https://discord.com/developers/docs/topics/gateway#gateway-intents)

---

**Last Updated**: October 3, 2025
