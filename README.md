# Timaa Al Ghoul · Feedback Studio

A browser-only feedback image generator for Timaa Al Ghoul, Mathematics Teacher. React, TypeScript, Vite, and Tailwind CSS. No backend, accounts, or database.

## Run locally

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. On Windows with restricted PowerShell execution policies, use `npm.cmd` instead of `npm`.

## Use

Paste Arabic or English feedback, select one of seventeen designs, and download a 1080 × 1920 PNG. All eleven earlier designs are retained. Six additional luxury designs offer natural marble and gold, burgundy velvet, warm champagne, sapphire art deco, a private gallery composition, and a mathematics design with golden equations and geometric details. Each supports the original portrait without cropping or retouching. Long feedback is split into numbered Stories with no omitted text. The preview displays the exact canvas used for PNG export. Fonts ship locally with the application; feedback and selected photographs stay in the browser. Some browsers require permission to download multiple files.

Add the original photograph at `public/assets/teacher-portrait.jpg` to include it automatically. The interface also accepts a local portrait. Photos keep their original proportions and are not cropped, recolored, or retouched.

## Verification

```sh
npm run build
npm run dev
npm test
```

Tests use installed Google Chrome through Playwright. The browser checks validate Arabic and English PNG downloads, exact canvas/export equality, all seventeen templates, multi-page preservation and downloads, portrait rendering, and mobile layout. Test artifacts are written to the ignored `test-results` directory.

