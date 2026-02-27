# FeX Group Website

## Vercel Deployment

1. Push this folder to a GitHub repo
2. Import into Vercel (vercel.com/new)
3. No build settings needed — it's a static site
4. Add your custom domain: fexgroup.com

## Contact Form Setup (Required)

The contact form needs a Formspree account to actually deliver emails:

1. Go to **formspree.io** and create a free account
2. Create a new form, get your endpoint ID (looks like `xrgjkwpb`)
3. Open `js/main.js`
4. Find: `const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORMSPREE_ID'`
5. Replace `YOUR_FORMSPREE_ID` with your actual ID
6. Redeploy

Free Formspree plan: 50 submissions/month. Paid: unlimited.

## YouTube Video

Currently using: https://www.youtube.com/watch?v=nueViw0-Plw

To change: open `js/main.js`, find `nueViw0-Plw` and replace with the new video ID.

## File Structure

```
fexgroup/
├── index.html          ← Main site (all 7 pages as SPA)
├── vercel.json         ← Vercel routing config
├── robots.txt
├── sitemap.xml
├── css/
│   └── style.css       ← All styles
├── js/
│   └── main.js         ← All JavaScript
└── images/
    ├── logo-hq.png
    ├── ship-loading.jpg
    ├── port-wide.jpg
    ├── port-quay.jpg
    ├── port-crane.jpg
    ├── rock-gypsum.jpg
    ├── structural-plate.jpg
    ├── autocast.jpg
    ├── raw-materials.jpg
    ├── alum-cans.jpg
    └── img04.jpg
```

## Analytics

Add Google Analytics by inserting your GA4 tag in the <head> of index.html:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
```
