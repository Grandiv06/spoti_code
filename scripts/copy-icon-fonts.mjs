import { copyFileSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fontsDir = join(root, "public", "fonts");

const copies = [
  {
    from: join(
      root,
      "node_modules/@fontsource-variable/material-symbols-outlined/files/material-symbols-outlined-latin-wght-normal.woff2"
    ),
    to: join(fontsDir, "material-symbols-outlined.woff2"),
  },
  {
    from: join(
      root,
      "node_modules/@fontsource/material-icons-round/files/material-icons-round-latin-400-normal.woff2"
    ),
    to: join(fontsDir, "material-icons-round.woff2"),
  },
];

mkdirSync(fontsDir, { recursive: true });

for (const { from, to } of copies) {
  copyFileSync(from, to);
}

writeFileSync(
  join(root, "public", "material-icons.css"),
  `/* Self-hosted Material icon fonts — loaded from <head> to avoid FOUT in production */
@font-face {
  font-family: "Material Symbols Outlined Variable";
  font-style: normal;
  font-weight: 100 700;
  font-display: block;
  src: url("/fonts/material-symbols-outlined.woff2") format("woff2-variations");
}

@font-face {
  font-family: "Material Icons Round";
  font-style: normal;
  font-weight: 400;
  font-display: block;
  src: url("/fonts/material-icons-round.woff2") format("woff2");
}
`,
  "utf8"
);

console.log("[copy-icon-fonts] Material icon fonts copied to public/fonts");
