const { getStore } = require('@netlify/blobs');

exports.handler = async (event) => {
  try {
    const store = getStore('visitor-counter');
    const key = 'total-visits';

    let current = await store.get(key, { type: 'json' });
    if (!current) current = { count: 0 };

    // POST = increment (called once per unique visitor)
    // GET  = just read the current count (returning visitors)
    if (event.httpMethod === 'POST') {
      current.count += 1;
      await store.setJSON(key, current);
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ count: current.count })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
