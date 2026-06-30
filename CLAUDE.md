# Lens Browser - Development Notes

## Project Overview

**Codename**: Lens  
**Goal**: Generative-UI browser for academic research (MVP)  
**Status**: MVP Phase 1 - Core Infrastructure Complete

## Completed (Phase 1)

✅ Tauri + React project setup  
✅ Intent classifier (regex-based)  
✅ SearchResults with Semantic Scholar integration  
✅ PaperCard + SourceFilter components  
✅ Streaming results (3 papers/150ms)  
✅ PDF drop-zone + citation formatting  
✅ YearSlider component  
✅ WebView for direct URL navigation  

## Next Steps (Priority Order)

### Phase 2: Enhancement & Polish (2-3 days)
1. **Backend Streaming Service**: Implement Tauri command for streaming Semantic Scholar API
   - Chunked responses instead of all-at-once
   - Real 150ms streaming instead of frontend simulation
   
2. **Claude API Integration** (PDF Metadata):
   - Replace mock metadata with real PDF text extraction → Claude API call
   - Support for Chicago & BibTeX citation styles
   
3. **Search Refinement**:
   - Live query refinement box in results
   - Year-range filtering actually affects results
   - Source filtering backend logic

### Phase 3: Production Ready (1 week)
1. Error handling & edge cases
2. Keyboard shortcuts (Cmd+L for search, etc.)
3. History/recent searches
4. Settings panel for citation style preference
5. Desktop window controls + icon

## Architecture Notes

- **Intent Classification**: Regex (not LLM) — URL detection via `http(s)://` or `.` check
- **Generative UI**: Pre-defined React components (rigid) — no dynamic HTML/CSS
- **Streaming**: Frontend simulation currently; will move to backend Tauri command
- **PDF Processing**: Frontend drag-drop + Claude API for metadata (not pdfplumber)

## Component Contract

All generative components must be in `src/components/` and accept:
```tsx
interface GenerativeComponent {
  data: any // Component-specific data structure
  onFilter?: (filters: Record<string, any>) => void
}
```

Add new components only after documenting their expected data schema.

## API Keys / Configuration

Currently using public APIs (Semantic Scholar, arXiv). For production:
- Add `.env` for Claude API key (PDF metadata)
- Implement rate-limiting on Semantic Scholar calls

## Testing Strategy

- Manual testing in Tauri dev mode (npm run dev)
- Focus: intent routing, Semantic Scholar API calls, PDF upload
- No formal test suite yet (can add with Jest + React Testing Library)

## Known Issues

- Rust compilation may fail on first `npm run dev` if no Rust toolchain installed
- Semantic Scholar API has rate limits (100 requests/5 minutes)
- PDF metadata is currently mocked
