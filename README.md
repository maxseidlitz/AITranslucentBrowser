# Lens - Generative-UI Browser

A desktop browser that generates intent-specific UIs instead of showing traditional search results. Built with Tauri + React.

## Features

### MVP (Phase 1)
- **Smart Intent Detection**: Automatically routes between URL navigation and search queries
- **Academic Search**: Integrated with Semantic Scholar API for paper discovery
- **Streaming Results**: Papers load incrementally for a smooth "building" experience
- **PDF Citation Tool**: Upload PDFs to auto-extract metadata and generate APA citations
- **Generative UI Components**: Pre-built component library (PaperCard, SourceFilter, YearSlider)

### Planned Features
- Multi-format citation styles (Chicago, BibTeX)
- Shopping category integration (intent-driven UI adaptation)
- PDF full-text search within uploaded documents
- Cloud sync and bookmarks
- Multi-tab support

## Architecture

```
User Input (URL or Query)
    ↓
[Intent Classifier] → regex-based, <50ms
    ↓
    ├→ URL → WebView (normal browser)
    └→ Query → Generative Pipeline
        ├→ [API Layer] Semantic Scholar/arXiv
        ├→ [Streaming] 3 results/150ms
        └→ [Renderer] Rigid React components
```

## Tech Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Desktop Shell**: Tauri 2 (Rust backend)
- **APIs**: Semantic Scholar, arXiv, CrossRef
- **PDF Processing**: pdfjs (frontend), Claude API (metadata)

## Development

```bash
# Install dependencies
npm install

# Run dev server (requires Rust + Tauri CLI)
npm run dev

# Build for desktop
npm run build
```

### Project Structure

```
.
├── src/
│   ├── App.tsx              # Main routing + state
│   ├── components/
│   │   ├── SearchBar.tsx    # Home view + PDF toggle
│   │   ├── SearchResults.tsx # Results with streaming
│   │   ├── PaperCard.tsx    # Paper component (rigid)
│   │   ├── PDFDropZone.tsx  # PDF upload + citation
│   │   └── SourceFilter.tsx # Filter sidebar
│   └── index.css            # Tailwind styles
├── src-tauri/
│   ├── src/main.rs          # Intent classifier
│   └── Cargo.toml
└── tauri.conf.json          # App config
```

## Component Library (Generative-UI)

Pre-defined components that LLM selects from (no dynamic CSS/HTML generation):

- `PaperCard`: Title, authors, year, citations, abstract
- `SourceFilter`: Checkboxes for arXiv, Semantic Scholar, CrossRef
- `YearSlider`: Range selector 2000–2026
- `SearchBar`: Live query refinement

## API Integration

### Semantic Scholar
- Free, no auth required
- Used for academic paper search
- 1 call per search

### arXiv (Future)
- Papers from computer science & physics
- Lower latency than Semantic Scholar

### CrossRef (Future)
- DOI resolution
- Citation metadata

## Design Decisions

1. **Regex-based Intent Classification**: Fast and reliable for 99% of cases
2. **Rigid Component Library**: Consistency and speed over flexibility
3. **Frontend PDF Processing**: No backend overhead for drag-and-drop
4. **Streaming UX**: Incremental rendering for "baut sich auf" feel
5. **No Custom HTML/CSS from LLM**: Prevents latency + CSS injection risks

## Known Limitations

- Shopping category requires external API (not Zara scraping)
- PDF metadata extraction is mock (Claude API integration pending)
- Single-language (English) for MVP
- No offline mode

## License

MIT
