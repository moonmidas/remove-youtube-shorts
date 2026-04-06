# Remove YouTube Shorts

A Manifest V3 Chrome extension that removes YouTube Shorts from the main YouTube experience and blocks direct Shorts pages with a local "Shorts blocked" screen.

## What It Does

- Hides common Shorts shelves and entry points on YouTube
- Removes links and video cards that point to `/shorts/`
- Intercepts direct `youtube.com/shorts/...` visits
- Replaces blocked Shorts pages with a bundled local screen

## Install In Chrome

1. Open `chrome://extensions`
2. Turn on Developer Mode
3. Click `Load unpacked`
4. Select this project folder:

   `/Users/moonmidas/Documents/Dev/chrome-extensions/remove-youtube-shorts`

## Local Development

Run the test suite:

```bash
npm test
```

## Project Structure

- `manifest.json`: extension definition
- `background.js`: blocks direct Shorts navigation
- `content.js`: removes Shorts surfaces from standard YouTube pages
- `blocked.html`: local page shown when a Shorts URL is blocked
- `tests/`: lightweight Node tests for navigation and DOM-pruning logic
