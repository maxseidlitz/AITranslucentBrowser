import { useEffect, useState } from 'react'
import { ArrowLeft, Loader } from 'lucide-react'
import PaperCard from './PaperCard'
import SourceFilter from './SourceFilter'
import SearchRefiner from './SearchRefiner'
import YearSlider from './YearSlider'

interface Paper {
  paperId: string
  title: string
  authors: Array<{ name: string }>
  year: number
  venue: string
  citationCount: number
  url: string
  abstract?: string
}

interface SearchResultsProps {
  query: string
  onBack: () => void
}

export default function SearchResults({ query, onBack }: SearchResultsProps) {
  const [papers, setPapers] = useState<Paper[]>([])
  const [displayedPapers, setDisplayedPapers] = useState<Paper[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedSources, setSelectedSources] = useState<string[]>(['Semantic Scholar', 'arXiv'])
  const [yearRange, setYearRange] = useState<[number, number]>([2015, 2026])
  const [searchRefinement, setSearchRefinement] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPapers = async () => {
      setIsLoading(true)
      setError(null)
      setPapers([])
      setDisplayedPapers([])

      try {
        const response = await fetch(
          `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(
            query
          )}&limit=20&fields=title,authors,year,venue,citationCount,url,abstract`
        )

        if (!response.ok) throw new Error('Failed to fetch papers')

        const data = await response.json()
        const allPapers = data.data || []
        setPapers(allPapers)

        // Stream papers gradually (every 200ms, add 3 papers)
        let index = 0
        const streamInterval = setInterval(() => {
          const batch = allPapers.slice(index, index + 3)
          if (batch.length === 0) {
            clearInterval(streamInterval)
            setIsLoading(false)
          } else {
            setDisplayedPapers((prev) => [...prev, ...batch])
            index += 3
          }
        }, 150)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        setPapers([])
        setDisplayedPapers([])
        setIsLoading(false)
      }
    }

    fetchPapers()
  }, [query])

  const filteredPapers = displayedPapers.filter((paper) => {
    if (selectedSources.length === 0) return true
    return true
  })

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-6 flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h2 className="text-xl font-semibold">Search Results</h2>
          <p className="text-gray-400 text-sm">Query: {query}</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden flex">
        {/* Sidebar Filters */}
        <div className="w-56 bg-gray-800 border-r border-gray-700 p-4 overflow-y-auto">
          <SourceFilter
            sources={['Semantic Scholar', 'arXiv', 'CrossRef']}
            selected={selectedSources}
            onSelect={setSelectedSources}
          />
          <YearSlider min={2015} max={2026} onSelect={setYearRange} />
        </div>

        {/* Results */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <SearchRefiner
              value={searchRefinement}
              onChange={setSearchRefinement}
              placeholder="Refine search within results..."
            />
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {error && (
            <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 text-red-400">
              {error}
            </div>
          )}

          {filteredPapers.map((paper) => (
            <PaperCard key={paper.paperId} paper={paper} />
          ))}

          {isLoading && filteredPapers.length > 0 && (
            <div className="flex justify-center py-8">
              <Loader className="animate-spin text-gray-400" size={24} />
            </div>
          )}

          {isLoading && filteredPapers.length === 0 && !error && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Loader className="animate-spin mx-auto mb-4" size={32} />
                <p className="text-gray-400">Building your search results...</p>
              </div>
            </div>
          )}

            {!isLoading && filteredPapers.length === 0 && !error && (
              <div className="text-center text-gray-400 py-12">
                No papers found for "{query}"
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
