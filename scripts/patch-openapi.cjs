const { readFileSync, writeFileSync } = require('fs');
const path = require('path');

const openApiPath = path.join(__dirname, '../src/api/core/OpenAPI.ts');
const content = readFileSync(openApiPath, 'utf-8');

let patched = content.replace(
  'TOKEN: undefined,',
  "TOKEN: async () => (typeof window !== 'undefined' ? localStorage.getItem('accessToken') || '' : ''),"
);

patched = patched.replace(
  /BASE: ''/,
  "BASE: 'https://spoticode.vercel.app'"
);

if (content !== patched) {
  writeFileSync(openApiPath, patched);
  console.log('patch-openapi: TOKEN and BASE configured');
} else {
  console.log('patch-openapi: already configured or pattern not found');
}
