const { readFileSync, writeFileSync } = require('fs');
const path = require('path');

const openApiPath = path.join(__dirname, '../src/api/core/OpenAPI.ts');
const content = readFileSync(openApiPath, 'utf-8');
const patched = content.replace(
  'TOKEN: undefined,',
  "TOKEN: async () => (typeof window !== 'undefined' ? localStorage.getItem('accessToken') || '' : ''),"
);

if (content !== patched) {
  writeFileSync(openApiPath, patched);
  console.log('patch-openapi: TOKEN configured');
} else {
  console.log('patch-openapi: TOKEN already configured or pattern not found');
}
