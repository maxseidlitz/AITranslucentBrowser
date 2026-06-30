import { useState } from 'react'
import { invoke } from '@tauri-apps/api/tauri'
import SearchBar from './components/SearchBar'
import WebView from './components/WebView'
import SearchResults from './components/SearchResults'

type ViewType = 'search-bar' | 'webview' | 'results'

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
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />
      )}
      {view === 'webview' && (
        <WebView url={url} onBack={handleBackToSearch} />
      )}
      {view === 'results' && (
        <SearchResults query={query} onBack={handleBackToSearch} />
      )}
    </div>
  )
}
