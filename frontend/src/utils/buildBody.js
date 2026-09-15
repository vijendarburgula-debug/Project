// Converts flat dot-notation param keys → nested objects.
// e.g. { "options.path": "/docs" } → { options: { path: "/docs" } }
// Also auto-casts "true"/"false" → boolean, numeric strings → number.
export function buildNestedBody(params, values) {
  const body = {};
  params
    .filter(p => p.type === 'body' && values[p.key] !== undefined && values[p.key] !== '')
    .forEach(p => {
      const keys = p.key.split('.');
      let node = body;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!node[keys[i]]) node[keys[i]] = {};
        node = node[keys[i]];
      }
      const last = keys[keys.length - 1];
      const raw  = values[p.key];
      if      (raw === 'true')              node[last] = true;
      else if (raw === 'false')             node[last] = false;
      else if (raw !== '' && !isNaN(raw))   node[last] = Number(raw);
      else                                   node[last] = raw;
    });
  return Object.keys(body).length > 0 ? body : null;
}

// Find the primary array inside any response body
export function findResponseArray(data) {
  if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object') return data;
  if (!data || typeof data !== 'object') return null;
  const keys = ['value','files','entries','items','users','members','groups',
                 'matches','permissions','data','resources','accounts','list',
                 'results','contacts','folders','drives','sites','lists'];
  for (const k of keys) {
    if (Array.isArray(data[k]) && data[k].length > 0 && typeof data[k][0] === 'object') {
      return data[k];
    }
  }
  return null;
}
