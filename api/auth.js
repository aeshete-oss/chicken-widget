export default function handler(req, res) {
  const clientId = process.env.NOTION_CLIENT_ID;
  const redirectUri = process.env.REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return res.status(500).json({ error: 'Server not configured. Set NOTION_CLIENT_ID and REDIRECT_URI.' });
  }

  const authUrl = new URL('https://api.notion.com/v1/oauth/authorize');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('owner', 'user');
  authUrl.searchParams.set('redirect_uri', redirectUri);

  res.redirect(302, authUrl.toString());
}
