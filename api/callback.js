export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send('Missing authorization code.');
  }

  const clientId = process.env.NOTION_CLIENT_ID;
  const clientSecret = process.env.NOTION_CLIENT_SECRET;
  const redirectUri = process.env.REDIRECT_URI;

  try {
    // Exchange code for access token
    const tokenRes = await fetch('https://api.notion.com/v1/oauth/token', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      }),
    });

    const data = await tokenRes.json();

    if (!data.access_token) {
      console.error('Token exchange failed:', data);
      return res.status(400).send('Authorization failed. Please try again.');
    }

    // Return a page that stores the token and communicates with the widget
    const origin = new URL(redirectUri).origin;

    res.setHeader('Content-Type', 'text/html');
    res.send(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Connected!</title>
  <style>
    body {
      font-family: 'Segoe UI', system-ui, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      background: #FFFDF7;
      text-align: center;
    }
    .card {
      padding: 40px;
    }
    .emoji { font-size: 48px; margin-bottom: 16px; }
    h2 { color: #5D4E37; font-size: 20px; margin-bottom: 8px; }
    p { color: #8B7D6B; font-size: 14px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="emoji">&#x1F423;</div>
    <h2>Connected!</h2>
    <p>Your chicken is ready to grow.<br>You can close this window.</p>
  </div>
  <script>
    // Store token in localStorage (works when opened directly)
    try { localStorage.setItem('ck_token', '${data.access_token}'); } catch(e) {}
    // Notify opener (the widget iframe) via postMessage
    if (window.opener) {
      window.opener.postMessage({ type: 'notion-auth', token: '${data.access_token}' }, '*');
      // Close popup after short delay
      setTimeout(function() { window.close(); }, 2000);
    }
    // Also try BroadcastChannel (works across same-origin tabs)
    try {
      var bc = new BroadcastChannel('chicken-widget');
      bc.postMessage({ type: 'notion-auth', token: '${data.access_token}' });
    } catch(e) {}
    // Fallback: if popup wasn't opened via window.open, redirect
    if (!window.opener) {
      setTimeout(function() {
        window.location.href = '${origin}/?token=${data.access_token}';
      }, 3000);
    }
  </script>
</body>
</html>`);
  } catch (err) {
    console.error('OAuth error:', err);
    res.status(500).send('Something went wrong. Please try again.');
  }
}
