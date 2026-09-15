function flattenObject(obj, prefix = '') {
  const result = {};
  for (const [key, value] of Object.entries(obj ?? {})) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value, fullKey));
    } else {
      result[fullKey] = Array.isArray(value) ? JSON.stringify(value) : (value ?? '');
    }
  }
  return result;
}

function escapeCsv(value) {
  const str = String(value ?? '');
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function jsonToCsv(data) {
  let rows = [];

  if (Array.isArray(data)) {
    rows = data;
  } else if (data && typeof data === 'object') {
    // Find the first array property that contains objects (e.g. response.files, response.entries)
    const arrayProp = Object.values(data).find(
      v => Array.isArray(v) && v.length > 0 && typeof v[0] === 'object'
    );
    if (arrayProp) {
      rows = arrayProp;
    } else {
      rows = [data];
    }
  }

  if (rows.length === 0) return 'No data to export';

  const flatRows = rows.map(row =>
    typeof row === 'object' && row !== null ? flattenObject(row) : { value: row }
  );

  // Collect all unique column headers from every row
  const headers = [...new Set(flatRows.flatMap(row => Object.keys(row)))];

  const lines = [
    headers.map(escapeCsv).join(','),
    ...flatRows.map(row => headers.map(h => escapeCsv(row[h] ?? '')).join(',')),
  ];

  return lines.join('\n');
}

export function downloadCsv(data, filename = 'response.csv') {
  const csv = jsonToCsv(data);
  const bom = '﻿'; // UTF-8 BOM so Excel opens it correctly
  const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
