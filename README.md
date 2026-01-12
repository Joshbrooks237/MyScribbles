# MyScribbles - AI-Powered Lyric Writing App 🎵

A beautiful, calligraphy-inspired app for writing song lyrics with AI assistance and handwriting recognition.

## Features

- **AI-Powered Lyric Generation**: Generate lyrics using OpenAI's GPT-4o-mini
- **Handwriting Canvas**: Write lyrics naturally with mouse, stylus, or touch
- **OCR Conversion**: Convert handwritten lyrics to typed text using Tesseract.js
- **Song Structure Templates**: Pre-built templates for verses, choruses, bridges, etc.
- **Local Storage**: Save your songs in your browser
- **Export Functionality**: Export songs as text files
- **Tip Jar**: Support the app with Stripe integration (coming soon)

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express
- **AI**: OpenAI API (GPT-4o-mini)
- **OCR**: Tesseract.js
- **Styling**: Custom CSS with calligraphy theme
- **Deployment**: Railway

## Local Development

### Prerequisites
- Node.js 18+
- npm

### Setup

1. **Clone and install dependencies:**
   ```bash
   git clone https://github.com/Joshbrooks237/MyScribbles.git
   cd MyScribbles

   # Install frontend dependencies
   cd lyrics-app
   npm install

   # Install backend dependencies
   cd ../api
   npm install
   cd ..
   ```

2. **Set up environment variables:**

   **Backend (.env):**
   ```bash
   cd api
   echo "OPENAI_API_KEY=your_openai_api_key_here" > .env
   ```

   **Frontend (.env):**
   ```bash
   cd ../lyrics-app
   echo "VITE_API_BASE_URL=http://localhost:3001" > .env
   ```

3. **Start the development servers:**

   **Terminal 1 - Backend API:**
   ```bash
   cd api
   npm start
   ```

   **Terminal 2 - Frontend:**
   ```bash
   cd lyrics-app
   npm run dev
   ```

4. **Open your browser:**
   - Frontend: http://localhost:5173
   - API Health Check: http://localhost:3001/health

## Railway Deployment

### Deploy Backend API

1. **Create a new Railway project** for the API:
   ```bash
   # Railway will auto-detect the monorepo structure
   railway login
   railway init
   ```

2. **Set environment variables** in Railway dashboard:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `NODE_ENV`: `production`
   - `PORT`: `3001` (Railway sets this automatically)

3. **Deploy the API service:**
   ```bash
   railway up --service api
   ```

### Deploy Frontend

1. **Add frontend service** to the same Railway project

2. **Set environment variables** for frontend:
   - `VITE_API_BASE_URL`: Your Railway API service URL (e.g., `https://myscribbles-api.up.railway.app`)

3. **Deploy the frontend:**
   ```bash
   railway up --service frontend
   ```

### Alternative: Manual Railway Deployment

If Railway doesn't auto-detect services, you can deploy them separately:

1. **API Service:**
   - Create new Railway project
   - Connect to GitHub repo
   - Set root directory to `api/`
   - Add environment variables
   - Deploy

2. **Frontend Service:**
   - Create another Railway project
   - Connect to same GitHub repo
   - Set root directory to `lyrics-app/`
   - Set `VITE_API_BASE_URL` to API service URL
   - Deploy

## Security Notes

- **API Key Protection**: OpenAI API key is now server-side only, eliminating client-side exposure
- **CORS**: Backend properly configured for cross-origin requests
- **Environment Variables**: Sensitive keys stored securely in Railway

## Usage

1. **Start Writing**: Choose a song template or create a blank song
2. **Add Sections**: Add verses, choruses, bridges, etc.
3. **AI Generation**: Click the ✨ wand to generate lyrics for any section
4. **Handwriting Mode**: Switch to handwriting mode for natural writing
5. **OCR Conversion**: Convert handwritten lyrics to typed text with "To Text" button
6. **Save & Export**: Save songs locally and export as text files

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally
5. Submit a pull request

## License

MIT License - see LICENSE file for details

---

**Made with ❤️ for songwriters everywhere** 🎸🌊
