import { useState } from 'react'
import { Search, Loader, FileText } from 'lucide-react'

interface SearchBarProps {
  onSearch: (query: string) => void
  isLoading: boolean
  onPDFMode: () => void
}

export default function SearchBar({ onSearch, isLoading, onPDFMode }: SearchBarProps) {
  const [input, setInput] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      onSearch(input)
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Lens</h1>
          <p className="text-gray-400 text-lg">Generative-UI Search</p>
        </div>

        <form onSubmit={handleSubmit} className="relative mb-6">
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Search papers, paste URLs, ask questions..."
              disabled={isLoading}
              className="w-full px-6 py-4 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="absolute right-4 p-2 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <Loader className="animate-spin" size={20} />
              ) : (
                <Search size={20} />
              )}
            </button>
          </div>
        </form>

        <div className="text-center">
          <button
            onClick={onPDFMode}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            <FileText size={18} />
            PDF Citation Tool
          </button>
        </div>

        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>Examples: "machine learning papers 2024" • "https://arxiv.org" • "spatial computing research"</p>
        </div>
      </div>
    </div>
  )
}
