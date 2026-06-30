import { useEffect, useRef, useState } from 'react'
import { AlertCircle, Loader } from 'lucide-react'

interface GenerativeUIRendererProps {
  html: string
  isLoading: boolean
  error?: string
  onBack?: () => void
}

export default function GenerativeUIRenderer({
  html,
  isLoading,
  error,
  onBack,
}: GenerativeUIRendererProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [iframeLoaded, setIframeLoaded] = useState(false)

  useEffect(() => {
    if (html && iframeRef.current) {
      const iframeDoc =
        iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document

      if (iframeDoc) {
        // Add Tailwind CSS CDN for styling
        const htmlWithTailwind = html.replace(
          /<head>/i,
          `<head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              body { margin: 0; padding: 0; }
              * { box-sizing: border-box; }
            </style>
          `
        )

        iframeDoc.open()
        iframeDoc.write(htmlWithTailwind)
        iframeDoc.close()
        setIframeLoaded(true)
      }
    }
  }, [html])

  return (
    <div className="w-full h-full flex flex-col bg-gray-900">
      {onBack && (
        <div className="bg-gray-800 border-b border-gray-700 px-6 py-3 flex items-center">
          <button
            onClick={onBack}
            className="text-blue-400 hover:text-blue-300 text-sm font-medium"
          >
            ← Back
          </button>
        </div>
      )}

      {isLoading && !html && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader className="animate-spin mx-auto mb-4" size={32} />
            <p className="text-gray-400">Generating UI...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 m-6 text-red-400 flex items-start gap-3">
          <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold mb-1">UI Generation Error</h3>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {html && (
        <iframe
          ref={iframeRef}
          className="flex-1 border-none bg-white"
          sandbox="allow-same-origin"
          title="Generated UI"
        />
      )}

      {isLoading && html && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-none">
          <div className="bg-gray-800 rounded-lg p-4">
            <Loader className="animate-spin mx-auto" size={24} />
          </div>
        </div>
      )}
    </div>
  )
}
