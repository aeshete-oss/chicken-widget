export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization');
  if (req.method === 'OPTIONS') { return res.status(200).end(); }
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) { return res.status(401).json({ error: 'No token provided' }); }
  const notionHeaders = {
    'Authorization': `Bearer ${token}`,
    'Notion-Version': '2022-06-28',
    'Content-Type': 'application/json',
  };
  try {
    const searchRes = await fetch('https://api.notion.com/v1/search', {
      method: 'POST', headers: notionHeaders,
      body: JSON.stringify({ filter: { property: 'object', value: 'database' } }),
    });
    if (searchRes.status === 401) { return res.status(401).json({ error: 'Token expired or revoked' }); }
    const searchData = await searchRes.json();
    const db = searchData.results?.find((d) => {
      const props = d.properties || {};
      return (props.Category?.type === 'select' && props.Handled?.type === 'checkbox' &&
              props.Energy?.type === 'select' && props.Room?.type === 'select');
    });
    if (!db) { return res.json({ error: 'no_database', completed: 0, total: 0, msg: 'No matching database found' }); }
    let completed = 0;
    for (const category of ['Cleaning', 'Doom Pile']) {
      let hasMore = true; let startCursor = undefined;
      while (hasMore) {
        const body = { filter: { and: [
          { property: 'Done On', date: { is_not_empty: true } },
          { property: 'Category', select: { equals: category } },
        ]}, page_size: 100 };
        if (startCursor) body.start_cursor = startCursor;
        const qRes = await fetch(`https://api.notion.com/v1/databases/${db.id}/query`, { method: 'POST', headers: notionHeaders, body: JSON.stringify(body) });
        const qData = await qRes.json();
        completed += qData.results?.length || 0;
        hasMore = qData.has_more; startCursor = qData.next_cursor;
      }
    }
    let total = 0;
    for (const category of ['Cleaning', 'Doom Pile']) {
      let hasMore = true; let startCursor = undefined;
      while (hasMore) {
        const body = { filter: { property: 'Category', select: { equals: category } }, page_size: 100 };
        if (startCursor) body.start_cursor = startCursor;
        const qRes = await fetch(`https://api.notion.com/v1/databases/${db.id}/query`, { method: 'POST', headers: notionHeaders, body: JSON.stringify(body) });
        const qData = await qRes.json();
        total += qData.results?.length || 0;
        hasMore = qData.has_more; startCursor = qData.next_cursor;
      }
    }
    res.json({ completed, total });
  } catch (err) { console.error('Count error:', err); res.status(500).json({ error: 'Failed to fetch data' }); }
}
