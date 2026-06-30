import { useRef, useState } from 'react'
import { Upload, FileText, Copy, Check } from 'lucide-react'

interface CitationFormat {
  style: 'APA' | 'Chicago' | 'BibTeX'
  text: string
}

interface PDFMetadata {
  title?: string
  authors?: string[]
  year?: number
  journal?: string
  doi?: string
}

export default function PDFDropZone() {
  const [isDragging, setIsDragging] = useState(false)
  const [fileName, setFileName] = useState<string>('')
  const [metadata, setMetadata] = useState<PDFMetadata | null>(null)
  const [citation, setCitation] = useState<CitationFormat | null>(null)
  const [copied, setCopied] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handlePDFFile(files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handlePDFFile(e.target.files[0])
    }
  }

  const handlePDFFile = async (file: File) => {
    if (!file.name.endsWith('.pdf')) {
      alert('Please upload a PDF file')
      return
    }

    setFileName(file.name)

    // Simulate metadata extraction and citation generation
    // In production, this would call Claude API + pdfjs
    const mockMetadata: PDFMetadata = {
      title: 'Machine Learning for Spatial Computing',
      authors: ['John Smith', 'Jane Doe'],
      year: 2024,
      journal: 'ACM Conference on Computer Vision',
      doi: '10.1234/example.doi',
    }

    setMetadata(mockMetadata)

    // Generate APA citation
    const apaCitation = formatAPA(mockMetadata)
    setCitation({
      style: 'APA',
      text: apaCitation,
    })
  }

  const formatAPA = (meta: PDFMetadata): string => {
    const authors = meta.authors?.join(', ') || 'Unknown'
    const year = meta.year || 'n.d.'
    const title = meta.title || 'Untitled'
    const journal = meta.journal || 'Unknown Journal'

    return `${authors} (${year}). ${title}. ${journal}.`
  }

  const copyToClipboard = () => {
    if (citation) {
      navigator.clipboard.writeText(citation.text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-500/10'
            : 'border-gray-600 hover:border-gray-500 bg-gray-800/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileInput}
          className="hidden"
        />

        <Upload className="mx-auto mb-4 text-gray-400" size={32} />
        <h3 className="text-lg font-semibold mb-2">Drop PDF here</h3>
        <p className="text-gray-400">or click to select a file</p>
      </div>

      {metadata && fileName && (
        <div className="mt-8 space-y-6">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-start gap-3 mb-6">
              <FileText size={24} className="text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-lg">{fileName}</h4>
                <p className="text-sm text-gray-400">Metadata extracted</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {metadata.title && (
                <div>
                  <label className="text-sm text-gray-400">Title</label>
                  <p className="text-white">{metadata.title}</p>
                </div>
              )}
              {metadata.authors && (
                <div>
                  <label className="text-sm text-gray-400">Authors</label>
                  <p className="text-white">{metadata.authors.join(', ')}</p>
                </div>
              )}
              {metadata.year && (
                <div>
                  <label className="text-sm text-gray-400">Year</label>
                  <p className="text-white">{metadata.year}</p>
                </div>
              )}
              {metadata.journal && (
                <div>
                  <label className="text-sm text-gray-400">Journal</label>
                  <p className="text-white">{metadata.journal}</p>
                </div>
              )}
            </div>

            {citation && (
              <div className="border-t border-gray-700 pt-6">
                <label className="text-sm text-gray-400 block mb-3">{citation.style} Citation</label>
                <div className="bg-gray-900 rounded p-4 flex justify-between items-start gap-4">
                  <p className="text-sm text-gray-300 flex-1 break-words">{citation.text}</p>
                  <button
                    onClick={copyToClipboard}
                    className="flex-shrink-0 p-2 hover:bg-gray-700 rounded transition-colors"
                  >
                    {copied ? (
                      <Check size={18} className="text-green-400" />
                    ) : (
                      <Copy size={18} className="text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
