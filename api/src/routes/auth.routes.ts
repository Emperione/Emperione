import { Router } from 'express';
import supabase from '../config/database';
import { signToken } from '../utils/jwt';
import { authController } from '../controllers/authController';

const router = Router();

// Redirect user to Discord OAuth (client should build this URL)
router.get('/login', (_req, res) => {
	const clientId = process.env['DISCORD_CLIENT_ID'];
	const redirectUri = process.env['DISCORD_REDIRECT_URI'];
	const scope = encodeURIComponent('identify email');
	if (!clientId || !redirectUri) {
		res.status(500).json({ error: 'OAuth not configured' });
		return;
	}
	const url = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}`;
	res.redirect(url);
	return;
});

// OAuth callback: exchange code for token, fetch user, upsert to users table, return JWT
router.get('/discord/callback', async (req, res) => {
		const code = String((req.query as any)['code'] || '');
	const clientId = process.env['DISCORD_CLIENT_ID'];
	const clientSecret = process.env['DISCORD_CLIENT_SECRET'];
	const redirectUri = process.env['DISCORD_REDIRECT_URI'];
	if (!code) return res.status(400).json({ error: 'Missing code' });
	if (!clientId || !clientSecret || !redirectUri) return res.status(500).json({ error: 'OAuth not configured' });

	try {
		// Exchange code for token
		const tokenResp = await (globalThis.fetch)('https://discord.com/api/oauth2/token', {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: new URLSearchParams({
				client_id: clientId,
				client_secret: clientSecret,
				grant_type: 'authorization_code',
				code,
				redirect_uri: redirectUri,
			} as any) as any,
		});
			const tokenJsonRaw = await tokenResp.json();
			const tokenJson = tokenJsonRaw as any;
			if (!tokenJson || !tokenJson.access_token) {
				return res.status(500).json({ error: 'Failed to obtain access token', details: tokenJsonRaw });
			}

			const userResp = await (globalThis.fetch)('https://discord.com/api/users/@me', {
				headers: { Authorization: `Bearer ${tokenJson.access_token}` },
			});
			const userJsonRaw = await userResp.json();
			const userJson = userJsonRaw as any;
			const discordId = userJson?.id;

			// Upsert user into Supabase users table
			const { data, error } = await supabase.from('users').upsert({ discord_id: discordId, email: userJson?.email }).select().maybeSingle();
		if (error) return res.status(500).json({ error: error.message });

			const token = signToken({ sub: data?.id || null, discordId });
		return res.json({ token, user: data });
	} catch (err: any) {
		return res.status(500).json({ error: err.message || 'unknown error' });
	}
});

router.get('/by-discord-id', authController.getByDiscordId);

export default router;
