import { useState } from 'react'
import { invoke } from '@tauri-apps/api/tauri'
import SearchBar from './components/SearchBar'
import WebView from './components/WebView'
import SearchResults from './components/SearchResults'
import PDFDropZone from './components/PDFDropZone'

type ViewType = 'search-bar' | 'webview' | 'results' | 'pdf'

export default function App() {
  const [view, setView] = useState<ViewType>('search-bar')
  const [url, setUrl] = useState<string>('')
  const [query, setQuery] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async (input: string) => {
    setIsLoading(true)
    try {
      const result: { category: string; cleaned_query: string } = await invoke('classify_intent', {
        query: input,
      })

      if (result.category === 'url') {
        setUrl(result.cleaned_query)
        setView('webview')
      } else {
        setQuery(result.cleaned_query)
        setView('results')
      }
    } catch (error) {
      console.error('Intent classification error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToSearch = () => {
    setView('search-bar')
    setUrl('')
    setQuery('')
  }

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col">
      {view === 'search-bar' && (
        <SearchBar
          onSearch={handleSearch}
          isLoading={isLoading}
          onPDFMode={() => setView('pdf')}
        />
      )}
      {view === 'webview' && (
        <WebView url={url} onBack={handleBackToSearch} />
      )}
      {view === 'results' && (
        <SearchResults query={query} onBack={handleBackToSearch} />
      )}
      {view === 'pdf' && (
        <div className="flex-1 overflow-y-auto p-8">
          <div className="mb-8">
            <button
              onClick={handleBackToSearch}
              className="text-blue-400 hover:text-blue-300 mb-4"
            >
              ← Back to Search
            </button>
            <h2 className="text-3xl font-bold">PDF Citation Tool</h2>
            <p className="text-gray-400 mt-2">Upload academic papers to auto-extract metadata and generate citations</p>
          </div>
          <PDFDropZone />
        </div>
      )}
    </div>
  )
}
