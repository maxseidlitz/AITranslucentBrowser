# Testing Generative UI Browser

## Setup

1. **Get Claude API Key**
   ```bash
   # Get your API key from https://console.anthropic.com
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local and add your VITE_CLAUDE_API_KEY
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

## Running

### Development Mode
```bash
npm run dev
```

Note: First run requires Rust + Tauri CLI:
```bash
cargo install create-tauri-app
```

### Web Development (without Tauri)
```bash
npx vite
# Opens http://localhost:5173
```

## Testing Scenarios

### 1. Academic Search (Generative UI)
- Query: `"machine learning papers 2024"`
- Expected: Claude generates custom HTML UI showing papers from Semantic Scholar
- Look for: Card layout, filters, search refinement bar

### 2. Website Navigation (Generative UI)
- URL: `https://example.com` or any website
- Expected: Claude extracts content and generates adapted UI
- Look for: Semantic structure, content extraction
- Fallback: "Original" button to switch to iframe if generation fails

### 3. URL Routing (Intent Classifier)
- Type: `https://google.com` → Opens in WebView (normal)
- Type: `google search results` → Triggers search pipeline

### 4. PDF Citation Tool
- Upload a PDF
- Expected: Auto-generate APA citation
- Copy citation to clipboard

## Debugging

### Claude API Errors
If you see "Claude API key not configured":
1. Check `.env.local` has `VITE_CLAUDE_API_KEY` set
2. Verify key is valid at https://console.anthropic.com
3. Check browser console for network errors

### UI Generation Failures
- Check Claude response in Network tab (DevTools)
- Fallback mechanisms active (error messages shown)
- WebView has "Original" button to switch modes

### Rate Limiting
- Semantic Scholar: ~100 requests/5 min
- Claude API: Check usage at console.anthropic.com

## Browser DevTools

Open DevTools (F12) to:
- Check console for errors
- View Network tab for API calls
- Inspect iframe content (might be blocked by sandbox)

## Known Issues

1. **CORS**: Semantic Scholar might have CORS restrictions
   - Solution: Use proxy or backend Tauri command

2. **iframe Sandbox**: Generated content might need relaxed permissions
   - Currently: `sandbox="allow-same-origin"`
   - May need: `allow-scripts` for interactive features

3. **HTML Generation**: Claude might generate incomplete HTML
   - Fallback to original website available

## Performance Tips

- First search takes ~3-5s (API latency)
- Cache generated UIs for same queries
- Consider mocking Claude API for local testing

## Next Steps

- [ ] Add error recovery UI
- [ ] Implement UI caching
- [ ] Add loading skeletons
- [ ] Stream Claude API responses
- [ ] Support website search refinement
