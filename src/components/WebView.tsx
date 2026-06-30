import { ArrowLeft } from 'lucide-react'

interface WebViewProps {
  url: string
  onBack: () => void
}

export default function WebView({ url, onBack }: WebViewProps) {
  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-gray-800 border-b border-gray-700 p-4 flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <input
          type="text"
          value={url}
          readOnly
          className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded text-sm text-gray-300"
        />
      </div>
      <iframe
        src={url}
        className="flex-1 border-none"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
      />
    </div>
  )
}
