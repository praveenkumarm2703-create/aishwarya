/**
 * ============================================================
 *  THE 6 LAYERS OF LOVE ❤️ — PERSONALIZATION FILE
 * ============================================================
 *  Everything she reads on the website lives in this one file.
 *  Change names, questions, answers, reactions, quotes and the
 *  final love letter here. No other file needs to be touched.
 *
 *  Tips:
 *   - Keep the structure (commas, quotes, brackets) intact.
 *   - `{her}` and `{me}` inside any text are replaced with the names below.
 *   - Each answer has a `reaction` (what pops up after she taps it)
 *     and an optional `mood` for the little mascot:
 *       "happy" | "love" | "shock" | "smug" | "detective"
 * ============================================================
 */

const config = {
  // ---------- NAMES ----------
  myName: 'Praveen',
  herName: 'Aishwarya',

  // ---------- WEBSITE / LINK PREVIEW ----------
  site: {
    // Browser tab title + WhatsApp / iMessage / Instagram link preview title
    title: 'A Little Surprise For You ❤️',
    description: 'Six little layers, lots of smiles, and one big secret.',
    // Colour of the phone's browser bar
    themeColor: '#ff6fa5',
  },

  // ---------- MUSIC ----------
  // Leave `src` empty to use the built-in soft music-box melody (no file needed).
  // To use your own song, put an mp3 in the /public folder (e.g. public/our-song.mp3)
  // and set src: '/our-song.mp3'. Music only starts after she taps something.
  music: {
    src: '',
    volume: 0.5,
  },

  // ---------- PASSWORD LOCK ----------
  // A secret screen she must pass before the surprise opens.
  // `answers`: every accepted password. Capitals, spaces and dots are ignored,
  // so 'Aishwarya', 'aishwarya ' and 'AISHWARYA' all work.
  // Example for a date: answers: ['14022024', '14/02/2024'] (slashes/dashes are ignored too).
  // Note: this is a cute lock, not real security — the answer is inside the site's code.
  lock: {
    enabled: true,
    answers: ['{her}'],
    title: 'Top Secret 🔐',
    prompt: 'This surprise is only for one special person. Prove it’s you.',
    placeholder: 'Enter the secret password',
    hint: 'Hint: it’s the most beautiful name I know 💕',
    hintButton: 'I need a hint 🙈',
    // shown one after another for wrong guesses
    wrongMessages: [
      'Hmm… that’s not it 🤔',
      'Nope! Are you an impostor? 🕵️',
      'Wrong again… want a hint? 👀',
      'Think harder, cutie 😜',
      'So close… (maybe) 😂',
    ],
    button: 'Unlock 💌',
    success: 'Access granted. Welcome, {her} ❤️',
  },

  // ---------- INTRO ----------
  intro: {
    greeting: 'Hey You! ❤️',
    line1: 'Someone has prepared a very important investigation about you.',
    line2: 'Before proceeding, please confirm that you are extremely cute.',
    yesButton: 'Obviously YES 😎',
    noButton: 'No, I’m innocent 🙈',
    // Shown one after another each time she tries to press "No"
    noTeases: [
      'Nice try 😏',
      'That button is shy. Just like you 🙈',
      'Error 404: Innocence not found 🕵️',
      'The judge has rejected your appeal ⚖️',
      'Okay this is getting embarrassing 😂',
      'The only valid answer is YES 💅',
    ],
    confirmed: 'Good. Your cuteness has been officially confirmed.',
    confirmedSub: 'Certificate No. ∞ — signed, stamped and kissed 💋',
    startButton: 'START THE ADVENTURE ❤️',
  },

  // ---------- LAYER 1 ----------
  layer1: {
    label: 'The Cute Test',
    title: 'How Cute Are You?',
    subtitle: 'Answer honestly. (There is a correct answer and you know it.)',
    questions: [
      {
        q: 'Who is the cutest person in this relationship?',
        options: [
          { text: 'Me', reaction: 'Correct. Confident AND cute. Dangerous combo 😌', mood: 'smug' },
          { text: 'Obviously me', reaction: '“Obviously” — the judges agree 100% 👑', mood: 'love' },
          { text: 'Why are you even asking?', reaction: 'Fair. The question was an insult to your cuteness 😂', mood: 'shock' },
        ],
      },
      {
        q: 'Who wins every argument?',
        options: [
          { text: 'Me', reaction: 'Yes ma’am. I didn’t even try to argue with this one 🏳️', mood: 'smug' },
          { text: 'You', reaction: 'Aww… you’re lying, but I appreciate the effort 🥹', mood: 'love' },
          { text: 'Nobody, because I am always right 😂', reaction: 'The Supreme Court has entered the chat ⚖️😂', mood: 'shock' },
        ],
      },
      {
        q: 'Who misses the other person first?',
        options: [
          { text: 'You', reaction: 'Guilty. I miss you 5 minutes after saying bye 🙈', mood: 'love' },
          { text: 'Me', reaction: 'Wait… really? Hold on, I need a moment 🥹❤️', mood: 'shock' },
          { text: 'Both, secretly ❤️', reaction: 'Secret’s out. We’re both hopeless 💞', mood: 'happy' },
        ],
      },
    ],
    resultTitle: 'Cute Test Result',
    resultText: 'Cuteness level: dangerously high. Layer 2 has been unlocked 🔓',
  },

  // ---------- LAYER 2 ----------
  layer2: {
    label: 'The Love Detector',
    title: 'Let’s Check Your Heart ❤️',
    subtitle: 'Place your heart near the screen. Scanning…',
    questions: [
      {
        q: 'Do you smile when you see my name on your phone?',
        options: [
          { text: 'Yes 😊', reaction: 'System alert: Excessive cuteness detected. 🚨', mood: 'love' },
          { text: 'No 😐', reaction: 'Lie detector says… 🤥 BEEP BEEP. You’re smiling right now.', mood: 'detective' },
        ],
      },
      {
        q: 'Do you secretly wait for my messages?',
        options: [
          { text: 'Yes 🙈', reaction: 'Don’t worry, I type mine faster just for you 💌', mood: 'happy' },
          { text: 'No 🙄', reaction: 'Then why did you check your phone 47 times today? 📱👀', mood: 'smug' },
        ],
      },
      {
        q: 'Would you choose me again in your next lifetime?',
        options: [
          { text: 'Yes ❤️', reaction: 'Booked. Next lifetime, same person, same chaos 🔁❤️', mood: 'love' },
          { text: 'No 😜', reaction: 'Too bad, I already reserved you for the next 7 lifetimes 📜', mood: 'shock' },
        ],
      },
    ],
    resultTitle: 'Scan Complete',
    resultText: 'Heart status: 100% taken. Owner: {me} ❤️',
  },

  // ---------- LAYER 3 ----------
  layer3: {
    label: 'The Memory Machine',
    title: 'A Little Trip Through Our Feelings',
    subtitle: 'Tap a card to flip through them ✨',
    quotes: [
      'Some people make ordinary days feel extraordinary.',
      'Your smile is my favourite notification.',
      'I don’t need a perfect day. I just need a little time with you.',
      'Even when we’re doing nothing, everything feels special.',
    ],
    unlockButton: 'Unlock Another Secret ❤️',
  },

  // ---------- LAYER 4 ----------
  layer4: {
    label: 'The Secret Questions',
    title: 'Confidential Relationship Examination',
    subtitle: 'Top secret. Do not show this to anyone. 🤫',
    questions: [
      {
        q: 'If I steal your food, what will you do?',
        options: [
          { text: 'Steal it back 😤', reaction: 'Fair trade. But I’m keeping the last bite 🍟', mood: 'smug' },
          { text: 'Bite you 🦷', reaction: 'Honestly… I’d deserve it 😂', mood: 'shock' },
          { text: 'Forgive you… after 3 business days', reaction: 'Approved. I’ll bring snacks as an apology 🍫', mood: 'happy' },
        ],
      },
      {
        q: 'If I annoy you 100 times, will you still love me?',
        options: [
          { text: 'Yes, unfortunately 😩', reaction: 'Great, I’ll schedule the next 99 then 📅😈', mood: 'smug' },
          { text: 'Only if you say sorry cutely', reaction: 'Sorry 🥺👉👈 (repeat 100 times)', mood: 'love' },
          { text: 'I’ll love you 101 times ❤️', reaction: 'Okay now you’re just showing off 😭❤️', mood: 'love' },
        ],
      },
      {
        q: 'If we get lost together, who will find the way?',
        options: [
          { text: 'Me, obviously 🧭', reaction: 'Captain {her}, I’ll carry the snacks 🫡', mood: 'happy' },
          { text: 'You (Google Maps does it) 📱', reaction: 'Me + Google Maps = unbeatable team 😂', mood: 'smug' },
          { text: 'Nobody, we’ll just get more lost together 😂', reaction: 'Honestly, the best kind of lost 💞', mood: 'love' },
        ],
      },
      {
        q: 'What would you choose?',
        options: [
          { text: 'Unlimited shopping 🛍️', reaction: 'My wallet just fainted 😵', mood: 'shock' },
          { text: 'Unlimited food 🍕', reaction: 'Respect. And I will steal 50% as usual 😋', mood: 'smug' },
          { text: 'Unlimited hugs from me 🤗', reaction: 'Correct answer! Hug voucher activated. Valid forever 🫂', mood: 'love' },
        ],
      },
    ],
    resultTitle: 'Examination Result',
    resultText: 'Status: Certified girlfriend material. Classified level: Maximum 🔐',
  },

  // ---------- LAYER 5 ----------
  layer5: {
    label: 'The Heart Connection',
    title: 'One Last Test Before the Surprise',
    subtitle: 'Tap the heart. Gently. It’s mine. ❤️',
    quotes: [
      'You’re my favourite distraction.',
      'Even on difficult days, you’re one of my favourite reasons to smile.',
      'I may not always have the perfect words, but I will always have a heart that cares for you.',
      'Out of all the people in this world, I’m glad I found you.',
    ],
    countdownIntro: 'Connection strong. Preparing the final secret…',
    afterCountdown: 'Wait… There’s something I’ve been wanting to tell you.',
    button: 'OPEN THE FINAL SECRET ❤️',
  },

  // ---------- LAYER 6 — THE GRAND LOVE REVEAL ----------
  layer6: {
    label: 'The Grand Love Reveal',
    tapHint: 'Tap the envelope ✉️',
    envelopeLabel: 'For {her}',
    headline: 'I LOVE YOU ❤️',
    // Each string is one paragraph. Use \n for a line break inside a paragraph.
    letter: [
      'Congratulations! You have successfully completed all six layers.',
      'But here’s the truth…',
      'There was never a test.\nThere were no right or wrong answers.\nThere was only one reason behind this entire little adventure…',
      'To remind you how special you are to me.',
      'You make my ordinary days beautiful.\nYou make me smile without even trying.\nAnd if I had to choose again, I’d still choose you.',
      'You’re my favourite person, my favourite smile and my favourite part of every day.',
      'I LOVE YOU SO MUCH! ❤️',
    ],
    signOff: 'Forever your favourite troublemaker. 😘',
    signature: '— {me}',
    playAgain: 'PLAY AGAIN ❤️',
  },
};

/** Replaces {her} and {me} placeholders. */
export const fill = (text = '') =>
  text.replaceAll('{her}', config.herName).replaceAll('{me}', config.myName);

export default config;
