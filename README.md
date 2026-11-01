# 🎂 A Journey of Memories — Birthday Surprise for Khadersha Annaya

> A premium, cinematic, interactive birthday surprise website — crafted with love by his sister.

---

## ✨ Features

| Feature | Details |
|---|---|
| 🎬 Cinematic Loading | Animated loading screen with starfield and progress bar |
| ⏳ Live Countdown | Real-time countdown to November 3, 2026 |
| 🖼️ Memories Gallery | Polaroid-style photo gallery with swipe support |
| 💌 Animated Letter | Envelope open animation with heartfelt letter |
| 📅 27-Year Timeline | Beautiful animated life timeline |
| 🎂 Birthday Cake | Interactive cake with candle-blowing animation |
| 🎆 Fireworks | Canvas-based golden fireworks & confetti |
| 🎈 Floating Balloons | Animated birthday balloons |
| 🎵 Background Music | Music toggle with play/pause |
| 📱 Fully Responsive | Works on all screen sizes |
| ⌨️ Keyboard Navigation | Arrow keys to navigate pages |
| 👆 Touch Swipe | Swipe to navigate on mobile |

---

## 🗂️ Project Structure

```
khadersha-birthday/
│
├── index.html          ← Main website (all 5 pages)
├── style.css           ← Premium cinematic styles
├── script.js           ← All interactions & animations
├── README.md           ← You are here
│
├── images/
│   ├── memory1.jpg     ← Replace with your photo
│   ├── memory2.jpg     ← Replace with your photo
│   ├── memory3.jpg     ← Replace with your photo
│   ├── memory4.jpg     ← Replace with your photo
│   ├── memory5.jpg     ← Replace with your photo
│   └── memory6.jpg     ← Replace with your photo
│
└── audio/
    └── birthday-music.mp3  ← Add your chosen music file
```

---

## 🖼️ How to Add Your Photos

1. Find the `images/` folder in the project.
2. Replace the placeholder images (`memory1.jpg` through `memory6.jpg`) with your own photos.
3. **Important:** Keep the same filenames exactly (`memory1.jpg`, `memory2.jpg`, etc.) or update the `src` in `index.html` accordingly.
4. To personalize captions, open `index.html` and find the `<p class="mem-quote">` tags and edit the text.

---

## 🎵 How to Add Background Music

1. Find a royalty-free birthday/soft instrumental piece you like.
   - Suggested free sources: [pixabay.com/music](https://pixabay.com/music/), [bensound.com](https://www.bensound.com/), [freemusicarchive.org](https://freemusicarchive.org/)
2. Download the `.mp3` file.
3. Rename it to `birthday-music.mp3`.
4. Place it in the `audio/` folder.
5. The music toggle button (top-right) will now work!

---

## 🚀 How to Run Locally

Simply open `index.html` in any modern browser:

```
Double-click → index.html
```

Or use a local server for best results (avoids audio restrictions):

```bash
# Using Python
python -m http.server 8080

# Using Node.js (npx)
npx serve .
```

Then visit: `http://localhost:8080`

---

## 🌐 Deployment

### Option 1: GitHub Pages (Free)

1. Create a GitHub account at [github.com](https://github.com)
2. Create a new repository (e.g., `khadersha-birthday`)
3. Upload all project files to the repository
4. Go to **Settings → Pages**
5. Under **Source**, select `main` branch → `/root` folder
6. Click **Save**
7. Your site will be live at: `https://yourusername.github.io/khadersha-birthday`

**Tip:** To share as a surprise, send the link via WhatsApp or email just before his birthday!

### Option 2: Netlify (Free, Easiest)

1. Go to [netlify.com](https://netlify.com) and sign up free
2. Drag and drop the entire `khadersha-birthday/` folder onto the Netlify dashboard
3. Your site is instantly live with a link like: `https://random-name.netlify.app`
4. You can set a custom domain name too (e.g., `happybirthdayannaya.netlify.app`)

### Option 3: Vercel (Free)

1. Go to [vercel.com](https://vercel.com) and sign up
2. Click **Add New → Project**
3. Import from GitHub or drag-drop the folder
4. Deploy instantly

---

## 🎨 Customization Guide

### Change Memory Captions
Open `index.html` and find elements like:
```html
<p class="mem-quote" id="quote-0">
  "Some moments are too beautiful for words — this is one of them. 🌅"
</p>
```
Replace the text with your personal memory caption.

### Change the Letter
Open `index.html` and find `<div class="letter-text">` — edit the paragraphs inside.

### Change Timeline Events
Open `index.html` and find `<div class="timeline-wrap">` — edit the `.tl-title` and `.tl-desc` text.

### Change Colors
Open `style.css` and edit the `:root` variables at the top:
```css
--gold:      #c9982a;   /* Main gold */
--gold-glow: #f5d879;   /* Glowing gold */
--bg-deep:   #020510;   /* Deepest background */
```

---

## 📱 Browser Support

| Browser | Support |
|---|---|
| Chrome 90+ | ✅ Full support |
| Firefox 88+ | ✅ Full support |
| Safari 14+ | ✅ Full support |
| Edge 90+ | ✅ Full support |
| Mobile Chrome | ✅ Full support |
| Mobile Safari | ✅ Full support |

---

## 💝 Made with Love

This website was built with love by **Khadersha's Sister** as a special birthday surprise.

> *"No matter how old we grow or how far life takes us, you will always be my dearest Annaya."*

---

**Happy 27th Birthday, Khadersha Annaya! 🎂✨**
