# 🎵 MyScribbles

*In the quiet moments when the heart begins to sing...*

There's a story in every soul that yearns to find its voice,
A melody waiting to be born in the dead of night.
From Brooklyn streets to California dreams,
I've wandered through the songs that time has written.

Now comes MyScribbles, my friend - a gentle hand to hold,
A companion for those late-night scribbles on hotel notepads.
Where the magic happens when you least expect it,
And the words come pouring out like sweet September rain.

## 🌟 What Dreams Are Made Of

- **Song Structure Templates**: Whether you're crafting a pop standard or a rock anthem, we help you build the foundation
- **AI-Powered Lyric Generation**: Let the machine whisper in your ear, like a trusted co-writer on a lonely tour bus
- **Smart Suggestions**: Alternative phrasings that might just capture that elusive feeling you've been chasing
- **Handwriting Mode**: Write lyrics by hand with stylus support, artistic brushes, and natural pen strokes
- **Organized Sections**: Keep your verses, choruses, and bridges as neat as sheet music on a piano
- **Local Storage**: Your songs remain safe, like precious memories tucked away
- **Export Functionality**: Share your creations with the world, one verse at a time - text or handwritten images
- **Responsive Design**: Works beautifully whether you're at home or on the road

## 🎼 Getting Started - The Journey Begins

### What You'll Need

- Node.js (v16 or higher, like a well-tuned guitar)
- An OpenAI API key (your ticket to the creative express)

### Installation

```bash
# Clone this repository, my friend
git clone https://github.com/Joshbrooks237/MyScribbles.git
cd MyScribbles

# Let the dependencies settle in
npm install
```

### OpenAI API Setup

To unlock the AI magic that helps you write:

1. Visit [OpenAI's API keys page](https://platform.openai.com/api-keys) - it's like getting backstage passes
2. Create your API key, handle it with care
3. Create a `.env` file in your project root:
   ```
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   ```

*Note: This uses the API directly from your browser. In production, you'd want to proxy through your own backend - like having a road manager handle the business side.*

### Stripe Setup (Tip Jar) 💝

When you're ready to accept tips from your supporters:

1. Create a [Stripe account](https://dashboard.stripe.com/register) (you'll need your EIN)
2. Get your **Publishable Key** from [Stripe Dashboard > API Keys](https://dashboard.stripe.com/apikeys)
3. Create a **Payment Link** in [Stripe Dashboard > Payment Links](https://dashboard.stripe.com/payment-links)
4. Add to your `.env` file:
   ```
   VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_key_here
   VITE_STRIPE_PAYMENT_LINK=https://buy.stripe.com/your_payment_link
   ```

*The tip jar will work as soon as you add these keys - no code changes needed!*

### Running the App

```bash
# Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser and let the music begin.

### Building for Production

```bash
npm run build
```

## 🎶 How to Use MyScribbles

1. **Start Writing**: Choose a template or begin with a blank page, like staring at an empty stage
2. **Add Sections**: Build your verses, choruses, bridges - each piece tells part of your story
3. **AI Assistance**: Click the wand icon (✨) and let the AI help you find the right words
4. **Get Suggestions**: The lightbulb icon 💡 offers alternative paths when you're stuck
5. **Save & Export**: Your work is preserved, ready to be shared with the world
6. **Organize**: Browse your collection in "My Songs" - each one a chapter in your musical journey

## 🎼 Song Templates - Choose Your Path

- **Pop Standard**: Verse-Chorus-Verse-Chorus-Bridge-Chorus - like a well-crafted pop song that gets stuck in your head
- **Rock Anthem**: Intro-Verse-Chorus-Verse-Chorus-Solo-Chorus-Outro - for when you need to rock the house
- **Rap Song**: Intro-Verse-Hook-Verse-Hook-Bridge-Hook-Outro - rhythm and rhyme in perfect harmony
- **Ballad**: Intro-Verse-Chorus-Verse-Chorus-Bridge-Chorus-Outro - slow and meaningful, like Sunday morning reflections
- **Blank Canvas**: Start completely from scratch - pure creative freedom

## 🛠️ Tech Stack - The Tools of the Trade

- **React 18** with TypeScript - modern and reliable, like a vintage microphone that still works perfectly
- **Vite** for fast development - quick as a heartbeat
- **OpenAI API** for AI-powered lyric generation - your creative co-pilot
- **Lucide React** for beautiful icons - clean and elegant
- **Local Storage** for data persistence - your songs, safely stored
- **CSS** with modern design patterns - beautiful and responsive

## 🤝 Contributing - Join the Song

This app is for songwriters of every stripe - from the garage band dreamer to the seasoned performer. Feel free to contribute your ideas:

- Song collaboration features - write together, even when apart
- Audio recording integration - capture those magical moments
- Chord progression suggestions - the harmony to your melody
- Rhyme detection and suggestions - find that perfect word
- Social sharing features - let your songs travel far and wide
- Export to various formats (PDF, DOC, etc.) - share your work in any form

## 📜 License

This project is open source, shared under the MIT License. May your songs find their audience, and may your creative spirit never fade.

---

*Remember, my friend, every great song started as a scribble on a napkin or a late-night thought. MyScribbles is here to help you turn those moments into something beautiful. Keep writing, keep singing, keep dreaming.*

*Neil Diamond would be proud.* ✨🎵
