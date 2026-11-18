# The 6 Layers of Love ❤️

A small interactive website you can send as a surprise. It's funny, it's romantic, and it ends with one big secret. It's built with **React + Vite + Framer Motion**, is designed for phones first, and needs no backend.

> Link preview title: **“A Little Surprise For You ❤️”**
> Description: *“Six little layers, lots of smiles, and one big secret.”*

---

## ✨ The experience

| Screen | What happens |
| --- | --- |
| **Password lock** | A “Top Secret 🔐” screen. She types the secret password. Wrong guesses shake the box and show funny messages, and after 2 wrong tries the hint appears (or she can tap “I need a hint 🙈”). Once she gets it right, the site remembers on that phone. |
| **Intro** | “Hey You! ❤️”. She has to confirm she is extremely cute. The **No** button runs away from her finger, shows a new funny message each time, and the **Yes** button gets bigger. |
| **Layer 1: The Cute Test** | 3 questions. Each answer gets its own funny reaction, the mascot's mood changes and a cuteness meter fills up. |
| **Layer 2: The Love Detector** | 3 Yes/No questions on a scanning card, with replies like *“System alert: Excessive cuteness detected.”* |
| **Layer 3: The Memory Machine** | Romantic quote cards she can tap or swipe through, then **Unlock Another Secret ❤️** |
| **Layer 4: The Secret Questions** | A “Confidential Relationship Examination”: 4 questions, each with its own reactions |
| **Layer 5: The Heart Connection** | She taps a beating heart that fills up while 4 quotes appear one by one. Then comes a 5 → 1 countdown, *“Wait… There’s something I’ve been wanting to tell you.”*, and **OPEN THE FINAL SECRET ❤️** |
| **Layer 6: The Grand Love Reveal** | A dark cinematic scene with hundreds of floating hearts, glowing particles, fireworks and confetti. She opens an animated envelope and the love letter appears line by line. Ends with **PLAY AGAIN ❤️** |

It also has:
- A glowing heart “unlock” animation between layers and a **1/6 → 6/6** progress bar
- A back button, and you can tap the progress dots to revisit layers she has already unlocked
- A restart button (it asks first)
- Progress saved in the browser, so a refresh doesn't reset anything
- Background music with a mute/unmute button. It starts only after her first tap. By default it is a soft music-box melody generated in the browser, so no audio file is needed.
- Vibration feedback on Android
- Support for phones that ask for reduced motion

---

## 📁 Project structure

```
.
├── index.html               # Page shell, link-preview meta tags, fonts
├── vite.config.js           # Fills the title/description/og:image in from config.js
├── vercel.json              # Vercel deploy config
├── netlify.toml             # Netlify deploy config (alternative)
├── package.json
├── public/
│   ├── favicon.svg          # Heart favicon
│   ├── favicon-32.png
│   ├── apple-touch-icon.png # iPhone home-screen icon
│   └── og-image.jpg         # 1200×630 WhatsApp / iMessage link preview
├── scripts/
│   └── make-images.mjs      # Regenerates og-image + icons (optional)
└── src/
    ├── config.js            # ⭐ ALL EDITABLE TEXT LIVES HERE ⭐
    ├── main.jsx             # React entry
    ├── App.jsx              # Screen flow, unlocks, transitions, music start
    ├── styles.css           # All styling and animations
    ├── lib/
    │   ├── progress.js      # Saves progress in localStorage
    │   ├── music.js         # Background music (built-in melody or your mp3)
    │   └── effects.js       # Confetti, heart bursts, vibration
    ├── components/
    │   ├── Background.jsx   # Animated gradient + floating hearts/flowers/sparkles
    │   ├── Mascot.jsx       # Cute cartoon heart character (5 moods)
    │   ├── TopBar.jsx       # Back, progress 1/6…6/6, mute, restart
    │   ├── GlowButton.jsx   # Glowing animated button
    │   ├── LayerHeader.jsx  # Layer chip + title + subtitle
    │   ├── UnlockOverlay.jsx# Glowing heart "layer unlocked" animation
    │   └── LoveSky.jsx      # Finale canvas: hearts, particles, fireworks
    └── screens/
        ├── Intro.jsx        # Intro + runaway "No" button
        ├── QuizLayer.jsx    # Layers 1, 2 and 4
        ├── MemoryLayer.jsx  # Layer 3
        ├── HeartLayer.jsx   # Layer 5
        └── GrandReveal.jsx  # Layer 6
```

