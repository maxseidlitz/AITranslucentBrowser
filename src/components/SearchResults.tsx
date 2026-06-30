import { useEffect, useState } from 'react'
import { generateGenerativeUI } from '../lib/claude'
import GenerativeUIRenderer from './GenerativeUIRenderer'

interface SearchResultsProps {
  query: string
  onBack: () => void
}

export default function SearchResults({ query, onBack }: SearchResultsProps) {
  const [generatedHTML, setGeneratedHTML] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [isGeneratingUI, setIsGeneratingUI] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAndGenerateUI = async () => {
      setIsLoading(true)
      setIsGeneratingUI(true)
      setError(null)
      setGeneratedHTML('')

      try {
        // Fetch papers from Semantic Scholar
        const response = await fetch(
          `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(
            query
          )}&limit=15&fields=title,authors,year,venue,citationCount,url,abstract`
        )

        if (!response.ok) throw new Error('Failed to fetch papers')

        const data = await response.json()
        const allPapers = data.data || []
        setIsLoading(false)

        // Generate UI with Claude
        setIsGeneratingUI(true)
        const uiResult = await generateGenerativeUI({
          context: 'search',
          data: {
            query,
            papers: allPapers.map((p: any) => ({
              title: p.title,
              authors: p.authors?.map((a: any) => a.name) || [],
              year: p.year,
              abstract: p.abstract,
              url: p.url,
              citations: p.citationCount,
              venue: p.venue,
            })),
          },
        })

        if (uiResult.success) {
          setGeneratedHTML(uiResult.html)
        } else {
          setError(uiResult.error || 'Failed to generate UI')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsGeneratingUI(false)
      }
    }

    fetchAndGenerateUI()
  }, [query])

  return (
    <div className="w-full h-full flex flex-col bg-gray-900">
      <GenerativeUIRenderer
        html={generatedHTML}
        isLoading={isGeneratingUI}
        error={error || undefined}
        onBack={onBack}
      />
    </div>
  )
}
