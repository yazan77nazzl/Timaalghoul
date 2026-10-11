# Timaa Al Ghoul · Feedback Studio

A browser-only feedback image generator for Timaa Al Ghoul, Mathematics Teacher. React, TypeScript, Vite, and Tailwind CSS. No backend, accounts, or database.

## Run locally

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. On Windows with restricted PowerShell execution policies, use `npm.cmd` instead of `npm`.

## Use

Paste Arabic or English feedback, select one of twenty-three designs, and download a 1080 × 1920 PNG. All eleven earlier designs are retained. Seven additional luxury designs offer natural marble and gold, burgundy velvet, warm champagne, sapphire art deco, a private gallery composition, a mathematics design with golden equations and geometric details, and Mathematics Privé with photorealistic brass instruments. Five further designs keep all decorative artwork on the left and the uploaded portrait on the right. Portraits fill their frames proportionally; edges are cropped when needed, with no stretching, recoloring, or retouching. Long feedback is split into numbered Stories with no omitted text. The preview displays the exact canvas used for PNG export. Fonts ship locally with the application; feedback and selected photographs stay in the browser. Some browsers require permission to download multiple files.

Add the original photograph at `public/assets/teacher-portrait.jpg` to include it automatically. The interface also accepts a local portrait. Photos fill the entire frame using proportional cover sizing. Larger or smaller images are scaled to fit, with centered edge cropping when aspect ratios differ. Source photographs remain unchanged.

## Verification

```sh
npm run build
npm run dev
npm test
```

Tests use installed Google Chrome through Playwright. The browser checks validate Arabic and English PNG downloads, exact canvas/export equality, all twenty-three templates, multi-page preservation and downloads, portrait rendering, full-frame sizing for large and small images, unobscured left artwork, and mobile layout. Test artifacts are written to the ignored `test-results` directory.

On browsers that support PNG file sharing, **Save / share image** opens the device share sheet with the current Story. On iPhone, choose **Save Image** to save to Photos. Multi-page feedback can be saved one Story at a time using the preview arrows; Download PNG still exports every page. Sharing needs HTTPS (or localhost) and browser support; unsupported browsers keep the normal download button. Images are prepared before the tap to preserve user activation. Run `node scripts/test-share.mjs` to verify shared PNG equality, activation, page changes, cancellation, and fallback with a mocked share API in Chrome. The actual iPhone share sheet requires device testing.

Run `node scripts/test-alignment.mjs` for pixel-based centering checks using Arabic, English, mixed text, punctuation, and emoji. Feedback uses measured widths and left anchors to avoid reliance on Canvas center alignment. WebKit documented a center-alignment issue with complex-shaped text in its [Safari Technology Preview 246 release notes](https://webkit.org/blog/18128/release-notes-for-safari-technology-preview-246/). The application requires no Windows components. This check uses installed Chrome; direct testing on an iPhone remains separate.