---

## 💌 Personalize it (one file)

Open **`src/config.js`**. Everything she reads is in that file:

- `myName`, `herName`
- `site.title`, `site.description`: the browser tab title and the link preview
- `lock`: the password lock. Set `answers` (one or more accepted passwords) and `hint`. Capitals, spaces, dots, slashes and dashes are ignored, so for a date like `14/02/2024` you can write `'14022024'`. Set `enabled: false` to remove the lock. (It's a cute lock, not real security: the answer is inside the site's code.)
- `intro`: the greeting, the buttons and the funny messages for the runaway No button
- `layer1` … `layer5`: titles, questions, answers, reactions and quotes
- `layer6`: the envelope label, headline, **love letter** paragraphs, sign-off and signature
- `music.src`: leave it empty for the built-in melody, or use your own song (see below)

Anywhere in the text, `{her}` and `{me}` are replaced with the names you set.
Each answer can set a `mood` for the mascot: `happy`, `love`, `shock`, `smug` or `detective`.

**Use your own song:** put the file in `public/`, for example `public/our-song.mp3`, then set
`music: { src: '/our-song.mp3', volume: 0.5 }`.

**Changed her name or the title?** The text on the site updates by itself. The link-preview *image* (`public/og-image.jpg`) is a picture, so regenerate it with `node scripts/make-images.mjs` (this needs Playwright), or replace it with any 1200×630 JPG under about 300 KB.

---

## 🧑‍💻 Run it locally

Requires Node.js 18 or newer.

```bash
npm install
npm run dev        # open the printed URL; the "Network" URL works on your phone on the same Wi-Fi
npm run build      # production build into dist/
npm run preview    # preview the production build
```

---

## 🚀 Deploy to Vercel (free, about 3 minutes)

### Option A: from GitHub (recommended)
1. Push this project to a GitHub repository.
2. Go to **https://vercel.com** → **Sign up / Log in with GitHub**.
3. Click **Add New… → Project** and **Import** your repository.
4. Vercel detects **Vite** automatically (Build command `npm run build`, Output `dist`). Leave the defaults.
5. Optional but nice: under **Project Name**, choose something cute, such as `for-aishwarya`. Your URL becomes `https://for-aishwarya.vercel.app`.
6. Click **Deploy**. In about a minute you get your public URL. 🎉

Every later `git push` redeploys automatically.

### Option B: from your computer with the Vercel CLI
```bash
npm i -g vercel
vercel          # answer the prompts (accept the defaults)
vercel --prod   # publish to your production URL
```

### Making the WhatsApp preview show the image
WhatsApp needs the full, absolute address of the preview image. The build fills it in automatically on Vercel (from `VERCEL_PROJECT_PRODUCTION_URL`) and on Netlify (from `URL`).
If you use a **custom domain**, add an environment variable in Vercel → *Settings → Environment Variables*:

```
SITE_URL = https://your-custom-domain.com
```

Then redeploy.

**Before sending it to her:** paste the link into a chat with yourself on WhatsApp first and check the preview. WhatsApp caches previews. If you redeploy and the old preview still appears, add something to the end of the link, such as `?v=2`, to get a fresh one.

### Deploy to Netlify instead
Go to **app.netlify.com → Add new site → Import from Git**, pick the repo and deploy. `netlify.toml` already contains the settings.

---

## 📱 Notes
- Tested at iPhone SE, iPhone 13 and desktop sizes.
- On iPhone, music is silent if the phone's **silent switch** is on. That's an iOS rule, not a bug.
- Progress is stored in her browser only. Nothing is sent anywhere, and there's no login, no tracking and no ads.
- To start over, tap the ↻ button at the top right, or tap **PLAY AGAIN** at the end.

Made with ❤️
