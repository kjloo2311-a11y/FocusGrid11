# FocusGrid — Schulte Table

A lightweight, self-contained Schulte Table trainer built with plain HTML, CSS, and JavaScript. It needs no framework or build step. Training history and preferences stay in the current browser's LocalStorage.

## Files

- `index.html` — app structure
- `style.css` — responsive light/dark themes and focus-mode layout
- `script.js` — game, stats, chart, audio, haptics, and LocalStorage

## Run it

Open `index.html` directly, or upload the three files together to Netlify. The ZIP contains the three runnable files at its root.

## Features

- 3×3 through 7×7 number grids
- Classic ascending and reverse descending number modes
- Timer, progress counter, error count, pause/resume, result comparison, accuracy, and personal best
- Daily statistics, recent-session chart, and training history
- Optional sound, vibration, focus mode, and system/light/dark themes
- Chinese and English UI
- LocalStorage migration from prior FocusGrid record keys

Haptic feedback is available on browsers that support the Vibration API.
