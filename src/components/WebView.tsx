import { useEffect, useState } from 'react'
import { generateGenerativeUI } from '../lib/claude'
import GenerativeUIRenderer from './GenerativeUIRenderer'
import { AlertCircle } from 'lucide-react'

interface WebViewProps {
  url: string
  onBack: () => void
}

export default function WebView({ url, onBack }: WebViewProps) {
  const [generatedHTML, setGeneratedHTML] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [isGeneratingUI, setIsGeneratingUI] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [useOriginal, setUseOriginal] = useState(false)

  useEffect(() => {
    const fetchAndGenerateUI = async () => {
      setIsLoading(true)
      setIsGeneratingUI(true)
      setError(null)
      setGeneratedHTML('')

      try {
        // Fetch website content
        const response = await fetch(url)
        if (!response.ok) throw new Error('Failed to fetch website')

        const html = await response.text()

        // Extract title from HTML
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
        const title = titleMatch ? titleMatch[1] : new URL(url).hostname

        // Extract text content (strip HTML tags, limit to first 2000 chars)
        const textContent = html
          .replace(/<[^>]*>/g, ' ')
          .replace(/\s+/g, ' ')
          .substring(0, 2000)

        setIsLoading(false)

        // Generate UI with Claude
        setIsGeneratingUI(true)
        const uiResult = await generateGenerativeUI({
          context: 'website',
          data: {
            title,
            url,
            content: textContent,
          },
        })

        if (uiResult.success) {
          setGeneratedHTML(uiResult.html)
        } else {
          setError(uiResult.error || 'Failed to generate UI')
          setUseOriginal(true)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load website')
        setUseOriginal(true)
      } finally {
        setIsGeneratingUI(false)
      }
    }

    if (!useOriginal) {
      fetchAndGenerateUI()
    }
  }, [url, useOriginal])

  if (useOriginal) {
    return (
      <div className="flex-1 flex flex-col">
        <div className="bg-gray-800 border-b border-gray-700 p-4 flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            ← Back
          </button>
          <input
            type="text"
            value={url}
            readOnly
            className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded text-sm text-gray-300"
          />
          <button
            onClick={() => setUseOriginal(false)}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
          >
            Try Gen UI
          </button>
        </div>
        <iframe
          src={url}
          className="flex-1 border-none"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      </div>
    )
  }

  return (
    <div className="w-full h-full flex flex-col bg-gray-900">
      <div className="bg-gray-800 border-b border-gray-700 p-4 flex items-center gap-4">
        <button
          onClick={onBack}
          className="text-blue-400 hover:text-blue-300 text-sm font-medium"
        >
          ← Back
        </button>
        <input
          type="text"
          value={url}
          readOnly
          className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded text-sm text-gray-300"
        />
        <button
          onClick={() => setUseOriginal(true)}
          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm"
        >
          Original
        </button>
      </div>

      {error && (
        <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4 m-4 text-yellow-400 flex items-start gap-3">
          <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold mb-1">Generative UI Error</h3>
            <p className="text-sm">{error}</p>
            <button
              onClick={() => setUseOriginal(true)}
              className="text-sm mt-2 text-yellow-300 hover:text-yellow-200"
            >
              View original website →
            </button>
          </div>
        </div>
      )}

      <GenerativeUIRenderer
        html={generatedHTML}
        isLoading={isGeneratingUI}
        error={undefined}
      />
    </div>
  )
}
